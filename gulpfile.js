var gulp     = require('gulp'),
    $        = require('gulp-load-plugins')(),
    rimraf   = require('rimraf'),
    ghPages = require('gulp-gh-pages'),
    sequence = require('run-sequence');

var paths = {
    sass:[
        "src/scss"
    ],
    app:[
        "src/js/*.js"
    ],
    bower:[
        "bower_components/angularjs/angular.js"
    ]
};

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', function () {
    // Run the server after the build
    sequence('build', 'server');

    // Watch Sass
    gulp.watch(['src/scss/**/*'], ['sass']);

    // Watch app folder
    gulp.watch(['src/app/**/*'], ['app']);

    // Watch app templates
    gulp.watch(['src/js/*.js'], ['uglify']);

});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
    sequence('clean','sass','uglify','copy-bower','app', function() {
        console.log("Successfully built.");
        cb();
    });
});

// Cleans the build directory
gulp.task('clean', function(cb) {
   sequence('clean-dist','clean-app');
   cb();
});
// Cleans the dist directory
gulp.task('clean-dist', function(cb) {
    rimraf('dist', cb);
});

// Cleans the build directory
gulp.task('clean-app', function(cb) {
    rimraf('app', cb);
});

// Compiles and copies app's JS
gulp.task('uglify', function(cb) {

    // App JavaScript
    gulp.src(paths.app)
        // .pipe($.uglify()
        // .on('error', function(e) {
        //  console.log(e);
        // }))
        .pipe($.concat('autocomplete.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./app/js'));
    cb();
});

gulp.task('copy-bower', function(cb) {

    // App JavaScript
    gulp.src(paths.bower)
      .pipe(gulp.dest('./app/js'));
    cb();
});

// Compiles and copies your app's custom JS
gulp.task('app', function(cb) {

    // App JavaScript
    gulp.src('src/app/**/*')
      .pipe(gulp.dest('./app/'));
    cb();
});


// Compiles Sass
gulp.task('sass', function () {
    return gulp.src('src/scss/autocomplete.scss')
        .pipe($.sass({
            includePaths: paths.sass,
            outputStyle: 'nested',
            errLogToConsole: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie 10']
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./app/css'));
});

// Starts a test server, which you can view at http://localhost:8080
gulp.task('server', function() {
    gulp.src('./app')
        .pipe($.webserver({
            port: 3000,
            host: 'localhost',
            fallback: 'index.html',
            livereload: true,
            open: true
        }))
    ;
});

gulp.task('deploy', function(){
    return gulp.src('./app/**/*')
        .pipe(ghPages());
});