var worker = require("./../main.js");
var chai = require("chai");
assert = chai.assert;

describe("Module Require Tests", function() {
    it("Have config", function() {
        assert(worker.config ? true : false, "Missing config");
    });
    it("Have js", function() {
        assert(worker.js ? true : false, "Missing js");
    });
    it("Have css", function() {
        assert(worker.css ? true : false, "Missing css");
    });
    it("Have less", function() {
        assert(worker.less ? true : false, "Missing less");
    });
});