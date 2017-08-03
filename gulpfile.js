worker = require("./main.js");

worker.css([
    "test1.css",
    "test2.css",
], {
    createCombined: false,
    createMinified: false,
    baseFolder: "./tests/src",
    destination: "./tests/build"
})