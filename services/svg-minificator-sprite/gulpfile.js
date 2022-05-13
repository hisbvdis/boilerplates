// =============================================================================
// INSTALLED PACKAGES
// =============================================================================
// npm i -g gulp-cli
// npm i -D gulp browser-sync dev-ip
// npm i -D gulp-svgmin gulp-svgstore
// npm i -D gulp-rename



// =============================================================================
// COMMANDS
// =============================================================================
// - gulp: Run dev server



// =============================================================================
// PACKAGES
// =============================================================================
// SERVICE
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const devip = require("dev-ip");

// IMAGES (SVG)
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");

// FILES
const rename = require("gulp-rename");



// =============================================================================
// SERVER
// =============================================================================
// Dev server
gulp.task("default", function() {
  browsersync.init({
    server: "src",
    host: devip(),
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });

  gulp.watch("src/img/svg-1-origin/*.svg").on("add", gulp.series("svg-min"));
  gulp.watch("src/img/svg-3-for-sprite/").on("all", gulp.series("svg-sprite"));
});



// =================================================================
// TASKS (DEV)
// =================================================================
// SVG minification
gulp.task("svg-min", function() {
  return gulp
    .src("src/img/svg-1-origin/*.svg")
    .pipe(svgmin({
      plugins: [{ name: 'removeViewBox', active: false }]
    }))
    .pipe(gulp.dest("src/img/svg-2-minified"));
});

// SVG sprite-generator
gulp.task("svg-sprite", function() {
  return gulp
    .src("src/img/svg-3-for-sprite/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/img/"));
});