var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
//
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
// var cssnano = require("gulp-cssnano");

var paths = {
  scripts: 'src/*.es6',
  styles: 'src/*.s?ss',
  html: 'src/*.html',
}


gulp.task('default',['copy', 'js', 'sass', 'watch']);

function handleError(error) {
  console.error(String(error));
  this.emit('end');
}

gulp.task('js', function(){
  return gulp.src(paths.scripts)
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['latest']
      }))
      .on('error', handleError)
      .pipe(rename({extname: '.js'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'));
});

gulp.task('js-prod', function(){
  return gulp.src(paths.scripts)
      .pipe(babel({ presets: ['es2015'] }))
    //  .pipe(concat('all.js'))
   //    .pipe(uglify())
      .pipe(rename("all.min.js"))
      .pipe(gulp.dest('dist'));
});

gulp.task('babel', function(){
  return gulp.src(paths.scripts)
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(rename("all-ES2015.js"))
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

gulp.task('pages', function() {
  return gulp.src('dist/*')
      .pipe(gulp.dest('docs'));
});

gulp.task('watch', function() {
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.html, ['copy']);
})
