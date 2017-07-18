(function(args, argv) {

    var version = argv.build ? argv.build : "";
    var production = argv.production ? true : false;
    var development = argv.development ? true : false;

    args.version = version;
    args.production = production;
    args.development = development;

})(module.exports = {}, require("yargs").argv);