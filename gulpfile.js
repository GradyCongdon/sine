var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var inline = require("gulp-inline");
var uglify = require("gulp-uglify");
var del = require('del');
var webserver = require("gulp-webserver");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var paths = {
  scripts: 'src/*.es6',
  styles: 'src/*.s?ss',
  html: 'src/*.html',
}


gulp.task('default', ['clean', 'dev']); // TODO make series
gulp.task('dev', ['js', 'sass', 'copy', 'watch']);

function handleError(error) {
  console.error(String(error));
  this.emit('end');
}

gulp.task('clean', function() {
  return del('/dist/*');
});

gulp.task('js', function(){

  var b = browserify({
    entries: 'src/app.es6',
    debug: true
  });
  return b
    .transform("babelify", {presets: ['latest']})
    .on('error', handleError)
    .bundle()
    .on('error', handleError)
    .pipe(source('app.es6'))
    .pipe(buffer())
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  return gulp.src(paths.styles)
      .pipe(sass().on('error', sass.logError))
      .pipe(rename({ extname: '.css'}))
      .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
  return gulp.src(paths.html)
      .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.html, ['copy']);
})

/*
gulp.task('inline', ['js', 'sass', 'copy'], function() {
  gulp.src('dist/index.html')
  .pipe(inline({
    base: 'dist/',
    js: uglify,
    disabledTypes: ['svg', 'img'],
  }))
  .pipe(gulp.dest('dist/'));
});
*/

gulp.task('pages', function() {
  return gulp.src(['dist/style.css', 'dist/app.js', 'dist/index.html'])
      .pipe(gulp.dest('docs'));
});

gulp.task('serve', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      fallback: 'index.html',
      host: '0.0.0.0',
    }));
});
