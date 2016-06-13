var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename');


gulp.task('webServe', function () {
    connect.server({
        root: 'www/',
        livereload: true
    });
});

/**压缩js */
gulp.task('miniJs',function(){
    return gulp.src('./www/js/**/*.js').pipe(uglify()).pipe(rename({
        extname: ".min.js"
    })).pipe(gulp.dest('./www/mini'));
});
/**压缩CSS */
gulp.task('miniCss',function(){
    return gulp.src('./www/css/**/*.css').pipe(minifyCss()).pipe(rename({
        extname: ".min.css"
    })).pipe(gulp.dest('./www/css'));
});

// /**合并文件 */
// gulp.task('concatJs',function () {
//     return gulp.src('./www/js/**.js').pipe(concat()).pipe(gulp.dest('./www/'));
// })
// gulp.task('concatCss',function () {
//     return gulp.src
// })

/** Sass编译 */
gulp.task('sass',function() {
    return gulp.src('./www/sass/**/*.scss').pipe(sass().on('error',sass.logError)).pipe(gulp.dest('./www/css'))
});
/** 自动刷新 */
gulp.task('html', function () {
    gulp.src('./www/**/*.html').pipe(connect.reload());
})
gulp.task('js', function () {
    gulp.src('./www/js/**/*.js').pipe(connect.reload());
})
gulp.task('css', function () {
    gulp.src('./www/css/**/*.css').pipe(connect.reload());
})

/**监视任务 */
gulp.task('watch', function () {
    gulp.watch(['./www/**/*.html'], ['html']);
    gulp.watch(['./www/js/**/*.js'], ['js']);  
    gulp.watch(['./www/css/**/*.css'], ['css']); 
    gulp.watch('./www/sass/**/*.scss', ['sass']); 
})


gulp.task('default',['webServe','watch']);