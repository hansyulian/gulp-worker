(function(initialize, versioning) {
    function initSettings(options, config) {

        var settings = config.initialize(options);
        var version = versioning.detectVersion(settings.changelogFileName);

        if (settings.baseFolder[settings.baseFolder.length - 1] != "/")
            settings.baseFolder += "/";
        settings.combinedDestination = (settings.combinedDestination || settings.destination) + (settings.versionOnDestination && version != "" ? "-" + version : "");
        settings.minifiedDestination = (settings.minifiedDestination || settings.destination) + (settings.versionOnDestination && version != "" ? "-" + version : "");
        return settings;
    }

    initialize.initSettings = initSettings;

})(module.exports = {}, require("./versioning"))