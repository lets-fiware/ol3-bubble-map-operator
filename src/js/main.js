/*
 * ol3-bubble-map
 * https://github.com/lets-fiware/ol3-bubble-map-operator
 *
 * Copyright (c) 2020-2024 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (data == null || typeof data !== "object") {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var createBubble = function createBubble(entities) {
        var radiusAttr = MashupPlatform.prefs.get("radiusAttr");
        if (!radiusAttr) {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }
        var textAttr = MashupPlatform.prefs.get("textAttr");

        return entities.map(function (entity) {
            var feature = {
                id: entity.id,
                tooltip: entity.name || entity.id,
                titile: entity.name || entity.id,
                data: entity,
                location: entity.location,
                style: {
                    image: function (ol, style, resolution) {
                        return new ol.style.Circle({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 252, 76, 0.5)'
                            }),
                            radius: (1000 / resolution) * style.radius,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(255, 252, 76, 1)',
                                width: 1
                            })
                        });
                    },
                    context: function (ol, style, feature, resolution) {
                        var radius = feature.get('data').style.radius;
                        radius = (1000 / resolution) * radius;
                        style.getImage().setRadius(radius);
                    },
                    radius: entity[radiusAttr]
                }
            }
            if (textAttr != "") {
                feature.style.text = function (ol, style) {
                    return new ol.style.Text({
                        font: '12px serif',
                        text: entity[textAttr],
                        fill: new ol.style.Fill({
                            color: '#00008B'
                        })
                    });
                }
            }
            return feature;
        });
    }

    var callBack = function callBack(data) {
        var entities = parseInputEndpointData(data);

        entities = createBubble(entities);

        if (MashupPlatform.operator.outputs.poiOutput.connected) {
            MashupPlatform.wiring.pushEvent("poiOutput", entities);
        }
    }

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("entityInput", callBack);
    }

    /* test-code */
    window.callBack = callBack;
    window.createBubble = createBubble;
    /* end-test-code */

})();
