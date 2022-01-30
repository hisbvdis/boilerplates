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

// HTML
// npm i -D  gulp-htmlmin
const htmlmin = require("gulp-htmlmin");

// STYLES (CSS)
// npm i -D  sass  gulp-sass  gulp-postcss  autoprefixer  postcss-csso
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");

// IMAGES (RASTER)
// npm i -D  gulp-squoosh
const gulpSquoosh = require("gulp-squoosh");

// IMAGES (SVG)
// npm i -D  gulp-svgstore  gulp-svgmin
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");

// FILES
// npm i -D  gulp-rename  gulp-clean  gulp-sourcemaps
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
  gulp.watch("src/sass/**/*.scss", gulp.series("sass-compile"));
  gulp.watch("src/js/**/*.js").on("change", browsersync.reload);
  gulp.watch("src/img/svg-1-inbox/*.svg").on("add", gulp.series("svg-min"));
  gulp.watch("src/img/svg-3-sprite/").on("all", gulp.series("svg-sprite"));
  gulp.watch("src/img/img-1-inbox/*.*").on("add", gulp.series("image-min"));
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
// SASS compilation
gulp.task("sass-compile", function() {
  return gulp
    .src("src/sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(rename("bundle.css"))
    .pipe(gulp.dest("src/css"))
    .pipe(browsersync.stream());
});

// SVG minification
gulp.task("svg-min", function() {
  return gulp
    .src("src/img/svg-1-inbox/*.svg")
    .pipe(svgmin({
      plugins: [{ name: 'removeViewBox', active: false }]
    }))
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
    .src("./src/img/img-1-inbox/**")
    .pipe(
      gulpSquoosh(() => ({
        encodeOptions: {
          webp: {},
        },
      }))
    )
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
  return gulp.src('src/css/bundle.css')
      .pipe(postcss([
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