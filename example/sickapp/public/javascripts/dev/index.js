var Sneeze 					= require('./sneeze.js'),
		ErrorGenerator 	= require('./errorGenerator.js');

var Demo = (function(){
	Sneeze.listen();
	ErrorGenerator();
});

Demo();
