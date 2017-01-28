'use strict'
/*-----------------------------------------------------------------
* REQUIRED MODULES
*-----------------------------------------------------------------*/
		var gulp		 		 		= require('gulp'),
				plumber	 		 		= require('gulp-plumber'),
				browserSync  		= require('browser-sync'),
				reload 			 		= browserSync.reload,
				uglify 	 		 		= require('gulp-uglify'),
				rename 	 		 		= require('gulp-rename'),
				sass 		 		 		= require('gulp-sass'),
				sourcemaps 			= require('gulp-sourcemaps'),
				autoprefixer 		= require('gulp-autoprefixer'),
				cleanCSS 		 		= require('gulp-clean-css'),
				del					 		= require('del'),
				imagemin		 		= require('gulp-imagemin'),
				data						= require('gulp-data'),
				nunjucksRender 	= require('gulp-nunjucks-render');

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

/*-----------------------------------------------------------------
* SCRIPT TASK
*-----------------------------------------------------------------*/
//gulp.task('scripts', function() {
//	gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
//		.pipe(rename({suffix:'.min'}))
//		.pipe(uglify())
//		.pipe(gulp.dest('app/js'));
//});

gulp.task('scripts', function() {
	gulp.src(['app/js/main.js', '!app/js/*.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
});


/*-----------------------------------------------------------------
* NUNJUCKS TASK
*-----------------------------------------------------------------*/
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/*.+(html|nunjucks)')
	// Adding data to Nunjucks
	.pipe(data(function() {
		return require('./app/data.json')
	}))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('app'))
});


/*-----------------------------------------------------------------
* SASS TASK
*-----------------------------------------------------------------*/
gulp.task('styles', function() {
	gulp.src('app/scss/**/*.scss')
		.pipe(plumber())
		// .pipe(sourcemaps.init())
		// .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(autoprefixer('last 2 versions'))
    // .pipe(sourcemaps.write())
		// .pipe(gulp.dest('app/css/'))
		.pipe(reload({stream:true}));
})

/*-----------------------------------------------------------------
* HTML TASK
*-----------------------------------------------------------------*/
gulp.task('html', function() {
	gulp.src('app/**/*.html')
	.pipe(reload({stream:true}));
});

/*-----------------------------------------------------------------
* IMAGE COMPRESSION TASK
*-----------------------------------------------------------------*/
gulp.task('imagemin', function () {
	gulp.src('app/uncomp-img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('app/img'))
});

/*-----------------------------------------------------------------
* BUILT TASKS
*-----------------------------------------------------------------*/
// Clear out all files and folders from build folder
gulp.task('build:cleanfolder', function(cb) {
	del([
		'build/**'
	], cb());
});

// Create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function() {
	return gulp.src('app/**/*')
	.pipe(gulp.dest('build'))
});

// Remove unwanted build files
// List all files and directories here you don't want to include
gulp.task('build:remove', ['build:copy'], function(cb) {
	del([
		'build/scss/',
		'build/uncomp-img/',
		'build/js/!(*.min.js)'
	], cb())
});

// Simple to default task - kicks off everything
gulp.task('build', ['build:copy', 'build:remove']);

/*-----------------------------------------------------------------
* BROWSER-SYNC TASK
*-----------------------------------------------------------------*/
gulp.task('browser-sync', function() {
	browserSync({
		browser: "google chrome",
		server: {
			baseDir: './app/',
		}
	});
});


//Task to run build server for testing final app
gulp.task('build:serve', function() {
	browserSync({
		server: {
			baseDir: './build/'
		}
	});
});


/*-----------------------------------------------------------------
* WATCH TASK
*-----------------------------------------------------------------*/
gulp.task('watch', function() {
//	gulp.watch(['app/js/**/*.js', 'app/scss/**/*.scss'], ['scripts', 'styles'])
	gulp.watch('app/assets/js/scripts.js', ['scripts']);
	gulp.watch('app/assets/css', ['styles']);
	// gulp.watch('app/scss/**/*.scss', ['styles']);
	gulp.watch('app/**/*.html', ['html']);
});

/*-----------------------------------------------------------------
* DEFAULT TASK - a task that calls other tasks
*-----------------------------------------------------------------*/
gulp.task('default', ['scripts', 'styles', 'nunjucks' ,'html', 'imagemin', 'browser-sync', 'watch']);
gulp.task('default', ['scripts', 'styles' ,'html', 'imagemin', 'browser-sync', 'watch']);