/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass-compile', function () {
    gulp.src('./assets/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./assets/scss/css/'));
});

gulp.task('watch-sass', function () {
    gulp.watch('./assets/scss/*.scss', ['sass-compile']);
});