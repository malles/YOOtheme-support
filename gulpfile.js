
var gulp = require('gulp'),
    _ = require('lodash'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    ftp = require('vinyl-ftp'),
    concat = require('gulp-concat'),
    ftpconfig = {
        host:     'localhost',
        user:     'root',
        password: '',
        root:     'var/www',
        parallel: 5,
        log:      false
    };

gulp.task('default', ['concatjs', 'compile']);
gulp.task('prepare', ['concatjs', 'compile']);

/**
 * Watch for changes in files
 */
gulp.task('watch', function () {
    gulp.watch('yoo-support.js', ['concatjs', 'compile']);
});

gulp.task('compile', function () {

    return gulp.src(['./less/style.less'], {base: './'})
        .pipe(less({compress: true, relativeUrls: true}))
        .pipe(rename(function (file) {
            file.basename = 'uikit.yoosupport';
            file.dirname = 'css';
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('concatjs', function () {
    return gulp.src([
        'vendor/assets/uikit/js/uikit.js',
        'vendor/assets/uikit/js/components/sticky.js',
        'app/bundle/yoo-support.js'
    ])
        .pipe(concat('yoo-support.js'))
        .pipe(gulp.dest('./js'));
});

gulp.task('deploy', ['prepare'], function () {

    var conn = ftp.create(_.extend(ftpconfig, require('./remote.json'))),
        globs = [
            'js/**',
            'css/**'
        ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, { base: '.', buffer: false })
        .pipe(conn.newer('.')) // only upload newer files
        .pipe(conn.dest(ftpconfig.root + '/support'));

});
