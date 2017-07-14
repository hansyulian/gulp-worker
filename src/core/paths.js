var paths = module.exports = {};
(function(paths, fileExists) {

    function findFiles(files, directory, options) {
        var sources = [];
        var showLog = options.showLog;
        for (var i = 0; i < files.length; i++) {
            var file = directory + files[i];
            if (fileExsits(file) || file.indexOf("*") != -1) {
                console.log("\t\t\t" + colors.green(file));
                sources.push(file);
            } else
                console.log("\t\t\t" + colors.red(file) + " <- Missing!");
        }
        return sources;
    }


    paths.findFiles = findFiles;
})(paths, require("fileExists"));