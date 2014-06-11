var Bermuda,
  __slice = [].slice;

Bermuda = (function() {
  var DEFAULT_SETTINGS, isEmpty, listen, merge, removePolygon, toLatLngs;

  DEFAULT_SETTINGS = {
    autoCenter: true,
    marker: {},
    polygon: {},
    icon: {},
    map: {},
    onChange: function(coords) {}
  };

  Bermuda.prototype.markers = [];

  function Bermuda(elem, config) {
    this.elem = elem;
    if (config == null) {
      config = {};
    }
    this.settings = merge(DEFAULT_SETTINGS, config);
    this.map = this.initMap();
    this.icon = this.initIcon();
  }

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

  Bermuda.prototype.initMap = function() {
    return new google.maps.Map(this.elem, this.settings.map);
  };

  Bermuda.prototype.initIcon = function() {
    var size;
    if (isEmpty(this.settings.icon)) {
      return;
    }
    size = new google.maps.Size(this.settings.icon.width, this.settings.icon.height);
    return new google.maps.MarkerImage(this.settings.icon.image, null, null, null, size);
  };

  isEmpty = function(object) {
    return Object.keys(object).length === 0;
  };

  Bermuda.prototype.disable = function() {
    var marker, _i, _len, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push(marker.setMap(null));
    }
    return _results;
  };

  Bermuda.prototype.enable = function() {
    var marker, _i, _len, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push(marker.setMap(this.map));
    }
    return _results;
  };

  Bermuda.prototype.draw = function(coords) {
    this.addMarkers(coords);
    if (this.settings.autoCenter) {
      this.autoCenter();
    }
    return this.initPolygon();
  };

  Bermuda.prototype.addMarkers = function(coords) {
    var latLng, marker, _i, _len, _ref, _results;
    _ref = toLatLngs(coords);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      latLng = _ref[_i];
      marker = this.createMarker(latLng);
      listen(marker, "dragend", (function(_this) {
        return function() {
          return _this.settings.onChange(_this.getCoords());
        };
      })(this));
      _results.push(this.markers.push(marker));
    }
    return _results;
  };

  toLatLngs = function(coords) {
    var coord, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = coords.length; _i < _len; _i++) {
      coord = coords[_i];
      _results.push(new google.maps.LatLng(coord[0], coord[1]));
    }
    return _results;
  };

  Bermuda.prototype.createMarker = function(latLng) {
    return new google.maps.Marker(merge(this.settings.marker, {
      position: latLng,
      map: this.map,
      draggable: true,
      icon: this.icon
    }));
  };

  Bermuda.prototype.autoCenter = function() {
    var bounds, position, _i, _len, _ref;
    bounds = new google.maps.LatLngBounds();
    _ref = this.getPositions();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      position = _ref[_i];
      bounds.extend(position);
    }
    return this.map.fitBounds(bounds);
  };

  listen = function(elem, event, callback) {
    return google.maps.event.addListener(elem, event, callback);
  };

  Bermuda.prototype.initPolygon = function() {
    var marker, polygon, _i, _len, _ref, _results;
    polygon = this.createPolygon();
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push(listen(marker, "drag", (function(_this) {
        return function() {
          var prevPolygon;
          prevPolygon = polygon;
          polygon = _this.createPolygon();
          return removePolygon(prevPolygon);
        };
      })(this)));
    }
    return _results;
  };

  Bermuda.prototype.getPositions = function() {
    var marker, _i, _len, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push(marker.position);
    }
    return _results;
  };

  Bermuda.prototype.getCoords = function() {
    var marker, _i, _len, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push([marker.position.lat(), marker.position.lng()]);
    }
    return _results;
  };

  removePolygon = function(polygon) {
    return polygon.setMap(null);
  };

  Bermuda.prototype.createPolygon = function() {
    return new google.maps.Polygon(merge(this.settings.polygon, {
      map: this.map,
      paths: this.getPositions(),
      draggable: false,
      geodesic: true
    }));
  };

  Bermuda.prototype.zoomIn = function() {
    return this.map.setZoom(this.map.zoom + 1);
  };

  Bermuda.prototype.zoomOut = function() {
    return this.map.setZoom(this.map.zoom - 1);
  };

  return Bermuda;

})();
