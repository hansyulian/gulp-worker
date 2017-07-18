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


    var findFiles = paths.findFiles;
    var initSettings = function(options) {
        return initialize.initSettings(options, config);
    }
    var context = {
        gulp: gulp,
        concat: concat,
        rename: rename,
        sourcemaps: sourcemaps,
        minify: minify,
        colors: colors,

        initSettings: initSettings
    };
    //properties


    //actions



    var works = [];


    var worker = function(files, options, type) {
        options = options || {};
        //telling that the task is starting
        console.log(colors.cyan("\n\tStarting Task\n\n") + colors.yellow("\t\tFiles:"));
        //initialize settings given
        var settings = initSettings(options);
        var version = versioning.detectVersion(settings.changelogFileName);
        var sources = findFiles(files, settings.base_folder, {
            showLog: true
        });

        if (settings.automatic_versioning && version == "")
            version = versioning.detectVersion(settings.changelogFileName);
        var name = settings.name + (version != "" && settings.version_on_file ? "-" + version : "");
        console.log(colors.yellow("\n\n\t\tProcess Logs: "));
        //determine which uglify going to be used
        var uglify = type == "js" ? uglify_js : uglify_css;
        var process = gulp.src(sources);
        //initialize source maps if configured so
        if (settings.generate_sourcemaps) {
            process = process.pipe(sourcemaps.init()).on('error', log);
        }
        //if less, compile it and treat as normal css afterward
        if (type == "less") {
            process = process.pipe(less()).on('error', log);
            type = "css";
        }
        //combine files
        var file_name = settings.combined_prefix + name + settings.combined_postfix + "." + type;
        process = process.pipe(concat(file_name));
        //output combine files if set
        if ((settings.create_combined && !production) || development) {
            console.log(colors.magenta("\t\t\tGenerate minified file in ") + settings.combined_destination + colors.magenta(" as ") + file_name);
            process = process.pipe(gulp.dest(settings.combined_destination)).on('error', log);
        }
        if ((settings.create_minified && !development) || production) {
            file_name = (!production ? settings.minified_prefix : "") + name + (!production ? settings.minified_postfix : "") + "." + type;
            process = process.pipe(uglify()).on('error', log)
                .pipe(rename(file_name)).on('error', log);
            //generate source maps
            if (settings.generate_sourcemaps) {
                console.log(colors.magenta("\t\t\tGenerating Source Maps"));
                process = process.pipe(sourcemaps.write("./")).on('error', log);
            }
            console.log(colors.magenta("\t\t\tGenerate minified file in ") + settings.minified_destination + colors.magenta(" as ") + file_name);
            process = process.pipe(gulp.dest(settings.minified_destination)).on('error', log);
        }
        console.log(colors.rainbow("\n\tTask Finished Successfully!\n"));
        return {
            files: sources
        };
    };

    gulpWorker.js = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "js"
        });
        return {
            chain: function(override_options) {
                var new_options = options.extends(override_options);
                gulpWorker.js(files, new_options);
            }
        };
    };

    gulpWorker.css = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "css"
        });
        return {
            chain: function(override_options) {
                var new_options = options.extends(override_options);
                gulpWorker.css(files, new_options);
            }
        };
    };

    gulpWorker.less = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "less"
        });
        return {
            chain: function(override_options) {
                var new_options = options.extends(override_options);
                gulpWorker.less(files, new_options);
            }
        };
    };

    gulp.task('watch', function() {
        for (var i = 0; i < works.length; i++) {
            var work = JSON.parse(JSON.stringify(works[i]));
            //if the gulp_on_watch set true, when console run gulp watch, the worker will be called once
            var gulp_on_watch = ("gulp_on_watch" in work.options) ? work.settings.gulp_on_watch : gulpWorker.config.gulp_on_watch;
            if (gulp_on_watch)
                worker(work.files, work.options, work.type);
            //initialize settings
            var additionals = work.options.additional_watch || [];
            if (typeof(additionals) == "string")
                additionals = [additionals];
            var watches = work.files.concat(additionals);
            console.log(colors.cyan("\tStarting watch:\n"));
            console.log(colors.yellow("\t\tWatching Files:\n"));
            var settings = initSettings(work.options);
            var sources = findFiles(watches, settings.base_folder, {
                show_log: true
            });
            ! function(s, settings) {
                gulp.watch(s, function() {
                    console.log(colors.magenta("Changes detected, starting to rebuild files"));
                    worker(settings.files, settings.options, settings.type);
                    console.log(colors.magenta("Rebuild from watch finished\n"));
                });
            }(sources, work);
        }
    });

    gulp.task('default', function() {
        for (var i = 0; i < works.length; i++) {
            var returns = worker(works[i].files, works[i].options, works[i].type);
        }
    });

    //properties
    gulpWorker.args = args;
    gulpWorker.config = config;
    //actions
    gulpWorker.configure = config.overrideDefaults;

})(gulpWorker);
module.exports = gulpWorker;