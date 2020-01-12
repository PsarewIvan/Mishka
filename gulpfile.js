'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const rigger = require('gulp-rigger'); // Объединение файлов
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const htmlmin = require('gulp-htmlmin');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

const images = require('gulp-image');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio'); // убирает лишние атрибуты
const replace = require('gulp-replace'); // замена символов

const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const path = {
  build: {
    root:       'build/',
    html:       'build/',
    js:         'build/js/',
    styles:     'build/css/',
    fonts:      'build/fonts/',
    img:        'build/img/picture',
    imgWebp:    'build/img/webp/',
    svg:        'build/img/icon/',
    sprite:     'build/img/svgSprite/'
  },
  source: {
    html:       'src/html/**/*.html',
    js:         'src/js/main.js',
    styles:     'src/scss/index.scss',
    img:        'src/img/picture/**/*.{jpg,png}',
    svg:        'src/img/icon/**/*.svg',
    svgSprite:  'src/img/svgSprite/*.svg',
    fonts:      'src/fonts/**/*.{woff,woff2}'
  },
  watch: {
    html:       'src/html/**/*.html',
    js:         'src/js/**/*.js',
    styles:     'src/scss/**/*.scss',
    img:        'src/img/**/*.*',
    fonts:      'src/fonts/**/*.{woff,woff2}'
  },
  clean: {
    all:        'build/*',
    noImg:      '!build/img',
    img:        'build/img/*'
  }
};

function html() {
  return gulp.src(path.source.html)
              .pipe(plumber())
              .pipe(posthtml([
                include()
              ]))
              .pipe(htmlmin({ collapseWhitespace: true }))
              .pipe(gulp.dest(path.build.html))
              .pipe(browserSync.stream());
}

function styles() {
  return gulp.src(path.source.styles)
              .pipe(plumber())
              .pipe(sourcemaps.init())
              .pipe(sass().on('error', sass.logError))
              .pipe(autoprefixer({
                overrideBrowserslist:  ['last 2 versions'],
                cascade: false
              }))
              .pipe(cleanCSS({level: 2}))
              .pipe(rename("styles-min.css"))
              .pipe(sourcemaps.write())
              .pipe(gulp.dest(path.build.styles))
              .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(path.source.js)
              .pipe(rigger())
              .pipe(plumber())
              .pipe(sourcemaps.init())
              .pipe(babel({
                presets: ['@babel/env']
              }))
              // .pipe(uglify({
              //   toplevel: true
              // }))
              .pipe(rename('script-min.js'))
              .pipe(sourcemaps.write())
              .pipe(gulp.dest(path.build.js))
              .pipe(browserSync.stream());
}

function fontsCopy() {
  return gulp.src(path.source.fonts)
              .pipe(gulp.dest(path.build.fonts))
              .pipe(browserSync.stream());
}

function imgMin() {
  return gulp.src(path.source.img)
              .pipe(images())
              .pipe(gulp.dest(path.build.img));
}

function webpConvert() {
  return gulp.src(path.source.img)
              .pipe(webp({
                quality: 85,
                method: 5
              }))
              .pipe(gulp.dest(path.build.imgWebp));
}

function svgMin() {
  return gulp.src(path.source.svg)
              .pipe(svgmin({
                js2svg: {
                  pretty: true
                }
              }))
              .pipe(gulp.dest(path.build.svg));
}

function createSvgSprite() {
  return gulp.src(path.source.svgSprite)
              .pipe(svgmin({
                js2svg: {
                  pretty: true  // убирает лишние пробелы
                }
              }))
              .pipe(cheerio({
                run: function ($) {
                  $('[fill]').removeAttr('fill');
                  $('[style]').removeAttr('style');
                },
                parserOptions: { xmlMode: true }
              }))
              .pipe(replace('&gt;', '>'))
              .pipe(svgSprite({
                mode: {
                  symbol: {
                    sprite: '../sprite.svg'
                  }
                }
              }))
              .pipe(gulp.dest(path.build.sprite));
}

function cleanWithoutImg() {
  return del([path.clean.all, path.clean.noImg]);
}

function cleanImg() {
  return del([path.clean.img]);
}

function watch() {
  browserSync.init({
    server: 'build'
  });

  gulp.watch(path.watch.styles, styles);
  gulp.watch(path.watch.js, scripts);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.fonts, fontsCopy);
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('fonts', fontsCopy);
gulp.task('img', imgMin);
gulp.task('webp', webpConvert);
gulp.task('svg', svgMin);
gulp.task('svgSprite', createSvgSprite);
gulp.task('cleanWithoutImg', cleanWithoutImg);
gulp.task('cleanImg', cleanImg);
gulp.task('cleanAll', gulp.series(cleanWithoutImg, cleanImg));
gulp.task('watch', watch);

gulp.task('buildImg', gulp.series(cleanImg,
                        gulp.parallel(
                          imgMin,
                          webpConvert,
                          svgMin,
                          createSvgSprite
                        )
                      )
);

gulp.task('buildWithoutImg',  gulp.series(cleanWithoutImg, createSvgSprite,
                                gulp.parallel(
                                  html,
                                  styles,
                                  scripts,
                                  fontsCopy
                                )
                              )
);

gulp.task('build',  gulp.series(cleanWithoutImg, cleanImg, createSvgSprite,
                      gulp.parallel(
                        html,
                        styles,
                        scripts,
                        fontsCopy,
                        imgMin,
                        webpConvert,
                        svgMin
                      )
                    )
);

gulp.task('devMin', gulp.series(cleanWithoutImg, createSvgSprite,
                      gulp.parallel(
                        html,
                        styles,
                        scripts,
                        fontsCopy
                      ),
                      watch)
);

gulp.task('dev',  gulp.series(cleanWithoutImg, cleanImg, createSvgSprite,
                    gulp.parallel(
                      html,
                      styles,
                      scripts,
                      fontsCopy,
                      imgMin,
                      webpConvert,
                      svgMin
                    ),
                    watch)
);
