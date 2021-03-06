var gulp = require('gulp'),
    //load-scripts = require('gulp-load-scripts'),
    del = require('del'),
    //changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    ngmin = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    minify_css = require('gulp-minify-css'),
    concat = require('gulp-concat');

var paths = {
  bower: 'vendor/assets/bower_components',
  js: 'app/assets/javascripts/*.js',
  scss: 'app/assets/stylesheets/*.scss',
  css: 'app/assets/stylesheets/*.css',
  dest_dev: 'app/assets',
  dest: 'public/assets',
  js_admin: 'app/assets/javascripts/admin/*.js',
  scss_admin: 'app/assets/stylesheets/admin/*.scss',
  css_admin: 'app/assets/stylesheets/admin/*.css',
  dest_admin_dev: 'app/assets/admin',
  dest_admin: 'public/assets/admin'
};

gulp.task('clean', function(cb) {
   del(paths.dest, cb);
});

gulp.task('vendor_js', function () {
  var files = [
    paths.bower + '/jquery/dist/jquery.min.js',
    paths.bower + '/angular/angular.min.js',
    paths.bower + '/angular-animate/angular-animate.min.js',
    paths.bower + '/angular-route/angular-route.min.js',
    paths.bower + '/bootstrap/dist/js/bootstrap.min.js',
    paths.bower + '/angular-ui-tree/dist/angular-ui-tree.min.js',
    //paths.bower + '/bootstrap-datepicker-n9/js/bootstrap-datepicker.js',
    //paths.bower + '/bootstrap-datepicker-n9/js/locales/bootstrap-datepicker.zh-CN.js',
    //paths.bower + '/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
    paths.bower + '/spinjs/spin.js',
    paths.bower + '/iOS-Overlay/js/iosOverlay.js',
    paths.bower + '/noty/js/noty/jquery.noty.js',
    paths.bower + '/noty/js/noty/layouts/bottomRight.js',
    paths.bower + '/noty/js/noty/themes/default.js'
  ];

  return gulp.src(files)
  .pipe(ngmin())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(paths.dest_admin_dev))
  .pipe(gulp.dest(paths.dest_admin));
});

gulp.task('vendor_css', function () {
  var files = [
    paths.bower + '/font-awesome/css/font-awesome.min.css',
    paths.bower + '/bootstrap/dist/css/bootstrap.min.css',
    //paths.bower + '/bootstrap-datepicker-n9/css/datepicker3.css',
    //paths.bower + '/angular-bootstrap-nav-tree/dist/abn_tree.css',
    paths.bower + '/iOS-Overlay/css/iosOverlay.css',
    paths.bower + '/angular-ui-tree/dist/angular-ui-tree.min.css'
  ];

  return gulp.src(files)
  .pipe(minify_css())
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest(paths.dest_admin_dev))
  .pipe(gulp.dest(paths.dest_admin));
});

gulp.task('vendor_fonts', function () {
  var files = [
    paths.bower + '/font-awesome/fonts/fontawesome-webfont.eot',
    paths.bower + '/font-awesome/fonts/fontawesome-webfont.woff',
    paths.bower + '/font-awesome/fonts/fontawesome-webfont.ttf',
    paths.bower + '/font-awesome/fonts/fontawesome-webfont.svg'
  ];

  return gulp.src(files)
  .pipe(gulp.dest('app/assets/fonts'))
  .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('js', ['clean'], function () {
  return gulp.src(paths.js)
  .pipe(jshint())
  //.pipe(jshint.reporter('js'))
  .pipe(uglify())
  .pipe(ngmin())
  .pipe(concat('app.js'))
  .pipe(gulp.dest(paths.dest_dev))
  .pipe(gulp.dest(paths.dest));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
  .pipe(sass())
  .pipe(gulp.dest('app/assets/stylesheets'));
});

gulp.task('css', ['clean', 'scss'], function () {
  return gulp.src(paths.css)
  .pipe(sass())
  .pipe(minify_css())
  .pipe(concat('app.css'))
  .pipe(gulp.dest(paths.dest));
});

gulp.task('js_admin_app', function () {
  var files = [
    'app/assets/javascripts/admin/root.js',
    'app/assets/javascripts/admin/validation.js',
    'app/assets/javascripts/admin/crud.js',
    'app/assets/javascripts/admin/filters.js',
    'app/assets/javascripts/admin/directives.js',
    'app/assets/javascripts/admin/util.js'
  ];

  return gulp.src(files)
  .pipe(jshint())
  //.pipe(jshint.reporter('js'))
  //.pipe(uglify())
  //.pipe(ngmin())
  .pipe(concat('app.js'))
  .pipe(gulp.dest(paths.dest_admin_dev))
  .pipe(gulp.dest(paths.dest_admin));
});

gulp.task('js_admin', function () {
  var files = [paths.js_admin, 
    '!app/assets/javascripts/admin/root.js',
    '!app/assets/javascripts/admin/validation.js',
    '!app/assets/javascripts/admin/crud.js',
    '!app/assets/javascripts/admin/filters.js',
    '!app/assets/javascripts/admin/directives.js',
    '!app/assets/javascripts/admin/util.js',
    paths.bower + '/geopattern/js/geopattern.min.js',
  ];

  return gulp.src(files)
  .pipe(jshint())
  //.pipe(uglify())
  //.pipe(ngmin())
  .pipe(gulp.dest(paths.dest_admin_dev))
  .pipe(gulp.dest(paths.dest_admin));
});

gulp.task('scss_admin', function () {
  return gulp.src(paths.scss_admin)
  .pipe(sass())
  .pipe(gulp.dest('app/assets/stylesheets/admin'));
});

gulp.task('css_admin', ['scss_admin'], function () {
  return gulp.src(paths.css_admin)
  .pipe(sass())
  .pipe(minify_css())
  .pipe(concat('app.css'))
  .pipe(gulp.dest(paths.dest_admin));
});

gulp.task('watch', function() {
  gulp.watch(paths.js_admin, ['js_admin', 'js_admin_app']);
  gulp.watch(paths.scss_admin, ['scss_admin', 'css_admin']);
});

//gulp.task('default', ['vendor_js', 'vendor_css', 'vendor_fonts', 'js_app', 'js', 'scss', 'css']);
gulp.task('default', ['vendor_js', 'vendor_css', 'vendor_fonts',  'js_admin_app', 'js_admin', 'scss_admin', 'css_admin']);
