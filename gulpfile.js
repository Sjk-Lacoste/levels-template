// Initialise modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();


// File path variables
const files = {
    scssPath: 'src/app/scss/**/*.scss',
    jsPath: 'src/app/js/**/*.js',
		imagesPath: 'src/app/images/**/*',
		fontsPath: 'src/app/webfonts/**/*',
    basePath: './src/',
    dest: './src/dist/'
}

// Sass task
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(files.basePath + 'dist/css'))
        .pipe(browserSync.stream()
    );
}

// JS task
function jsTask() {
    return src([
						'node_modules/jquery/dist/jquery.js',
						'node_modules/bootstrap/dist/js/bootstrap.js',
            files.jsPath
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(dest(files.basePath + 'dist/js'))
        .pipe(browserSync.stream()
    );
}

// Images
function imagesTask() {
	return src(files.imagesPath)
				.pipe(dest(files.basePath + 'dist/images'))
				.pipe(browserSync.stream()
		);
}

// Webfonts
function fontsTask() {
	return src(files.fontsPath)
				.pipe(dest(files.basePath + 'dist/webfonts'))
				.pipe(browserSync.stream()
		);
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
    return src([files.basePath + '**/*.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'))
        .pipe(browserSync.stream()
    );
}

// Watch task
function watchTask() {
    browserSync.init({
        server: {
            baseDir: files.basePath
        }
    });

    watch([files.scssPath, files.jsPath, files.imagesPath, files.fontsPath],
    parallel(scssTask, jsTask, imagesTask, fontsTask)).on('change', browserSync.reload);
    watch(files.basePath + '**/*.html').on('change', browserSync.reload);
}

// Compile files

// Default task
exports.default = series(
    parallel(scssTask, jsTask, imagesTask, fontsTask),
    cacheBustTask,
    watchTask
);
