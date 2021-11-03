// Install packages:
// npm i -D gulp browser-sync dev-ip
// npm i -D gulp-svgmin gulp-svgstore
// npm i -D gulp-rename

// Commands:
// - gulp: Run dev server

// Packages
// service
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const devip = require("dev-ip");
// images
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
// files
const rename = require("gulp-rename");



// ===================================
// SERVER
// ===================================
// Dev server
gulp.task("default", function() {
  browsersync.init({
    server: "src",
    host: devip(), // From "dev-ip" extension
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });

  gulp.watch("src/svg-1-inbox/*.svg").on("add", gulp.series("svgmin"));
  gulp.watch("src/svg-3-sprite/").on("all", gulp.series("svg-sprite"));
});



// ===================================
// DEV TASKS
// ===================================
// SVG minification
gulp.task("svgmin", function() {
  return gulp
    .src("src/svg-1-inbox/*.svg")
    .pipe(svgmin({
      plugins: [{ name: 'removeViewBox', active: false }]
    }))
    .pipe(gulp.dest("src/svg-2-minified"));
});

// SVG sprite-generator
gulp.task("svg-sprite", function() {
  return gulp
    .src("src/svg-3-sprite/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/"));
});