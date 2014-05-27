var Bermuda;

Bermuda = (function() {
  var autoCenter, createMap, createMarker, createMarkers, createPolygon, listen, markerCoordinates, markerLatLangs, removePolygon, toLatLang, toLatLangs;

  Bermuda.prototype.settings = {
    markerTitle: 'Drag me!',
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    onChange: function(coords) {}
  };

  function Bermuda(elem, config) {
    var key, value;
    this.elem = elem;
    if (config == null) {
      config = {};
    }
    for (key in config) {
      value = config[key];
      this.settings[key] = value;
    }
  }

  Bermuda.prototype.onChange = function(callback) {
    return settings.onChange = callback;
  };

  Bermuda.prototype.draw = function(coords) {
    var map;
    map = createMap(this.elem, this.settings);
    return this.initPolygon(map, this.initMarkers(map, coords));
  };

  createMap = function(elem, settings) {
    return new google.maps.Map(elem, settings);
  };

  Bermuda.prototype.initMarkers = function(map, coords) {
    var marker, markers, _i, _len;
    markers = createMarkers(map, this.settings, coords);
    autoCenter(map, markerLatLangs(markers));
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      listen(marker, "dragend", (function(_this) {
        return function() {
          return _this.settings.onChange(markerCoordinates(markers));
        };
      })(this));
    }
    return markers;
  };

  createMarkers = function(map, settings, coords) {
    var point, points, _i, _len, _results;
    points = toLatLangs(coords);
    _results = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      _results.push(createMarker(map, point, settings));
    }
    return _results;
  };

  toLatLangs = function(coords) {
    var coord, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = coords.length; _i < _len; _i++) {
      coord = coords[_i];
      _results.push(toLatLang(coord));
    }
    return _results;
  };

  toLatLang = function(coord) {
    return new google.maps.LatLng(coord[0], coord[1]);
  };

  createMarker = function(map, point, settings) {
    return new google.maps.Marker({
      position: point,
      map: map,
      draggable: true,
      title: settings.markerTitle
    });
  };

  autoCenter = function(map, markers) {
    var bounds, position, _i, _len;
    bounds = new google.maps.LatLngBounds();
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      position = markers[_i];
      bounds.extend(position);
    }
    return map.fitBounds(bounds);
  };

  listen = function(elem, event, callback) {
    return google.maps.event.addListener(elem, event, callback);
  };

  Bermuda.prototype.initPolygon = function(map, markers) {
    var marker, polygon, _i, _len, _results;
    polygon = createPolygon(map, this.settings, markers);
    _results = [];
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      _results.push(listen(marker, "drag", (function(_this) {
        return function() {
          var prevPolygon;
          prevPolygon = polygon;
          polygon = createPolygon(map, _this.settings, markers);
          return removePolygon(prevPolygon);
        };
      })(this)));
    }
    return _results;
  };

  markerLatLangs = function(markers) {
    var marker, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      _results.push(marker.position);
    }
    return _results;
  };

  markerCoordinates = function(markers) {
    var marker, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      _results.push([marker.position.lat(), marker.position.lng()]);
    }
    return _results;
  };

  removePolygon = function(polygon) {
    return polygon.setMap(null);
  };

  createPolygon = function(map, settings, markers) {
    return new google.maps.Polygon({
      map: map,
      paths: markerLatLangs(markers),
      strokeColor: settings.strokeColor,
      strokeOpacity: settings.strokeOpacity,
      strokeWeight: settings.strokeWeight,
      fillColor: settings.fillColor,
      fillOpacity: settings.fillOpacity,
      draggable: false,
      geodesic: true
    });
  };

  return Bermuda;

})();
