var Bermuda,
  __slice = [].slice;

Bermuda = (function() {
  var DEFAULT_SETTINGS, autoCenter, combine, createIcon, isEmpty, listen, markerCoordinates, markerLatLangs, merge, removePolygon, toLatLang, toLatLangs;

  DEFAULT_SETTINGS = {
    marker: {},
    polygon: {},
    icon: {},
    map: {}
  };

  Bermuda.prototype.changeCallback = function(coords) {};

  function Bermuda(elem, config) {
    this.elem = elem;
    if (config == null) {
      config = {};
    }
    this.settings = combine(DEFAULT_SETTINGS, config);
    this.icon = createIcon(this.settings);
  }

  combine = function(defaults, config) {
    var item, key, name, value;
    for (name in config) {
      item = config[name];
      for (key in item) {
        value = item[key];
        defaults[name][key] = value;
      }
    }
    return defaults;
  };

  createIcon = function(settings) {
    var size;
    if (isEmpty(settings.icon)) {
      return null;
    }
    size = new google.maps.Size(settings.icon.width, settings.icon.height);
    return new google.maps.MarkerImage(settings.icon.image, null, null, null, size);
  };

  isEmpty = function(object) {
    return Object.keys(object).length === 0;
  };

  Bermuda.prototype.onChange = function(callback) {
    return this.changeCallback = callback;
  };

  Bermuda.prototype.draw = function(coords) {
    var map;
    map = new google.maps.Map(this.elem, this.settings.map);
    return this.initPolygon(map, this.initMarkers(map, coords));
  };

  Bermuda.prototype.initMarkers = function(map, coords) {
    var marker, markers, _i, _len;
    markers = this.createMarkers(map, coords);
    autoCenter(map, markerLatLangs(markers));
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      listen(marker, "dragend", (function(_this) {
        return function() {
          return _this.changeCallback(markerCoordinates(markers));
        };
      })(this));
    }
    return markers;
  };

  Bermuda.prototype.createMarkers = function(map, coords) {
    var point, points, _i, _len, _results;
    points = toLatLangs(coords);
    _results = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      _results.push(this.createMarker(map, point));
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

  Bermuda.prototype.createMarker = function(map, point) {
    return new google.maps.Marker(merge(this.settings.marker, {
      position: point,
      map: map,
      draggable: true,
      icon: this.icon
    }));
  };

  merge = function() {
    var dest, key, obj, objs, value, _i, _len;
    objs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    dest = {};
    for (_i = 0, _len = objs.length; _i < _len; _i++) {
      obj = objs[_i];
      for (key in obj) {
        value = obj[key];
        dest[key] = value;
      }
    }
    return dest;
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
    polygon = this.createPolygon(map, markers);
    _results = [];
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      _results.push(listen(marker, "drag", (function(_this) {
        return function() {
          var prevPolygon;
          prevPolygon = polygon;
          polygon = _this.createPolygon(map, markers);
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

  Bermuda.prototype.createPolygon = function(map, markers) {
    return new google.maps.Polygon(merge(this.settings.polygon, {
      map: map,
      paths: markerLatLangs(markers),
      draggable: false,
      geodesic: true
    }));
  };

  return Bermuda;

})();
