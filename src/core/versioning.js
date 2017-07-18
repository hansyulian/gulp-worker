(function(versioning, fs, path, colors, fileExists) {

    function detectVersion(file) {
        filePath = "./" + file;

        var result = undefined;
        if (fileExists(filePath)) {
            var data = fs.readFileSync(filePath, {
                encoding: "utf-8"
            });
            var regex = /(\d.\d.\d)/;
            match = data.match(regex);
            result = match[0];

            console.log(colors.green("\tAutomatic versioning, detected version: " + result));
        } else {
            console.log(filePath + " for automatic versioning not exists!");
        }

        if (result)
            return result;
        else
            return "";

    }


    versioning.detectVersion = detectVersion;
})(module.exports = {}, require("fs"), require("path"), require("colors"), require("file-exists"));