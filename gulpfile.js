"use strict";

var gulp = require ("gulp");
var os = require( "os" );
var flatten = require ("gulp-flatten");
var plumber = require ("gulp-plumber");
var sass = require ("gulp-sass");
var rename = require ("gulp-rename");
var browserSync = require("browser-sync");
var nodemon = require("nodemon");


gulp.task( "default", [ "browser-sync" ] );
gulp.task("build-sass",
	function buildSASS( ){

		return gulp
			.src( [
				"bower_components/bootstrap-sass/assets/stylesheets/**/*.scss",
				"client/**/*.scss"
			] )
			.pipe( plumber( ) )
			.pipe( flatten( ) )
			.pipe( sass( ) )
			.pipe( rename( "concise.css" ) )
			.pipe( gulp.dest( "build" ) );
	} );


gulp.task( "browser-sync", [ "nodemon" ], function( callback ){
	browserSync
		.init( null, {
			"proxy": "http://localhost:9000",
			"files": ["**/*.*"],
			"port": 8000,
			"ui": {
				"port": 8001
			},
			"injectChanges": true,
			"logLevel": "debug",
			"browser": ( os.type( ) == "Linux" )? "google-chrome" : "google chrome"
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

				gulp.watch( "**/*.*", [ "build-sass" ] )
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
