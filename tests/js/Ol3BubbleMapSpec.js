/* globals MockMP */

(function () {

    "use strict";

    describe("Ol3BubbleMap", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "radiusAttr": "radius",
                    "textAttr": "name",
                },
                inputs: ['entityInput'],
                outputs: ['poiOutput']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.poiOutput.connect({simulate: () => {}});
        });

        it("test callback", function () {
            callBack([{id: 'xyz', name: 'abc', radius: 10}]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();

        });

        it("test createBubble", function () {
            var entities = createBubble([{id: 'xyz', name: 'abc', radius: 10}]);

            expect(entities[0].style.radius).toBe(10);
        });

        it("test createBubble without text", function () {
            MashupPlatform.prefs.set("textAttr", "");

            var entities = createBubble([{id: 'xyz', name: 'abc', radius: 10}]);

            expect(entities[0].style.radius).toBe(10);
        });

        it("test createBubble", function () {
            var entities = createBubble([{id: 'xyz', name: 'abc', radius: 10}]);

            var ol = {
                style: {
                    Circle: function () {},
                    Fill: function () {},
                    Stroke: function () {},
                }
            }
            var feature = {
                get: function () {return {style: {radius: 20}};}
            }

            expect(entities[0].style.image(ol, {radius: 10}, 1)).toEqual(jasmine.any(Object));
        });

        it("test context function", function () {
            var entities = createBubble([{id: 'xyz', name: 'abc', radius: 10}]);

            var ol = {
                style: {
                    Circle: function () {},
                    Fill: function () {},
                    Stroke: function () {},
                }
            }
            var feature = {
                get: function () {return {style: {radius: 20}};}
            }
            var style = {
                getImage: function () {return {setRadius: function (r) {radius = r;}}}
            }
            var radius;
            entities[0].style.context(ol, style, feature, 1000);

            expect(radius).toEqual(20);
        });

        it("test text function", function () {
            var entities = createBubble([{id: 'xyz', name: 'abc', radius: 10}]);

            var ol = {
                style: {
                    Circle: function () {},
                    Fill: function () {},
                    Stroke: function () {},
                    Text: function () {},
                }
            }
            var func = entities[0].style.text(ol, {});

            expect(func).toEqual(jasmine.any(Object));
        });

        it("output endoint is not connected", function () {
            MashupPlatform.operator.outputs.poiOutput.disconnect();

            callBack([{id: 'xyz', radius: 10}]);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        })

        it("throws an Endpoint Value error if radius attribute is empty", function () {
            MashupPlatform.prefs.set("radiusAttr", "");

            expect(function () {
                callBack("[{}]");
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                callBack("{");
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                callBack(123);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                callBack(null);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });
    });
})();
