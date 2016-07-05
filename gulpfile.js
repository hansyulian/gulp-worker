worker = require("./main.js");

//full
worker.js([
    'main.js',
], {
    destination: "tests/build",
    base_folder: "tests/src",
    version_on_destination_folder: false,
    automatic_versioning: true,
    name: "compiled"
});