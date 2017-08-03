(function(css, minify) {

    function fileNameModifier(name, context) {
        return name + ".css";
    }


    css.minify = minify;
    css.fileNameModifier = fileNameModifier;
})(module.exports = {}, require("gulp-uglifycss"));