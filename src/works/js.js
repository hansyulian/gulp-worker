(function(js, minify) {

    function fileNameModifier(name, context) {
        return name + ".js";
    }

    js.minify = minify;
    js.fileNameModifier = fileNameModifier;
})(module.exports = {}, require("gulp-uglify"));