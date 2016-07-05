var gulpWorker = {};
(function() {
    gulpWorker.config = {
        name: "default",
        destination: "./",
        combined_destination: null,
        minified_destination: null,
        base_folder: "./",
        generate_sourcemaps: true,
        version_on_destination_folder: true,
        version_on_file: true,
        create_minified: true,
        create_combined: true,
        combined_prefix: "",
        combined_postfix: "",
        minified_prefix: "",
        minified_postfix: ".min",
        automatic_versioning: false,
        changelog_file_name: "changelog.txt",
        gulp_on_watch: true
    };
    var config = gulpWorker.config;
    var gulp = require('gulp'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        uglify_js = require('gulp-uglify'),
        uglify_css = require('gulp-uglifycss'),
        sourcemaps = require('gulp-sourcemaps'),
        minify = require("minifier"),
        fileExists = require("file-exists"),
        colors = require("colors"),
        debug = require("gulp-debug"),
        using = require("gulp-using"),
        filelist = require("gulp-filelist"),
        less = require("gulp-less");
    var argv = require('yargs').argv,
        version = argv.build ? argv.build : "";
    var log = require('gulp-util').log;



    var init_settings = function(options) {
        var settings = JSON.parse(JSON.stringify(gulpWorker.config));
        for (i in options)
            settings[i] = options[i];

        if (settings.base_folder[settings.base_folder.length - 1] != "/")
            settings.base_folder += "/";
        settings.combined_destination = (settings.combined_destination || settings.destination) + (settings.version_on_destination_folder && version != "" ? "-" + version : "");
        settings.minified_destination = (settings.minified_destination || settings.destination) + (settings.version_on_destination_folder && version != "" ? "-" + version : "");
        return settings;
    };
    var works = [];

    var filePaths = function(files, directory, options) {
        var sources = [];
        var show_log = options.show_log;
        //checking file existence and passing to process array
        for (i in files) {
            var file = directory + files[i];
            console.log("\t\t\t" + colors.green(file));
            sources.push(file);
            // if (fileExists(file)) {
            //     console.log("\t\t\t" + colors.green(file));
            //     sources.push(file);
            // } else
            //     console.log("\t\t\t" + colors.red(file) + " <- Missing!");
        }
        return sources;
    };
    var automatic_version = function(settings) {
        var fs = require('fs');
        var path = require('path');

        var file_path = path.join(__dirname, settings.changelog_file_name);
        var data = fs.readFileSync(file_path, {
            encoding: 'utf-8'
        });
        var regex = /(\d.\d.\d)/;
        var match = regex.exec(data);
        var result = match[0];
        console.log(colors.green("\tAutomatic versioning, detected version: " + result));
        if (result)
            return result;
        else
            return "";

    }

    var worker = function(files, options, type) {
        options = options || {};
        //telling that the task is starting
        console.log(colors.cyan("\n\tStarting Task\n\n") + colors.yellow("\t\tFiles:"));
        //initialize settings given
        settings = init_settings(options);
        var sources = filePaths(files, settings.base_folder, {
            show_log: true
        });

        if (settings.automatic_versioning && version == "")
            version = automatic_version(settings);
        var name = settings.name + (version != "" && settings.version_on_file ? "-" + version : "");
        console.log(colors.yellow("\n\n\t\tProcess Logs: "));
        //determine which uglify going to be used
        var uglify = type == "js" ? uglify_js : uglify_css;
        var process = gulp.src(sources);
        //initialize source maps if configured so
        if (settings.generate_sourcemaps) {
            process = process.pipe(sourcemaps.init());
        }
        //if less, compile it and treat as normal css afterward
        if (type == "less") {
            process = process.pipe(less());
            type = "css";
        }
        //combine files
        var file_name = settings.combined_prefix + name + settings.combined_postfix + "." + type;
        process = process.pipe(concat(file_name));
        //output combine files if set
        if (settings.create_combined) {
            console.log(colors.magenta("\t\t\tGenerate minified file in ") + settings.combined_destination + colors.magenta(" as ") + file_name);
            process = process.pipe(gulp.dest(settings.combined_destination));
        }
        if (settings.create_minified) {
            file_name = settings.minified_prefix + name + settings.minified_postfix + "." + type;
            process = process.pipe(uglify())
                .pipe(rename(file_name));
            //generate source maps
            if (settings.generate_sourcemaps) {
                console.log(colors.magenta("\t\t\tGenerating Source Maps"));
                process = process.pipe(sourcemaps.write("./"));
            }
            console.log(colors.magenta("\t\t\tGenerate minified file in ") + settings.minified_destination + colors.magenta(" as ") + file_name);
            process = process.pipe(gulp.dest(settings.minified_destination));
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
    };

    gulpWorker.css = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "css"
        });
    };

    gulpWorker.less = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "less"
        })
    }

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
            settings = init_settings(work.options);
            var sources = filePaths(watches, settings.base_folder, {
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

    gulp.task("test", function() {

    });
})();