var worker = require("../../main.js");
var gulp = require("gulp");

//full
worker.js([
    'main.js',
], {
    destination: "./tests/build",
    base_folder: "./tests/src",
    version_on_destination_folder: false,
    version_on_file: false,
    name: "compiled"
});

describe("Running Test Task", function() {
    it("Run default task", function() {
        gulp.start("default");
    });
});