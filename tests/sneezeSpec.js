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
			extras: { 'keywords': ['foo', 'bar'] }
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
			expect(Sneeze.getConfig().extras).toBe(configurations.extras);
		});

		describe('extra information to be sent', function(){
			it('can be a function', function(){
				var extra = function(){};
				Sneeze.configure({extras: extra});
				expect(Sneeze.getConfig().extras).toBe(extra);
			});

			it('can be a plain object', function(){
				var extra = {};
				Sneeze.configure({extras: extra});
				expect(Sneeze.getConfig().extras).toBe(extra);
			});
		});
	});

	describe('logging errors', function(){
		it('returns early if sneeze is not enabled', function(){
			pending();
		});
		it('expects an error like object', function(){
			pending();
		});
		it('parses an error passed in', function(){
			pending();
		});
		it('adds any additional information desired', function(){
			pending();
		});
		it('sends the error to the server', function(){
			pending();
		});
		describe('a failed response', function(){
			it('sets sneeze to disabled', function(){
				pending();
			});		
		});
	});

	describe('parsing errors', function(){
		it('expects an error like object', function(){
			pending();
		});
		it('returns an object', function(){
			pending();
		});
		it('returns the script source of the error', function(){
			pending();
		});
		it('returns the line number of the error', function(){
			pending();
		});
		it('returns the col number of the error', function(){
			pending();
		});
		it('returns the browser information', function(){
			pending();
		});
		it('returns the error stack', function(){
			pending();
		});
	});

	describe('setting up a global error handler', function(){
		it('listens for errors on the window object', function(){
			pending();
		});
		it('logs the error', function(){
			pending();
		});
		it('can execute a callback', function(){
			pending();
		});
	});

	describe('setting up an error handler for a scoped set of logic', function(){
		it('will execute a block of code given as the first argument', function(){
			pending();
		});
		it('logs any errors', function(){
			pending();
		});
		it('prevents global error handler from logging the error', function(){
			pending();
		})
		it('can execute a callback', function(){
			pending();
		});
	});

});