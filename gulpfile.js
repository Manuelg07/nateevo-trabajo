const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const browserSync = require("browser-sync").create();

gulp.task("html", function () {
  return gulp.src("src/*.pug").pipe(pug()).pipe(gulp.dest("dist"));
});

gulp.task("sass", function () {
  return gulp
    .src("src/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("images", function () {
  return gulp
    .src("src/assets/images/**/*")
    .pipe(gulp.dest("dist/assets/images"));
});

gulp.task("webpack", function (callback) {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new Error('webpack', err);

    console.log(
      '[webpack]',
      stats.toString({
        colors: true,
        chunks: false,
      })
    );

    callback();
  });
});

gulp.task("watch", function () {
  const compiler = webpack(webpackConfig);
  const server = new webpackDevServer(compiler, {
    static: './dist'
  });

  server.listen(8080, 'localhost', function (err) {
    if (err) throw new Error('webpack-dev-server', err);
    console.log('[webpack-dev-server]', 'http://localhost:8080');
  });

  gulp.watch("src/*.pug", gulp.series("html")).on("change", browserSync.reload);
  gulp.watch("src/*.scss", gulp.series("sass")).on("change", browserSync.reload);
});

gulp.task("default", gulp.series("html", "sass", "images", "webpack", "watch"));
