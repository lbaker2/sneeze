var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');


var compileJS = function(){
	gulp.src('public/javascripts/dev/index.js')
		.pipe(browserify({
			// shim: {
			// 	'sneeze': {
			// 		path: './public/javascripts/sneeze.js',
   //        exports: 'Sneeze'
			// 	}
			// },
			insertGlobals: false,
			debug: true
		}))
		.pipe(gulp.dest('./public/javascripts/build'));
}
gulp.task('js', function(){
	compileJS();
});

gulp.task('js:watch', function(){
	gulp.watch('public/javascripts/dev/*.js', ['js'])
})