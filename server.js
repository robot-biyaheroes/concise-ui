var express = require("express");
var path = require ("path");
var APP = express( );

APP.use (express.static(path.resolve("./build")));
APP.use("/library", express.static(path.resolve("./bower_components")));
APP.use(express.static(path.resolve("./")));
APP.listen( 9000 );
