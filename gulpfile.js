var gulp   = require('gulp')
  , util   = require('util')
  , coffee = require('gulp-coffee');

gulp.task('default', function() {
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', util.log))
    .pipe(gulp.dest('./lib/'))
});

