(function(less, gulpLess, minify) {


    function preprocess() {
        return gulpLess();
    }

    function fileNameModifier(name, context) {
        return name + ".css";
    }

    less.preprocess = preprocess;
    less.minify = minify;
    less.fileNameModifier = fileNameModifier;
})(module.exports = {}, require("gulp-less"), require("gulp-uglifycss"));