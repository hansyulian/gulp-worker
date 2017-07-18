(function(paths, fileExists, colors) {

    function findFiles(files, directory, options) {
        var sources = [];
        var showLog = options.showLog;
        for (var i = 0; i < files.length; i++) {
            var file = directory + files[i];
            if (fileExists(file) || file.indexOf("*") != -1) {
                console.log("\t\t\t" + colors.green(file));
                sources.push(file);
            } else
                console.log("\t\t\t" + colors.red(file) + " <- Missing!");
        }
        return sources;
    }


    paths.findFiles = findFiles;
})(module.exports = {}, require("file-exists"), require("colors"));