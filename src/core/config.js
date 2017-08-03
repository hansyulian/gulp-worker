(function(config) {

    var defaults = {
        //folder and naming configuration
        name: "default", // name of output file
        combinedPrefix: "", // prefix for combined file
        combinedPostfix: "", // postfix for combined file
        minifiedPrefix: "", // prefix for minified file
        minifiedPostfix: ".min", // postfix for minified file

        destination: "./", // output folder
        baseFolder: "./", // base source folder

        //Versioning Configuration
        versionOnDestinationFolder: false, // put version number in folder
        versionOnFile: false, // put version number in file
        automaticVersioning: true, // put version name based on changelog file version
        changelogFileName: "changelog.txt", // changelog file name
        gulpOnWatch: true, // When watch, trigger default task

        //Combining Configuration
        combinedDestination: null, // destination for combined
        createCombined: true, // create combined file

        minifiedDestination: null, // destination for minified
        createMinified: true, // create minified file
        generateSourceMaps: true, // generate source map


        //debug
        debug: false,
        debugLevel: "debug"
    }

    function overrideDefaults(configurations) {
        for (var i in configurations) {
            defaults[i] = configurations[i];
        }
    }

    function initialize(configurations) {
        result = {};
        for (var i in defaults) {
            result[i] = configurations[i] || defaults[i];
        }
        return result;
    }

    //Properties
    config.defaults = defaults;

    //Actions
    config.overrideDefaults = overrideDefaults;
    config.initialize = initialize;
})(module.exports = {});