"use strict";

var gulp = require ("gulp");
var flatten = require ("gulp-flatten");
var plumber = require ("gulp-plumber");
var sass = require ("gulp-sass");
var rename = require ("gulp-rename");
var concat = require("gulp-concat");
var browserSync = require("browser-sync");
var nodemon = require("nodemon");

gulp.task( "default", [ "browser-sync" ] );

gulp.task( "fonts", function( ){
	return gulp.src( "./bower_components/bootstrap-sass/assets/fonts/**/*" )
		.pipe( gulp.dest( "build/fonts" ) );
} );


gulp.task("build-sass",
	function buildSASS( ){

		return gulp
			.src( [
				"client/app.scss"
			] )
			.pipe( plumber( ) )
			.pipe( flatten( ) )
			.pipe( sass( {
				"includePaths": [ "./bower_components/bootstrap-sass/assets/stylesheets", "./bower_components/text-size" ],
			} ) )
			.pipe( rename( "concise.css" ) )
			.pipe( concat("concise.css") )
			.pipe( gulp.dest( "build" ) );
	} );


gulp.task( "browser-sync", [ "nodemon" ], function( callback ){
	browserSync
		.init( null, {
			"proxy": "http://localhost:9000",
			"files": [
				"bower_components/**/*.*",
				"client/*.*",
				"index.html"
			],
			"port": 8000,
			"ui": {
				"port": 8001
			},
			"injectChanges": true,
			"logLevel": "debug",
			"open": false,
		} );
} );


gulp.task( "nodemon", function( callback ){
	var started = false;

	return nodemon( {
			"script": "./server.js",
			"stdout": false
		} )
		.on( "start", function onStart( ){
			if( !started ){
				started = true;

				gulp.watch( [
						"bower_components/**/*.*",
						"client/*.*",
						"index.html"
					],
					[ "build-sass" ] )
					.on( "change", function onChange( ){
						setTimeout( function onTimeout( ){
							browserSync.reload( );
						}, 1000 );
					} );

				callback( );
			}
		} )
		.on( "error", function onError( ){

		} );
} );
