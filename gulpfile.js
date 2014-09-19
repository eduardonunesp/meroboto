var gulp   = require('gulp')
  , util   = require('util')
  , coffee = require('gulp-coffee')
  , mocha = require('gulp-mocha');

gulp.task('default', function() {
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', util.log))
    .pipe(gulp.dest('./lib/'));
});
    
gulp.task('test', function() {
  gulp.src('test/test.js', {read: false})
    .pipe(mocha());
});