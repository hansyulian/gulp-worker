(function(initialize, versioning) {
    function initSettings(options, config) {

        var settings = config.initialize(options);
        var version = versioning.detectVersion(settings.changelogFileName);
        console.log("Settings:", settings);
        console.log("Version:", version);

        if (settings.base_folder[settings.base_folder.length - 1] != "/")
            settings.base_folder += "/";
        settings.combined_destination = (settings.combined_destination || settings.destination) + (settings.version_on_destination_folder && version != "" ? "-" + version : "");
        settings.minified_destination = (settings.minified_destination || settings.destination) + (settings.version_on_destination_folder && version != "" ? "-" + version : "");
        return settings;
    }

    initialize.initSettings = initSettings;

})(module.exports = {}, require("./versioning"))