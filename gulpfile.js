var
  gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');

var paths = {
  scripts: ['src/*.coffee']
};

gulp.task('coffee', function() {
  return gulp.src(paths.scripts)
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('build'));
});

gulp.task('uglify', ['coffee'], function() {
  return gulp.src(['build/*.js', '!build/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['uglify']);
});

gulp.task('default', ['uglify']);