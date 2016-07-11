var worker = require("../../main.js");

describe("Module Require Tests / ", function() {
    it("Have config", function() {
        var result = "config" in worker;
        expect(result).toEqual(true);
    });
    it("Have js", function() {
        var result = "js" in worker;
        expect(result).toEqual(true);
    });
    it("Have css", function() {
        var result = "css" in worker;
        expect(result).toEqual(true);
    });
    it("Have less", function() {
        var result = "less" in worker;
        expect(result).toEqual(true);
    });
});

describe("Configuration extension", function() {
    it("#1", function() {
        var conf = require("../../main.js");
        var override = {
            destination: "something",
            unknown: "unknown"
        };
        conf.configure(override);
        for (var i in override)
            expect(conf.config[i]).toEqual(override[i]);
    });
});