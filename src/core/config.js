var config = module.exports = {};
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



        //To be deprecated
        combined_destination: null, // to be deprecated
        minified_destination: null, // to be deprecated
        base_folder: "./",
        generate_sourcemaps: true, // generate sourcemap
        version_on_destination_folder: false, // put version number in folder
        version_on_file: false, // put version number in file
        create_minified: true, // create minified version
        create_combined: true, // create combined version
        combined_prefix: "", // prefix for combined file
        combined_postfix: "", // postfix for combined file
        minified_prefix: "", // prefix for minified file
        minified_postfix: ".min", // postfix for minified file
        automatic_versioning: true, // version number taken from changelog
        changelog_file_name: "changelog.txt", // name of changelog file
        gulp_on_watch: true // when doing watch, trigger default task
    }

    function overrideDefaults(configurations) {
        for (var i in configurations) {
            defaults[i] = configurations[i];
        }
    }

    function initialize(configurations) {
        result = {};
        for (var i in defaultConfigurations) {
            result[i] = configurations[i] || defaultConfigurations[i];
        }
        return result;
    }

    //Properties
    config.defaults = defaults;

    //Actions
    config.overrideDefaults = overrideDefaults;
    config.initialize = initialize;
})(config);