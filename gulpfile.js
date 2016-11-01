'use strict';

var gulp    = require('gulp'),
    fs      = require('fs'),
    sass    = require('gulp-sass'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    browser = require('browser-sync'),
    util = require('./config/utils'),
    styles = require('./config/styles'),
    scripts = require('./config/scripts');



var inject = function(conf){

    conf.root = conf.root.split('')[conf.root.split('').length] !== '/' ? conf.root +='/': conf.root;
    fs.readFile(conf.root + conf.masterFile,'utf8',function(err,data){

        var components = data.match(new RegExp(conf.matcher.one+'(.|\n)*?'+conf.matcher.two,'g')),
            urlsFiles = [];

        components.forEach(function(data){
            urlsFiles.push(
                conf.root+data.replace(conf.matcher.one,'').replace(conf.matcher.two,'')
            );
        });
        urlsFiles.push(conf.root+conf.masterFile);
        return conf.callback(urlsFiles);

    });
};

gulp.task('js',function(){
    inject({
        root: './src/js/',
        masterFile: 'gmap.js',
        matcher:{
            one: '<import>', two: '</import>'
        },
        callback: function(urls){
            gulp.src(urls)
                .pipe(concat('gmap.js'))
                .pipe(gulp.dest('dist/js'))
                .pipe(concat('gmap.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('dist/js'));
        }
    });

    util.each(scripts,function(bundle,name){
        gulp.src(bundle)
            .pipe(concat(name + '.js'))
            .pipe(gulp.dest('dist/js'));
    });

});

gulp.task('sass',function(){
    util.each(styles, function(bundle, name){
        gulp.src(bundle)
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(concat(name + '.css'))
            .pipe(gulp.dest('dist/css/'));
    });

});

gulp.task('watch',function(){
    gulp.watch(['src/sass/**/*.scss'],['sass']);
    gulp.watch(['src/js/**/*.js'],['js']);
});


gulp.task('server',function(){
    browser({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['./','dist']
        }
    });

    gulp.watch([
        'dist/*.html',
        'dist/**/*.css',
        'dist/**/*.js'
    ]).on('change', browser.reload);
    gulp.start('watch');
});
