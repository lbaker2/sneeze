var Sneeze = require('../src/sneeze');

describe('Sneeze', function(){
	it('is an object', function(){
		expect(typeof Sneeze).toBe('object');
	});

	describe('exposed methods', function(){

		it('configure', function(){ expect(Sneeze.configure).toBeDefined(); });
		it('listen', function(){ expect(Sneeze.listen).toBeDefined(); });
		it('catch', function(){ expect(Sneeze.catch).toBeDefined(); });
		it('log', function(){ expect(Sneeze.log).toBeDefined(); });
		it('getErrorInfo', function(){ expect(Sneeze.getErrorInfo).toBeDefined(); });

	});
	
	describe('configuring Sneeze', function(){
		it('configures Sneeze error path to \'/errors\' by default');

		it('can configure Sneeze error path to a desired url');

		it('expects an object to be passed if an argument is passsed');
	});

	describe('logging errors', function(){
		it('returns early if sneeze is not enabled');
		it('expects an error like object');
		it('parses an error passed in');
		it('sends the error to the server');
		describe('a failed response', function(){
			it('sets sneeze to disabled');		
		});
	});

	describe('parsing errors', function(){
		it('expects an error like object');
		it('returns an object');
		it('returns the script source of the error');
		it('returns the line number of the error');
		it('returns the col number of the error');
		it('returns the browser information');
		it('returns the error stack');
	});

	describe('setting up a global error handler', function(){

	});

	describe('setting up an error handler for a scoped set of logic', function(){

	});

});