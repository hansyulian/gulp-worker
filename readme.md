# Gulp Worker
This package is a gulp utility to help creating a single combined css or javascript file from several files. 
The combined files also can be appended by version. 
The version can read from changelog.txt file or manually inputted when running the gulp.

## Installation
Use the console and run this:
``` javascript
npm install gulp-worker
```

## Importing
Create a gulpfile.js and put this as content:
``` javascript
var worker = require("gulp-worker");
```

## Usage
Gulp worker can be run using command:
``` javascript
gulp
```
This command will only run the default task once. In case you want to run the gulp watching changes happens to registered files, run this command:
``` javascript
gulp watch
```
If you want to put the version in the result file, use --build version
``` javascript
gulp --build 0.1.6
```
If you want to enforce development built, regardless of combined or minified settings to produce combined only
``` javascript
gulp --development
```
If you want to enforce production built, regardless of combined or minified settings to produce minified only
``` javascript
gulp --production
```
The same additional parameters also can be used for gulp watch

## Available Configuration
There are some configurations available for gulp worker together with their default values:
``` javascript
config = {
    name: "default",                        // name of output file 
    destination: "./",                      // output folder
    combined_destination: null,             // destination for combined
    minified_destination: null,             // destination for minified
    base_folder: "./",                      // base source folder
    generate_sourcemaps: true,              // generate sourcemap
    version_on_destination_folder: false,   // put version number in folder
    version_on_file: false,                 // put version number in file
    create_minified: true,                  // create minified version
    create_combined: true,                  // create combined version
    combined_prefix: "",                    // prefix for combined file
    combined_postfix: "",                   // postfix for combined file
    minified_prefix: "",                    // prefix for minified file
    minified_postfix: ".min",               // postfix for minified file
    automatic_versioning: true,             // version number taken from changelog
    changelog_file_name: "changelog.txt",   // name of changelog file
    gulp_on_watch: true                     // when doing watch, trigger default task
};
```

## Global Configuration Overriding
In order to override global configuration, there is a function **configure**. Here is an example:
``` javascript
worker.configure({
    destination: "./build",
    base_folder: "./src"
})
```
This will only override configuration specified. If you want to override specific configuration without using **configure** and have the same result:
``` javascript
worker.config.destination = "./build";
worker.config.base_folder = "./src";
```
## Usage Code
The code for gulpfile.js will have the format of **worker.PROCESS_NAME(SOURCE_ARRAY,ADDITIONAL_CONFIGURATION)**. Current available processes are css, less, and js. Additional configuration will only override defined config for specific work. Here is the example:

``` javascript
worker.js([
    'main.js',
], {
    destination: "public/build",
    base_folder: "src/js",
    version_on_destination_folder: false,
    automatic_versioning: true,
    name: "combined"
});
```

## Chaining
In case you want to use same sets of files, but different configuration, you can use .chain after the .js, .css, or .less command to generate a task using same files but different configurations. 

The structure of chain is .chain(options).
Here is the example:
``` javascript
worker.js([
    'main.js',
], {
    destination: "public/build",
    base_folder: "src/js",
    version_on_destination_folder: false,
    create_minified: false,
    automatic_versioning: true,
    name: "combined"
}).chain({
    destination: "build",
    base_folder: "src/js",
    version_on_destination_folder: true,
    automatic_versioning: false,
    name: "main"
});
```
