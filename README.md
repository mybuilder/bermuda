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

## Advanced Initialization

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