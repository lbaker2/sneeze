var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('js', function(){
	gulp.src('src/sneeze.js')
		.pipe(browserify({
			insertGlobals: true,
			debug: true
		}))
		.pipe(gulp.dest('./build'));
});