worker = require("./main.js");

worker.css([
    "test1.css",
    "test2.css",
], {
    base_folder: "./tests/src",
    destination: "./tests/build",
    create_combined: false,
    create_minified: false
})