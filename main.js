'use strict';

Object.prototype.extends = function(options) {
    var result = JSON.parse(JSON.stringify(this));
    for (var i in options)
        if (typeof options[i] != "function")
            result[i] = options[i];
    return result;
};
var gulpWorker = {};
(function(gulpWorker) {

    //shorthands
    var gulp = require('gulp'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        uglify_js = require('gulp-uglify'),
        uglify_css = require('gulp-uglifycss'),
        sourcemaps = require('gulp-sourcemaps'),
        minify = require("minifier"),
        fileExists = require("file-exists"),
        colors = require("colors"),
        less = require("gulp-less");
    var log = require('gulp-util').log;

    var config = require("./src/core/config");
    var args = require("./src/core/arguments");
    var versioning = require("./src/core/versioning");
    var paths = require("./src/core/paths");
    var initialize = require("./src/core/initialize");
    var work = require("./src/core/work");
    var task = require("./src/core/task");
    var debug = require("./src/core/debug");


    var findFiles = paths.findFiles;
    var initSettings = function(options) {
        return initialize.initSettings(options, config);
    }
    var works = [];
    var worker = work.worker;
    var mainExtensions = [];

    var context = {
        gulp: gulp,
        works: works,
        worker: worker,
        config: config.defaults,
        gulpWorker: gulpWorker,

        initSettings: initSettings,
        mainExtensions: mainExtensions,

    };
    //properties


    //actions

    function extendMainContext(gulpWorker, context) {
        mainExtensions = context.mainExtensions;
        for (var i = 0; i < mainExtensions.length; i++) {
            var extension = mainExtensions[i];
            var name = extension.name;

            if (name in gulpWorker) {
                console.log(colors.red(name + " already exists in gulp-worker"));
            } else {
                gulpWorker[name] = extension.callback;
            }
        }
    }

    //properties
    gulpWorker.args = args;
    gulpWorker.config = context.config;
    //actions
    gulpWorker.configure = config.overrideDefaults;
    //initializations
    debug.injectDebugHandlers(context);
    work.initializeHandlers(context);
    task.initializeTasks(gulp, context);
    extendMainContext(gulpWorker, context);
    var D = context.debug;
    D.debug("Gulp Worker Context");
    D.debug(gulpWorker);
    D.debug("Gulp Worker Config");
    D.debug(gulpWorker.config);
    D.debug("Gulp Worker Args");
    D.debug(args);
})(gulpWorker);
module.exports = gulpWorker;