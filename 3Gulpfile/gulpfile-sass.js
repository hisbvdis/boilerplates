// =================================================================
// COMMANDS
// =================================================================
// - gulp: Run dev server
// - gulp prod: Run prod server
// - gulp build: Build prod server



// =================================================================
// PACKAGES
// =================================================================
// SERVICE
// npm i -D  gulp  browser-sync  dev-ip
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const devip = require("dev-ip");
const run = require("gulp-run");

// HTML
// npm i -D  gulp-htmlmin
const htmlmin = require("gulp-htmlmin");

// STYLES
// npm i -D  sass  gulp-sass  gulp-sourcemaps
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

// STYLES (CSS)
// npm i -D  postcss  gulp-postcss  postcss-import  autoprefixer  postcss-csso
const postcss = require('gulp-postcss');

// IMAGES
// npm i -D  gulp-svgmin  gulp-svgstore  gulp-imagemin
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
const imagemin = require("gulp-imagemin");

// FILES
// npm i -D  gulp-rename  gulp-clean
const rename = require("gulp-rename");
const clean = require("gulp-clean");



// =================================================================
// SERVER
// =================================================================
// Dev server
gulp.task("default", function() {
  browsersync.init({
    server: "src",
    host: devip(), // From "dev-ip" extension
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });

  gulp.watch("src/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("src/*.html").on("change", browsersync.reload);
  gulp.watch("src/js/**/*.js").on("change", browsersync.reload);
  gulp.watch("src/img/svg-1-inbox/*.svg").on("add", gulp.series("svgmin"));
  gulp.watch("src/img/svg-3-sprite/").on("all", gulp.series("svg-sprite"));
  gulp.watch("src/img/imgInbox/*.*").on("add", gulp.series("image-min"));
});

// Prod server
gulp.task("prod", function() {
  browsersync.init({
    server: "build",
    host: devip(), // From "dev-ip" extension
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });
});



// =================================================================
// TASKS (DEV)
// =================================================================
// SASS compilation
gulp.task("sass", function() {
  return gulp
    .src("src/sass/**/*.scss") /* или "main.scss" ???? */
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("src/css"))
    .pipe(browsersync.stream());
});

// SVG minification
gulp.task("svgmin", function() {
  return gulp
    .src("src/img/svg-1-inbox/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("src/img/svg-2-minified"));
});

// SVG sprite-generator
gulp.task("svg-sprite", function() {
  return gulp
    .src("src/img/svg-3-sprite/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/img/"));
});

// Image minification
gulp.task("image-min", function() {
  return gulp
    .src([
      "src/img/img-1-inbox/*.jpg",
      "src/img/img-1-inbox/*.jpeg",
      "src/img/img-1-inbox/*.png",
      "src/img/img-1-inbox/*.gif",
    ])
    .pipe(imagemin())
    .pipe(gulp.dest("src/img/img-2-minified"));
});



// =================================================================
// TASKS (BUILD)
// =================================================================
// Build step 1: Clean "build" folder
gulp.task("build-folder-clean", function() {
  return gulp.src("build/*")
    .pipe(clean());
});

// Build step 2: HTML min + transfer
gulp.task("build-html", function() {
  return gulp.src("src/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build/"));
});

// Build step 2: CSS bundle + autoprefixer + min + transfer
gulp.task('build-styles', () => {
  return gulp.src('src/css/style.css')
      .pipe(postcss([
          require('postcss-import'),
          require('autoprefixer'),
          require('postcss-csso'),
      ]))
      .pipe(gulp.dest('build/css'));
});

// Build step 3: JavaScript bundle (Webpack) + transfer
gulp.task("build-js", function() {
  return run("npm run build").exec()
});

// Build step 4: Fonts transfer
gulp.task("build-fonts", function() {
  return gulp.src("src/fonts/**/*.*")
    .pipe(gulp.dest("build/fonts/"));
});

// Build step 5: Image min + transfer
gulp.task("build-img-min", function() {
  return gulp.src("src/img/*.*")
    // .pipe(imagemin())
    .pipe(gulp.dest("build/img"));
});

// Build task
gulp.task("build", gulp.series("build-folder-clean", "build-styles", "build-fonts", "build-img-min", "build-js", "build-html"));