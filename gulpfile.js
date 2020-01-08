var gulp   = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  runSequence = require('run-sequence').use(gulp),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),
  destPath = './dll/ucim/',
  entryPath = './src/project/pc/www/static/ucim/'
 
gulp.task('build', function(callback) {
  runSequence(['clean'], ['build-scripts'])
})
 
gulp.task('clean', function(){
  return gulp.src('./dll/ucim')
    .pipe(clean())
})
 
gulp.task('build-scripts', function() {
  return gulp.src([
    entryPath+'long.js',
    entryPath+'bytebuffer.js',
    entryPath+'websocket.js',
    entryPath+'jsencrypt.js',
    entryPath+'uc.im.sdk.js'
  ])
    .pipe(concat('ucim.1.0.0.min.js'))
    // .pipe(rev())
    .pipe(uglify()) //压缩
    .pipe(gulp.dest(destPath))
    // .pipe(rev.manifest()) //生成rev-mainfest.json文件作为记录
    .pipe(gulp.dest(destPath))
})
 
gulp.task('rev', function () {
  return gulp.src([`${destPath}/*.json`, destPath+'*.js'])
    .pipe( revCollector({
      replaceReved: true
    }) )
    .pipe( gulp.dest('./ucim') )
})