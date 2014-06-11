# Bermuda
Simple and fast Javascript library for drawing draggable polygons in [Google Maps](https://developers.google.com/maps/documentation/javascript/)!

![Map Dragging](http://i.imgur.com/jWw09jx.gif)

## Usage
Include required libraries

```html
<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
<script src="bermuda.min.js"></script>
```

Paint fancy polygons!

```javascript
var map = new Bermuda(document.getElementById("map-canvas"));
map.draw([[25.774, -80.190], [18.466, -66.118], [32.321, -64.757]]);
```

### Available Operations
Once you build your map, you could do some amazing stuff with it, the available operations are listed below

method      | arguments | return  | description
------------|-----------|---------|---
`draw`      | `Array`   | `none`  | Draw polygon on the map
`zoomIn`    | `none`    | `none`  | Zoom in
`zoomOut`   | `none`    | `none`  | Zoom out
`disable`   | `none`    | `none`  | Freeze the map, disable interaction
`enable`    | `none`    | `none`  | Re-enable interaction
`getCoords` | `none`    | `Array` | Get the current marker coordinates 

## Configuration Options

property     | type       | description
-------------|------------|------------
`map`        | `Object`   | Options for [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)
`polygon`    | `Object`   | Options for [google.maps.Polygon](https://developers.google.com/maps/documentation/javascript/reference#Polygon)
`icon`       | `Object`   | Configuration for marker icons 
`autoCenter` | `Bool`     | Map automatic centering
`onChange`   | `Function` | This function will be called everytime a pin is dragged

### Example
```javascript
var map = new Bermuda(document.getElementById("map-canvas"), {
    polygon: {
      strokeColor: "#008525",
      fillColor: "#008525"
    },
    icon: {
      image: "images/map-pin@2x.png",
      width: 15,
      height: 21
    },
    autoCenter: true,
    onChange: function(coords) {
        console.log(coords);
    }
});
```

Enjoy!