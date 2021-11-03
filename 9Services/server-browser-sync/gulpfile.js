// =================================================================
// PACKAGES
// =================================================================
// SERVICE
// npm i -D  gulp  browser-sync  dev-ip
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const devip = require("dev-ip");



// =================================================================
// SERVER
// =================================================================
gulp.task("default", function() {
  browsersync.init({
    server: "./",
    host: devip(),
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });

  gulp.watch("./index.html").on("change", browsersync.reload);
  gulp.watch("./script.js").on("change", browsersync.reload);
  gulp.watch("./style.css").on("change", browsersync.reload);
})