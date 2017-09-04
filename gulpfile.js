var gulp = require('gulp'),
    path = require('path'),
    Promise = require('promise'),
    fs = require('fs'),
    pkg = require('./package.json'),
    $ = require('gulp-load-plugins')();

var base = 'src', build = 'build', jsDir = 'javascript';
var dist = 'dist', _public = build + '/public';
var projectName = 'elasticsearch';
var allFileName = projectName.replace(/-/g, '.') + '.min.js';

gulp.task('copy:html', function () {
    return gulp.src(base + '/html/*.html')
        .pipe(gulp.dest(_public + '/'));
});

gulp.task('copy:libs', function () {
    return gulp.src(base + '/libs/**')
        .pipe(gulp.dest(_public + '/' + jsDir + '/libs/'));
});

gulp.task('copy', gulp.parallel('copy:html', function (done) {
    done();
}));

gulp.task('clean', function () {
    return gulp.src([build + '/*', dist + '/*'],
        {read: false})
        .pipe($.clean());
});

gulp.task('scripts', gulp.parallel('copy:libs', function () {
    var jsDist = _public + '/' + jsDir,
        jsSrc = base + '/' + jsDir;
    var source = jsSrc.concat('/**/*.js');
    return gulp.src(source, {base: jsSrc})
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe(gulp.dest(jsDist))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest(jsDist));
}));

gulp.task('build', gulp.series('clean', 'copy', 'scripts', function (done) {
    done();
}));

gulp.task('live', gulp.series('build', function () {
    // js
    gulp.watch(base + '/' + jsDir + '/**.js', gulp.parallel('scripts'));
    // html
    gulp.watch(base + '/html' + '/*.html', gulp.parallel('copy:html'));
}));

gulp.task('copy:dist', gulp.series('build', function () {
    return gulp.src(_public + '/**/*.js', {base: _public + '/javascript/'})
        .pipe(gulp.dest(dist))
}));

gulp.task('dist:concat', gulp.series('copy:dist', function () {
    return gulp.src([dist + '/*.min.js'], {base: dist})
        .pipe($.concat(allFileName))
        .pipe(gulp.dest(dist));
}));

gulp.task('dist:header', gulp.series('dist:concat', function () {
    var p = dist;
    var r = function (path) {
        return p + '/' + path;
    };
    return Promise.all([
        new Promise(function (resolve) {
            gulp.src([r('/*.min.js')], {base: dist})
                .pipe($.header(fs.readFileSync('header.txt', 'utf8'), {pkg: pkg}))
                .pipe(gulp.dest(dist, {overwrite: true}))
                .on('finish', function () {
                    resolve();
                });
        })
    ]);
}));

gulp.task('dist', gulp.series('dist:header', function (done) {
    done();
}));

gulp.task('default', gulp.series('clean', 'build', function (done) {
    done();
}));
