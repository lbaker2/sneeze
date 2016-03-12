var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
 
gulp.task('browserify', function() {
  return browserify('./src/sneeze.js')
      .bundle()
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('sneeze-built.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('./build/'));
});