var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del');

var folders = {
    less: 'source/less/*.less',
    jade: [
        'source/jade/*.jade',
        '!source/jade/variables.jade',
    ],
    groceries: 'source/{module,font,script}/**'
};

gulp.task('copy:groceries', function() {
    return gulp.src(folders.groceries, {
            buffer: false,
        })
        .pipe(gulp.dest('dist/resource'))
});

gulp.task('build:less', function() {
    return gulp.src(folders.less)
        .pipe($.less())
        .pipe(gulp.dest('dist/resource/style')) ;
});

gulp.task('build:jade', function(){
    return gulp.src(folders.jade)
        .pipe(
            $.jade({
                pretty: true
            })
        )
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(callback) {
    del('dist/**', {
        force: true
    }, callback);
});

gulp.task('build', ['build:less', 'build:jade', 'copy:groceries']);

gulp.task('watch', ['build'], function() {
    var changed = [];

    function push(s) {
        changed.push(s);
    }

    function pop() {
        while (changed.length > 0) {
            var s = changed.pop();
            $.livereload.changed(s);
        }
    }

    $.livereload({
        start: true
    });

    gulp.watch("source/less/**", ['build:less', pop])
        .on('change', push);

    gulp.watch(folders.jade, ['build:jade', pop])
        .on('change', push);

    gulp.watch(folders.groceries, ['copy:groceries', pop])
        .on('change', push);
});

gulp.task('default', ['watch']);