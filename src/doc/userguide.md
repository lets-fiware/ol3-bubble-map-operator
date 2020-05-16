## Introduction

The ol3 bubble map operator is a WireCloud operator that allows you to create a bubble map that has circles on a map.

## Settings

-    `Radius attribute`: Name of attribute that specifies a radius.
-    `Text attribute`: Name of attribute that specifies a text.

## Wiring

### Input Endpoints

-    `Entities`: Received entities will be transform into PoIs.

### Output Endpoints

-    `PoIs`: Transformed Points of Interests from the received entities

## Usage

In order to use this operator, plug a source of NGSI entities (like the [ngsi-source-operator](https://github.com/wirecloud-fiware/ngsi-source-operator)) to the operator input, and connect the output to a map viewer widget (like the [ol3-map-widget](https://github.com/Wirecloud/ol3-map-widget)).

For instance, send the following entity to the input endpoint of this operator.

```
[
  {
    "id": "place001",
    "type": "PointOfInterest",
    "name": "Madrid",
    "location": {
      "type": "Point",
      "coordinates": [-3.703,40.417]
    },
    "radius": 1000
  }
]
```
