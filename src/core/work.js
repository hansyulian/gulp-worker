(function(work, versioning, paths, args, gulpUtil, concat, colors, sourcemaps) {

    var handlerContexts = {};
    var handlerList = [{
        "name": "less",
        "path": "../works/less"
    }, {
        "name": "js",
        "path": "../works/js"
    }, {
        "name": "css",
        "path": "../works/css"
    }, ]

    function initializeHandlers(context) {
        handlerContexts = {};
        for (var i = 0; i < handlerList.length; i++) {
            handlerContext = handlerList[i];
            handlerContexts[handlerContext.name] = handlerContext;
            initializeHandlerContext(handlerContext);
            initializeMainExtension(handlerContext, context)
        }
    }

    function initializeHandlerContext(handlerContext) {
        handlerContext.handler = require(handlerContext.path);
    }

    function initializeMainExtension(handlerContext, context) {
        var mainExtensions = context.mainExtensions;
        var works = context.works;

        var callback = function(files, options) {
            works.push({
                files: files,
                options: options,
                type: handlerContext.name
            })
            return {
                chain: function(overrideOptions) {
                    var parentOptions = JSON.parse(JSON.stringify(options));
                    var newOptions = parentOptions.extends(overrideOptions);
                    callback(files, newOptions);
                }
            }
        }

        mainExtensions.push({
            name: handlerContext.name,
            callback: callback
        })
    }

    function worker(spec, options, context) {
        options = options || {};
        var files = spec.files;
        var type = spec.type;
        var gulp = context.gulp;

        console.log(colors.cyan("\n\tStarting Task\n\n") + colors.yellow("\t\tFiles:"));
        var settings = context.initSettings(options);
        var version = getVersion(settings);
        var sources = getSourceFiles(files, settings);
        var fileName = settings.name + (version != "" && settings.version_on_file ? "-" + version : "");

        console.log(colors.yellow("\n\n\t\tProcess Logs: "));
        var handler = getHandlerByType(type);
        context.handler = handler;

        var gulpProcess = gulp.src(sources);
        var gulpProcess = setPreprocessor(gulpProcess, settings, context);

        createCombined(gulpProcess, settings, context);
        createMinified(gulpProcess, settings, context);
    }

    function getVersion(settings) {
        version = args.version;
        if (settings.automaticVersioning) {
            version = version || versioning.detectVersion(settings.changelogFileName);

            if (version)
                console.log(colors.green("\tAutomatic versioning, detected version: " + colors.cyan(version)));
            else
                console.log(filePath + " for automatic versioning not exists!");
        }
    }

    function getSourceFiles(files, settings) {
        return paths.findFiles(files, settings.baseFolder, {
            showLog: true
        })
    }

    function getHandlerByType(type) {
        var result = handlerContexts[type].handler;
        return result;
    }

    function setPreprocessor(gulpProcess, settings, context) {
        var handler = context.handler;
        if (handler.preprocess) {
            log = gulpUtil.log;
            return gulpProcess.pipe(handler.preprocess()).on("error", log);
        }
        return gulpProcess;
    }


    function createCombined(gulpProcess, settings, context) {
        if (!settings.createCombined && !args.development)
            return;

        var handler = context.handler;
        var destination = settings.combinedDestination || "";
        var name = settings.name;
        var gulp = context.gulp;


        var fileName = settings.combinedPrefix + name + settings.combinedPostfix;

        fileName = handler.fileNameModifier(fileName, context);
        gulpProcess = gulpProcess.pipe(concat(fileName));

        console.log(colors.magenta("\t\t\tGenerate combined file in ") + destination + colors.magenta(" as ") + fileName);

        gulpProcess = gulpProcess.pipe(gulp.dest(destination))
    }

    function createMinified(gulpProcess, settings, context) {
        if (!settings.createMinified && !args.production)
            return;

        var handler = context.handler;
        var destination = settings.minifiedDestination || "";
        var name = settings.name;
        var gulp = context.gulp;


        var fileName = settings.minifiedPrefix + name + settings.minifiedPostfix;

        fileName = handler.fileNameModifier(fileName, context);
        gulpProcess = gulpProcess.pipe(concat(fileName));

        console.log(colors.magenta("\t\t\tGenerate minified file in ") + destination + colors.magenta(" as ") + fileName);

        gulpProcess = setMinifier(gulpProcess, settings, context);
        gulpProcess = setGenerateSourceMap(gulpProcess, settings, context);

        gulpProcess = gulpProcess.pipe(gulp.dest(destination));
    }


    function setMinifier(gulpProcess, settings, context) {
        var handler = context.handler;
        if (settings.createMinified && handler.minify) {
            log = gulpUtil.log;
            return gulpProcess.pipe(handler.minify()).on("error", log);
        }
        return gulpProcess;
    }

    function setGenerateSourceMap(gulpProcess, settings, context) {

        if (settings.generateSourceMaps) {
            log = gulpUtil.log;
            gulpProcess = gulpProcess.pipe(sourcemaps.init()).on('error', log);
        }
        return gulpProcess
    }

    work.handlerList = handlerList;
    work.initializeHandlers = initializeHandlers;
    work.worker = worker;
})(module.exports = {}, require("./versioning"), require("./paths"), require("./arguments"), require("gulp-util"), require("gulp-concat"), require("colors"), require("gulp-sourcemaps"));