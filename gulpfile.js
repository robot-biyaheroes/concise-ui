"use strict";

var gulp = require ('gulp');
var flatten = require ('gulp-flatten');
var plumber = require ('gulp-plumber');
var sass = require ('gulp-sass');
var rename = require ('gulp-rename');
var browserSync = require('browser-sync');
var nodemon = require('nodemon');


gulp.task("default", ["browser-sync"]);
gulp.task("build-sass", function buildSASS(){

	return gulp.src ([
		"bower_components/**/*.scss",
		"client/**/*.scss"])
	.pipe(plumber())
	.pipe(flatten())
	.pipe(sass())
	.pipe(rename("concise.css"))
	.pipe(gulp.dest("build"));
});


gulp.task('browser-sync', ['nodemon'], function(){
	browserSync.init(null, {
		proxy: "http://localhost:9000",
	files: ["**/*.*"],
	browser: "google chrome",
	port: 8000,
	});
});

gulp.task('nodemon', ['build-sass'], function(callback){
	var started = false;

	return nodemon ({
		script: 'server.js'
	}).on('start', function (){
		if (!started) {
			 callback();
			 started = true;
		}
	});

});