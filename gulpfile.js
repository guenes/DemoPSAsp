// Initialize modules
//https://coder-coder.com/gulp-4-walk-through/
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
// const terser = require('gulp-terser')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');
// const TerserPlugin = require('terser-webpack-plugin');



// File paths
const files = {
    htmlPath: 'assets/html/**/*.html',
    jsPath: 'assets/js/**/*.js',
    sassPath: 'assets/scss/**/*.scss',
    destCSS: 'assets/css',
    destSASS: 'assets/scss/base',
    destJS: 'assets/js/vendor',
    destHTML: 'index.html'
}

// Sass task: compiles the style.scss file into style.css
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest(files.destCSS)
        ); // put final CSS in dist folder
}
// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
    return src([
        files.jsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
    ])
        .pipe(concat('all.js'))
        // .pipe(terser())
        .pipe(dest(files.destJS)
        );
}

// Cachebust
function cacheBustTask() {
    var cbString = new Date().getTime();
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
    watch([files.sassPath, files.jsPath],
        { interval: 1000, usePolling: true }, //Makes docker work
        series(
            parallel(sassTask, jsTask),
            cacheBustTask
        )
    );
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(sassTask, jsTask),
    cacheBustTask,
    watchTask
);
