/*eslint-env node */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
//const jasmine = require('gulp-jasmine-phantom');
const imagemin = require('gulp-imagemin');
const imageminWebp = require('imagemin-webp');
const rename = require('gulp-rename');
const gzip = require('gulp-gzip');

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function() {

  browserSync.init({
    proxy: 'localhost:1337',
  });

  gulp.watch('assets/sass/**/*.scss', ['styles']);
  gulp.watch('assets/js/**/*.js', ['lint', 'scripts']);
  gulp.watch('assets/sw.js', ['sw']);
  gulp.watch('assets/resources/*', ['resources']);
  gulp.watch('assets/img/*', ['images']);
  gulp.watch('views/**/*.ejs').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function() {
  return gulp.src('assets/sass/**/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/styles'))
    .pipe(gzip())
    .pipe(gulp.dest('.tmp/public/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src('assets/js/**/*.js')
    //.pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/js'))
    .pipe(gzip())
    .pipe(gulp.dest('.tmp/public/js'))
    .pipe(browserSync.stream());
});

gulp.task('sw', function() {
  return gulp.src('assets/sw.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('.tmp/public'))
    .pipe(browserSync.stream());
});

gulp.task('resources', function() {
  return gulp.src('assets/resources/*')
    .pipe(gulp.dest('.tmp/public/resources'))
    .pipe(gzip())
    .pipe(gulp.dest('.tmp/public/resources'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function() {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['assets/js/**/*.js','!node_modules/**'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format());
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    //.pipe(eslint.failOnError());
});

gulp.task('images', function () {
  gulp.src('assets/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('.tmp/public/img'))
    .pipe(imagemin([
      imageminWebp({quality: 50})
    ]))
    .pipe(rename({
      extname: '.webp'
    }))
    .pipe(gulp.dest('.tmp/public/img/'))
    .pipe(browserSync.stream());
});

gulp.task('tests', function () {

});

gulp.task('default', ['serve', 'styles', 'lint', 'scripts', 'sw', 'resources']);
