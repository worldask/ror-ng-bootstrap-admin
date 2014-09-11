var gulp = require('gulp'),
    //load-scripts = require('gulp-load-scripts'),
    del = require('del'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    ngmin = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    minify_css = require('gulp-minify-css'),
    concat = require('gulp-concat');

var paths = {
  js: ['app/assets/javascripts/*.js'],
  scss: ['app/assets/stylesheets/*.scss'],
  css: ['app/assets/stylesheets/*.css'],
  js_admin: ['app/assets/javascripts/admin/*.js'],
  scss_admin: ['app/assets/stylesheets/admin/*.scss'],
  css_admin: ['app/assets/stylesheets/admin/*.css'],
  dest: 'public/assets'
};

gulp.task('clean', function(cb) {
   del(paths.dest, cb);
});
    
gulp.task('vendor_js', function () {
  return gulp.src([
    'vendor/assets/bower_components/angular/angular.js',
    'vendor/assets/bower_components/angular-animate/angular-animate.js',
    'vendor/assets/bower_components/angular-route/angular-route.js',
    'vendor/assets/bower_components/jquery/src/jquery.js',
    'vendor/assets/bower_components/bootstrap/dist/js/bootstrap.js',
    'vendor/assets/bower_components/angular/angular.js',
    ])
             .pipe(changed(paths.dest))
             .pipe(uglify())
             .pipe(concat('vendor.js'))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('vendor_css', function () {
  return gulp.src([
    'vendor/assets/bower_components/bootstrap/dist/css/bootstrap.css',
    'vendor/assets/bower_components/font-awesome/css/font-awesome.css',
    ])
             .pipe(changed(paths.dest))
             .pipe(minify_css())
             .pipe(concat('vendor.css'))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('vendor_fonts', function () {
  return gulp.src([
    'vendor/assets/bower_components/font-awesome/fonts/fontawesome-webfont.eot',
    'vendor/assets/bower_components/font-awesome/fonts/fontawesome-webfont.woff',
    'vendor/assets/bower_components/font-awesome/fonts/fontawesome-webfont.ttf',
    'vendor/assets/bower_components/font-awesome/fonts/fontawesome-webfont.svg'
    ])
             .pipe(changed(paths.dest))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('js', ['clean'], function () {
  return gulp.src(paths.js)
             .pipe(changed(paths.dest))
             .pipe(jshint())
             //.pipe(jshint.reporter('js'))
              .pipe(uglify())
             .pipe(ngmin())
             .pipe(concat('app.js'))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
             .pipe(changed(paths.dest))
             .pipe(sass())
             .pipe(gulp.dest('app/assets/stylesheets'));
});

gulp.task('css', ['clean', 'scss'], function () {
  return gulp.src(paths.css)
//             .pipe(changed(paths.dest))
             .pipe(sass())
             .pipe(minify_css())
             .pipe(concat('app.css'))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('js_admin', ['clean'], function () {
  return gulp.src(paths.js_admin)
             .pipe(changed(paths.dest))
             .pipe(jshint())
             //.pipe(jshint.reporter('js'))
              .pipe(uglify())
             .pipe(ngmin())
             .pipe(concat('app_admin.js'))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('scss_admin', function () {
  return gulp.src(paths.scss_admin)
             .pipe(changed(paths.dest))
             .pipe(sass())
             .pipe(gulp.dest('app/assets/stylesheets/admin'));
});

gulp.task('css_admin', ['clean', 'scss_admin'], function () {
  return gulp.src(paths.css_admin)
//             .pipe(changed(paths.dest))
             .pipe(sass())
             .pipe(minify_css())
             .pipe(concat('app_admin.css'))
             .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.js_admin, ['js_admin']);
  gulp.watch(paths.css_admin, ['css_admin']);
});

gulp.task('default', ['vendor_js', 'vendor_css', 'vendor_fonts', 'js', 'scss', 'css', 'js_admin', 'scss_admin', 'css_admin']);
