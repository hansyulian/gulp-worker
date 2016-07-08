var worker = require("../../main.js");

describe("Object Equals / ", function() {
    it("Equality 1", function() {
        var1 = {
            a: "a",
            b: "b",
            c: "c"
        }
        var2 = {
            a: "a",
            b: "b",
            c: "c"
        }
        expect(var1.equals(var2)).toEqual(true);
    });
    it("Equality 2", function() {
        var1 = {
            a: "a",
            b: "b",
            c: "c"
        }
        var2 = {
            a: "a",
            b: "b",
            c: "c",
            d: "d"
        }
        expect(var1.equals(var2)).toEqual(false);
    });
    it("Equality 3", function() {
        var1 = {
            a: "a",
            b: "b",
            c: "c",
            d: "d"
        }
        var2 = {
            a: "a",
            b: "b",
            c: "c"
        }
        expect(var1.equals(var2)).toEqual(false);
    });
});

describe("Object Extends", function() {
    it("Extends 1", function() {
        var obj = {
            attr1: "val1",
            attr2: "val2",
        };
        var override = {

        };
        var expectation = {
            attr1: "val1",
            attr2: "val2",
        };
        expect(obj.extends(override)).toEqual(expectation);
    });
    it("Extends 2", function() {
        var obj = {
            attr1: "val1",
            attr2: "val2",
        };
        var override = {
            attr3: "val3"
        };
        var expectation = {
            attr1: "val1",
            attr2: "val2",
            attr3: "val3"
        };
        expect(obj.extends(override)).toEqual(expectation);
    });
    it("Extends 3", function() {
        var obj = {
            attr1: "val1",
            attr2: "val2",
        };
        var override = {
            attr2: "value2"
        };
        var expectation = {
            attr1: "val1",
            attr2: "value2",
        };
        expect(obj.extends(override)).toEqual(expectation);
    });
    it("Extends 3", function() {
        var obj = {
            attr1: "val1",
            attr2: "val2",
        };
        var override = {
            attr2: "value2"
        };
        var expectation = {
            attr1: "val1",
            attr2: "value2",
        };
        var result = obj.extends(override);
        obj = {};
        expect(result).toEqual(expectation);
    });
    it("Extends 3", function() {
        var obj = {
            attr1: "val1",
            attr2: "val2",
        };
        var override = {
            attr2: "value2"
        };
        var expectation = {
            attr1: "val1",
            attr2: "value2",
        };
        var result = obj.extends(override);
        override = {};
        expect(result).toEqual(expectation);
    });
});