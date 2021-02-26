const project_folder = './dist';
const source_folder = './app';

const { src, dest, watch, parallel, series } = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: project_folder + "/"
		}
	});
}

function cleanDist() {
	return del(project_folder);
}

function html() {
	return src(source_folder + '/*.html')
		.pipe(dest(project_folder + '/'))
		.pipe(browserSync.stream())
}

function styles() {
	return src(source_folder + '/scss/style.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 10 version"],
			grid: true
		}))
		.pipe(dest(project_folder + '/css/'))
		.pipe(browserSync.stream())
}

function scripts() {
	src(source_folder + '/libs/js/*.js')
		.pipe(dest(project_folder + '/js/'));
	return src(source_folder + '/js/index.js')
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(dest(project_folder + '/js/'))
		.pipe(browserSync.stream())
}

function images() {
	return src(source_folder + '/images/**/*')
		.pipe(imagemin(
			[
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: true },
						{ cleanupIDs: false }
					]
				})
			]
		))
		.pipe(dest(project_folder + '/images/'))
		.pipe(browserSync.stream())
}

function convertFonts() {
	src(source_folder + '/fonts/**/*.ttf')
		.pipe(ttf2woff())
		.pipe(dest(source_folder + '/fonts/'));
	return src(source_folder + '/fonts/**/*.ttf')
		.pipe(ttf2woff2())
		.pipe(dest(source_folder + '/fonts/'));
}

function moveFonts() {
	del(source_folder + '/fonts/**/*.ttf');
	return src([source_folder + '/fonts/**/*.woff', source_folder + '/fonts/**/*.woff2'])
		.pipe(dest(project_folder + '/fonts/'));
}

function watching() {
	watch([source_folder + '/scss/**/*.scss'], styles);
	watch([source_folder + '/js/**/*.js'], scripts);
	watch([source_folder + '/*.html'], html);
	watch([source_folder + '/images/**/*'], images);
}

const fonts = series(convertFonts, moveFonts)
const build = series(cleanDist, images, fonts, html, styles, scripts);

exports.moveFonts = moveFonts;
exports.convertFonts = convertFonts;
exports.build = build;
exports.fonts = fonts;
exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.default = series(build, parallel(watching, browsersync));