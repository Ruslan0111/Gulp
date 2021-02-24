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
			baseDir: source_folder + "/"
		}
	});
}

function cleanDist() {
	return del(project_folder);
}

function styles() {
	return src(source_folder + '/scss/style.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 10 version"],
			grid: true
		}))
		.pipe(dest(source_folder + '/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	return src(source_folder + '/js/src_js/index.js')
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(dest(source_folder + '/js/'))
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
		.pipe(dest(project_folder + '/images'))
}

function fonts() {
	src(source_folder + '/fonts/**/*')
		.pipe(ttf2woff())
		.pipe(dest(project_folder + '/fonts/'));
	return src(source_folder + '/fonts/**/*')
		.pipe(ttf2woff2())
		.pipe(dest(project_folder + '/fonts/'));
}

function build() {
	return src([
		source_folder + '/css/style.min.css',
		source_folder + '/js/*.js',
		source_folder + '/*.html'
	], {base: source_folder})
	.pipe(dest(project_folder))
}

function watching() {
	watch([source_folder + '/scss/**/*.scss'], styles);
	watch([source_folder + '/js/**/*.js', '!' + source_folder + '/js/main.min.js'], scripts);
	watch([source_folder + '/*.html']).on('change', browserSync.reload);
}

exports.fonts = fonts;
exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, fonts, build);
exports.default = parallel(styles, scripts, browsersync, watching);