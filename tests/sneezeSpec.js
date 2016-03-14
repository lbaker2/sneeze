var Sneeze = require('../src/sneeze');

describe('Sneeze', function(){
	it('is an object', function(){
		expect(typeof Sneeze).toBe('object');
	});

	describe('exposed methods', function(){

		it('configure', function(){
			expect(Sneeze.configure).toBeDefined();
		});
		it('listen', function(){
			expect(Sneeze.listen).toBeDefined();
		});
		it('catch', function(){
			expect(Sneeze.catch).toBeDefined();
		});
		it('log', function(){
			expect(Sneeze.log).toBeDefined();
		});
		it('getErrorInfo', function(){
			expect(Sneeze.getErrorInfo).toBeDefined();
		});

	});
	
	describe('configuring Sneeze', function(){
		var configurations = {
			url: '/foo',
			data: { 'keywords': ['foo', 'bar'] }
		}

		it('configures Sneeze error path to \'/errors\' by default', function(){
			expect(Sneeze.getConfig().url).toBe('/errors');
		});

		it('can configure Sneeze error path to a desired url', function(){
			Sneeze.configure(configurations);
			expect(Sneeze.getConfig().url).toBe('/foo')
		});

		it('expects an object to be passed if an argument is passsed', function(){
			Sneeze.configure('foobar')
			expect(Sneeze.getConfig().url).toBe(configurations.url);
		});

		it('can store extra information to be sent to the server', function(){
			expect(Sneeze.getConfig().data).toBe(configurations.data);
		});

		describe('extra information to be sent', function(){
			it('can be a function', function(){
				var extra = function(){};
				Sneeze.configure({data: extra});
				expect(Sneeze.getConfig().data).toBe(extra);
			});

			it('can be a plain object', function(){
				var extra = {};
				Sneeze.configure({data: extra});
				expect(Sneeze.getConfig().data).toBe(extra);
			});
		});
	});

	describe('logging errors', function(){
		var configuration = { data: function(error){ return 'foo' }},
				err;

		beforeEach(function(){
			Sneeze.enable();
			err = new Error('Test Error');
			spyOn(Sneeze, 'sendError');
			spyOn(Sneeze, 'getErrorInfo').and.returnValue({});
		});
		
		it('returns early if sneeze is not enabled', function(){
			Sneeze.disable();
			expect(Sneeze.log(err)).toBe(false);
		});
		it('parses an error passed in', function(){
			Sneeze.log(err);
			expect(Sneeze.getErrorInfo).toHaveBeenCalled();
		});
		it('adds any additional information desired', function(){
			spyOn(Sneeze, 'getAdditionalData').and.callThrough();
			Sneeze.log(err);
			expect(Sneeze.getAdditionalData).toHaveBeenCalled();
		});
		it('sends the error to the server', function(){
			Sneeze.log(err);
			expect(Sneeze.sendError).toHaveBeenCalled();
		});
		describe('a failed response', function(){
			it('sets sneeze to disabled', function(){
				spyOn(Sneeze, 'disable').and.callThrough();
				Sneeze.sendError.and.callFake(function(){ throw new Error('Something bad happened when sending the error')});
				Sneeze.log(err);
				expect(Sneeze.disable).toHaveBeenCalled();
			});		
		});
	});

	describe('additional information', function(){
		describe('as a function', function(){
			var obj = {}, err = new Error('Test Error'), options, data;
			obj.myFn = function(error){ return 'foo' };

			beforeEach(function(){
				spyOn(obj, 'myFn').and.callThrough();
				options = { data: obj.myFn }
				data = Sneeze.getAdditionalData(err, options);
			});

			it('will call the function with the error passed to getAdditionalData', function(){
				expect(obj.myFn).toHaveBeenCalledWith(err);
			});

			it('returns the result of the function', function(){
				expect(data).toBe('foo');
			});
		});

		it('can be anything else', function(){
			expect(Sneeze.getAdditionalData(new Error(), {data:'foo'})).toBe('foo');
		});
	});

	describe('parsing errors', function(){
		var err = { stack: 'Error: This is an error\n    at Error (native)\n    at HTMLButtonElement.module.exports.btn.onclick (http://test.com/test.js:1:1)'};

		it('expects an error like object', function(){
			expect(function(){ Sneeze.getErrorInfo() }).toThrow();
		});

		describe('returned information', function(){
			var resp;
			beforeEach(function(){
				resp = Sneeze.getErrorInfo(err)
			});
			it('is an object', function(){
				expect(typeof resp).toBe('object');
			});
			it('includes the script source of the error', function(){
				expect(resp.source).toBeDefined();
			});
			it('includes the line number of the error', function(){
				expect(resp.lineno).toBeDefined();
			});
			it('includes the col number of the error', function(){
				expect(resp.colno).toBeDefined();
			});
			it('includes the browser information', function(){
				expect(resp.browser).toBeDefined();
			});
			it('includes the error stack', function(){
				expect(resp.stack).toBeDefined();
			});
		});
	});

	describe('setting up a global error handler', function(){
		var called = false, callback = function(){ called = true;};

		beforeEach(function(){
			spyOn(Sneeze, 'log');
			spyOn(Sneeze, 'processError').and.callThrough();
			called = false;
			jasmine.CATCH_EXCEPTIONS = false;
			Sneeze.listen(callback);
		});

		afterEach(function(){
			jasmine.CATCH_EXCEPTIONS = true;
			window.onerror = function(){};
		});

		it('listens for errors on the window object', function(){
			
			window.onerror.call(window);
			expect(Sneeze.processError).toHaveBeenCalled();
		});
		it('logs the error', function(){
			window.onerror.call(window);
			expect(Sneeze.log).toHaveBeenCalled();
		});
		it('can execute a callback', function(){
			window.onerror.call(window);
			expect(called).toBe(true);
		});
	});

	describe('setting up an error handler for a scoped set of logic', function(){

		var badCalled = false,
				badFn = function(){ badCalled = true; throw new Error('Bad!')},
				called = false,
				callback = function(){ called = true; };

		beforeEach(function(){
			called = false;
			badCalled= false;
			spyOn(Sneeze, 'log');
			spyOn(Sneeze, 'processError');
			Sneeze.listen();
			Sneeze.catch(badFn, callback);
		});

		afterEach(function(){
			jasmine.CATCH_EXCEPTIONS = true;
			window.onerror = function(){};
		});

		it('will execute a block of code given as the first argument', function(){
			expect(badCalled).toBe(true);
		});
		it('logs any errors', function(){
			expect(Sneeze.log).toHaveBeenCalled();
		});
		it('prevents global error handler from logging the error', function(){
			expect(Sneeze.processError).not.toHaveBeenCalled();
		})
		it('can execute a callback', function(){
			expect(called).toBe(true);
		});
	});

});