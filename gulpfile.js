const project_folder = './dist';
const source_folder = './app';

const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

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
		.pipe(uglify())
		.pipe(concat('libs.min.js'))
		.pipe(dest(project_folder + '/js/'));
	return src(source_folder + '/js/*.js')
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(dest(project_folder + '/js/'))
		.pipe(browserSync.stream())
}

function images() {
	return src(source_folder + '/images/**/*')
		.pipe(dest(project_folder + '/images/'))
		.pipe(browserSync.stream())
}

function fonts() {
	return src(source_folder + '/fonts/**/*')
		.pipe(dest(project_folder + '/fonts/'));
}

function watching() {
	watch([source_folder + '/scss/**/*.scss'], styles);
	watch([source_folder + '/js/**/*.js'], scripts);
	watch([source_folder + '/*.html'], html);
	watch([source_folder + '/images/**/*'], images);
	watch([source_folder + '/fonts/**/*'], fonts);
}

const build = series(cleanDist, images, fonts, html, styles, scripts);

exports.build = build;
exports.fonts = fonts;
exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.default = series(build, parallel(watching, browsersync));