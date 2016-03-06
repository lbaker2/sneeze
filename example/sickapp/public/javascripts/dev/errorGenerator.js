// errorGenerator.js
// Pass sneeze as an argument to inject it into the closure scope...
// this makes lookups for the sneeze object closer in the scope chain
module.exports = (function(){
	var btn = document.getElementById('error-generator');

	btn.onclick = function(){
		throw Error('This button is sick');
	}
});