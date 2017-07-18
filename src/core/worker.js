var worker = module.exports = {};
(function(workers, versioning, paths, args) {

    var handlers = {};
    var handlerList = [{
        "name": "less",
        "path": "../handlers/less"
    }, {
        "name": "js",
        "path": "../handlers/js"
    }, {
        "name": "css",
        "path": "../handlers/css"
    }, ]

    function initializeHandlers() {
        handlers = {};
        for (var i = 0; i < handlerList.length; i++) {
            context = handlerList[i];
            handlers[context.name] = context;
            initializeHandlerContext(context);
        }
    }

    function initializeHandlerContext(context) {
        context["handler"] = require(context.path);
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
        var handle = handler.handle || function() {};
        var minify = handler.minify || function() {};

        var gulpProcess = gulp.src(sources);
        var gulpProcess = setGenerateSourceMap(gulpProcess, settings, context)s
    }

    function getVersion(settings) {
        version = args.version;
        if (settings.automaticVersioning)
            version = version || versioning.detectVersion(settings.changelogFileName);
    }

    function getSourceFiles(files, settings) {
        return path.findFiles(files, settings.baseFolder, {
            showLog: true
        })
    }

    function getHandlerByType(type) {

    }

    function setGenerateSourceMap(gulpProcess, settings, context) {

        if (settings.generateSourceMaps) {
            sourcemaps = context.sourcemaps;
            gulpProcess = gulpProcess.pipe(sourcemaps.init()).on('error', log);
        }
        return gulpProcess
    }

    workers.handlerList = handlerList;

    workers.initializeHandlers = initializeHandlers;
    workers.worker = worker;
})(module.exports = {}, require("./versioning"), require("./paths"), require("./arguments"));