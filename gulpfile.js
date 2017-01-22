var gulp = require('gulp'),
    path = require('path'),
    promisedDel = require('promised-del'),
    Promise = require('promise'),
    fs = require('fs'),
    pkg = require('./package.json'),
    $ = require('gulp-load-plugins')();

var base = 'src', build = 'build', jsDir = 'javascript';
var dist = build + '/dist', _public = build + '/public', unzip = build + '/unzip';
var projectName = 'base-js-project';
var allFileName = projectName.replace(/-/g, '.') + '.all.min.js';

var notifyOptions = {
    onLast: true,
    title: projectName
};

function clone(dest) {
    var _o = {};
    for (var property in dest) {
        if (dest.hasOwnProperty(property))
            _o[property] = dest[property];
    }
    return _o;
}

function mixin(destination, source) {
    var _o = clone(destination);
    for (var property in source) {
        if (source.hasOwnProperty(property))
            _o[property] = source[property];
    }
    return _o;
}

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
    return gulp.src([build + '/*'],
        {read: false})
        .pipe($.clean())
        .pipe($.notify(mixin(notifyOptions, {message: 'Clean task complete.'})));
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
        .pipe(gulp.dest(jsDist))
        .pipe($.notify(mixin(notifyOptions, {message: 'Scripts task complete.'})));
}));

gulp.task('build', gulp.series('clean', 'copy', 'scripts', function (done) {
    done();
}));

gulp.task('live', gulp.series('build', function () {
    // js
    gulp.watch(base + '/' + jsDir + '/**.js', gulp.parallel('scripts'));
    // html
    gulp.watch(base + '/*.html', gulp.parallel('copy:html'));
}));

gulp.task('copy:dist', gulp.series('build', function () {
    return gulp.src(_public + '/**', {base: _public + '/'})
        .pipe(gulp.dest(unzip))
}));

gulp.task('dist:concat', gulp.series('copy:dist', function () {
    return gulp.src([unzip + '/' + jsDir + '/*.min.js'], {base: unzip})
        .pipe($.concat(jsDir + '/' + allFileName))
        .pipe(gulp.dest(unzip));
}));

gulp.task('dist:header', gulp.series('dist:concat', function () {

    var p = unzip;
    var r = function (path) {
        return p + '/' + path;
    };
    var ur = function (path) {
        return '!'.concat(r(path));
    };

    return Promise.all([
        new Promise(function (resolve) {
            promisedDel([r(jsDir + '/*.min.js'), ur(jsDir + '/' + allFileName)])
                .then(function () {
                    gulp.src([r(jsDir + '/*.min.js')], {base: unzip})
                        .pipe($.header(fs.readFileSync('header.txt', 'utf8'), {pkg: pkg}))
                        .pipe(gulp.dest(unzip, {overwrite: true}))
                        .on('finish', function () {
                            resolve();
                        });
                })
                .then(function () {
                    resolve();
                });
        })
    ]);
}));

gulp.task('dist:source', gulp.series('copy:dist', 'dist:header', function () {
    return gulp.src(unzip + '/**')
        .pipe($.zip(projectName + '-source'.concat('.zip')))
        .pipe(gulp.dest(dist));
}));

gulp.task('dist', gulp.series('dist:header', 'dist:source', function () {
    var p = unzip;

    var r = function (path) {
        return p + '/' + path;
    };
    var ur = function (path) {
        return '!'.concat(r(path));
    };

    //clear
    return promisedDel([r(jsDir + '/*.js'),
        ur(jsDir + '/*.min.js')])
        .then(function () {
            return gulp.src(p + '/**')
                .pipe($.zip(projectName.concat('.zip')))
                .pipe(gulp.dest(dist));
        });
}));

gulp.task('default', gulp.series('clean', 'build', function (done) {
    done();
}));