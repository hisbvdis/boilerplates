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
// npm i -g gulp-cli
// npm i -D  gulp  browser-sync  dev-ip  gulp-run
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const devip = require("dev-ip");
const run = require("gulp-run");

// STYLES
// npm i -D  gulp-postcss  postcss-custom-media  postcss-import  autoprefixer  postcss-csso  gulp-sourcemaps
const postcss = require("gulp-postcss");
const postcssCustomMedia = require('postcss-custom-media');

// HTML
// npm i -D  gulp-htmlmin
const htmlmin = require("gulp-htmlmin");

// FILES
// npm i -D  gulp-rename  gulp-clean
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const sourcemaps = require('gulp-sourcemaps');




// =================================================================
// SERVER
// =================================================================
// Dev server
gulp.task("default", function() {
  browsersync.init({
    server: "src",
    host: devip(),
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });

  gulp.watch("src/*.html").on("change", browsersync.reload);
  gulp.watch("src/css/**/*.css").on("change", gulp.series("dev-styles", browsersync.reload));
  gulp.watch("src/js/**/*.js").on("change", browsersync.reload);
});

// Prod server
gulp.task("prod", function() {
  browsersync.init({
    server: "build",
    host: devip(),
    reloadDelay: 0,
    reloadDebounce: 100,
    notify: false,
  });
});


// =================================================================
// TASKS (DEV)
// =================================================================
gulp.task("dev-styles", function() {
  return gulp.src("./src/css/style.css")
    .pipe(sourcemaps.init())
    .pipe(postcss([
        require('postcss-import'),
        postcssCustomMedia()
      ]))
    .pipe(rename("bundle.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("src/css/"))
})


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
          postcssCustomMedia(),
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