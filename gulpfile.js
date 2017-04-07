'use strict'
/*-----------------------------------------------------------------
 * REQUIRED MODULES
 *-----------------------------------------------------------------*/
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	data = require('gulp-data'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	nunjucksRender = require('gulp-nunjucks-render');

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};

/*-----------------------------------------------------------------
 * SCRIPT TASK
 *-----------------------------------------------------------------*/
gulp.task('scripts', function () {
	gulp.src(['src/js/main.js', '!src/js/*.min.js'])
		.pipe(plumber())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'))
		.pipe(reload({
			stream: true
		}));
});


/*-----------------------------------------------------------------
 * NUNJUCKS TASK
 *-----------------------------------------------------------------*/
gulp.task('nunjucks', function () {
	// Gets .html and .nunjucks files in pages
	return gulp.src('src/assets/pages/*.+(njk|nunjucks|html)')
		// Adding data to Nunjucks
		// .pipe(data(function () {
		// 	return require('./src/data.json')
		// }))
		// Renders template with nunjucks
		.pipe(nunjucksRender({
			path: ['src/assets/templates/']
		}))
		// output files in src folder
		.pipe(gulp.dest('src'))
});


/*-----------------------------------------------------------------
 * SASS TASK
 *-----------------------------------------------------------------*/
gulp.task('styles', function() {
	gulp.src('src/assets/scss/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
//    .pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
		.pipe(gulp.dest('src/assets/css/'))
		.pipe(reload({stream:true}));
})




/*-----------------------------------------------------------------
 * HTML TASK
 *-----------------------------------------------------------------*/
gulp.task('html', function () {
	gulp.src('src/**/*.html')
		.pipe(reload({
			stream: true
		}));
});

/*-----------------------------------------------------------------
 * IMAGE COMPRESSION TASK
 *-----------------------------------------------------------------*/
gulp.task('imagemin', function () {
	gulp.src('src/assets/images/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/images/**/*'))
});

/*-----------------------------------------------------------------
 * BUILT TASKS
 *-----------------------------------------------------------------*/
// Clear out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'dist/**'
	], cb());
});

// Create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function () {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'))
});

// Remove unwanted build files
// List all files and directories here you don't want to include
gulp.task('build:remove', ['build:copy'], function (cb) {
	del([
		'dist/scss/',
		'dist/js/!(*.min.js)'
	], cb())
});

// Simple to default task - kicks off everything
gulp.task('build', ['build:copy', 'build:remove']);

/*-----------------------------------------------------------------
 * BROWSER-SYNC TASK
 *-----------------------------------------------------------------*/
gulp.task('browser-sync', function () {
	browserSync({
		browser: "google chrome",
		server: {
			baseDir: './src/',
		}
	});
});


//Task to run build server for testing final src
gulp.task('build:serve', function () {
	browserSync({
		browser: "google chrome",
		server: {
			baseDir: './dist/'
		}
	});
});


/*-----------------------------------------------------------------
 * WATCH TASK
 *-----------------------------------------------------------------*/
gulp.task('watch', function () {
	//	gulp.watch(['src/js/**/*.js', 'src/scss/**/*.scss'], ['scripts', 'styles'])
	gulp.watch('src/assets/js/scripts.js', ['scripts']);
	gulp.watch('src/assets/scss/*.scss', ['styles']);
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/assets/**/*.njk', ['nunjucks']);
});

/*-----------------------------------------------------------------
 * DEFAULT TASK - a task that calls other tasks
 *-----------------------------------------------------------------*/
// gulp.task('default', ['scripts', 'styles', 'nunjucks', 'html', 'imagemin', 'browser-sync', 'watch']);
gulp.task('default', ['scripts', 'styles', 'nunjucks', 'html', 'browser-sync', 'watch']);