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
        fileExists = require("file-exists")
    colors = require("colors");
    var argv = require('yargs').argv,
        version = argv.build ? argv.build : "";

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
            if (fileExists(file)) {
                console.log("\t\t\t" + colors.green(file));
                sources.push(file);
            } else
                console.log("\t\t\t" + colors.red(file) + " <- Missing!");
        }
        return sources;
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
        var name = settings.name + (version != "" ? "-" + version : "");
        console.log(colors.yellow("\n\n\t\tProcess Logs: "));
        //determine which uglify going to be used
        var uglify = type == "js" ? uglify_js : uglify_css;
        var process = gulp.src(sources);
        //initialize source maps if configured so
        if (settings.generate_sourcemaps) {
            process = process.pipe(sourcemaps.init());
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
    }

    gulpWorker.js = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "js"
        });
    }

    gulpWorker.css = function(files, options) {
        works.push({
            files: files,
            options: options,
            type: "css"
        });
    }

    gulp.task('watch', function() {
        for (var i = 0; i < works.length; i++) {
            var work = works[i];
            //if the gulp_on_watch set true, when console run gulp watch, the worker will be called once
            var gulp_on_watch = ("gulp_on_watch" in work.options) ? work.settings.gulp_on_watch : gulpWorker.config.gulp_on_watch;
            if (gulp_on_watch)
                worker(work.files, work.options, work.type);
            //initialize settings
            console.log(colors.cyan("\tStarting watch:\n"));
            console.log(colors.yellow("\t\tWatching Files:\n"));
            settings = init_settings(work.options);
            var sources = filePaths(work.files, settings.base_folder, {
                show_log: true
            });

            gulp.watch(sources, function() {
                worker(work.files, work.options, work.type);
            });
        }
    });

    gulp.task('default', function() {
        for (var i = 0; i < works.length; i++) {
            var returns = worker(works[i].files, works[i].options, works[i].type);
        }
    });
})();