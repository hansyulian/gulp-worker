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