# Bermuda
Simple and fast Javascript library for drawing draggable polygons in Google Maps!

## Usage
Include required libraries

```html
<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
<script src="bermuda.min.js"></script>
```

Paint fancy polygons!

```javascript
var map = new Bermuda(document.getElementById('map-canvas'));
map.draw([[25.774, -80.190], [18.466, -66.118], [32.321, -64.757]]);
```

## Advanced Configuration

### Map Default Settings

```javascript
var map = new Bermuda(document.getElementById('map-canvas'), {
    markerTitle: 'Drag me!',
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    onChange: function(coords) {}
});
```

### Subscribe to Map Changes
You could subscribe to change events on the map easily

```javascript
var map = new Bermuda(canvas, {
    onChange: function(points) {
        console.log(points);
    }
});
//or
map.onChange(function(coords) {
    console.log(coords);
});
```

Enjoy!