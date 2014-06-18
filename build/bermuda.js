var Bermuda,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

Bermuda = (function() {
  var DEFAULT_SETTINGS, isEmpty, merge, removePolygon, toLatLngs;

  DEFAULT_SETTINGS = {
    disabled: false,
    autoCentered: true,
    marker: {},
    polygon: {},
    icon: {},
    map: {},
    onChange: function(coords) {}
  };

  Bermuda.prototype.markers = [];

  Bermuda.prototype.polygon = null;

  Bermuda.prototype.icon = null;

  function Bermuda(elem, config) {
    this.elem = elem;
    if (config == null) {
      config = {};
    }
    this.redrawPolygon = __bind(this.redrawPolygon, this);
    this.settings = merge(DEFAULT_SETTINGS, config);
    this.initMap();
    this.initIcon();
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
    return this.map = new google.maps.Map(this.elem, this.settings.map);
  };

  Bermuda.prototype.initIcon = function() {
    var size;
    if (isEmpty(this.settings.icon)) {
      return;
    }
    size = new google.maps.Size(this.settings.icon.width, this.settings.icon.height);
    return this.icon = new google.maps.MarkerImage(this.settings.icon.image, null, null, null, size);
  };

  isEmpty = function(object) {
    var property;
    for (property in object) {
      if (object.hasOwnProperty(property)) {
        return false;
      }
    }
    return true;
  };

  Bermuda.prototype.clear = function() {
    this.removeMarkers();
    if (this.polygon) {
      return removePolygon(this.polygon);
    }
  };

  Bermuda.prototype.removeMarkers = function() {
    this.detachMarkers();
    return this.markers = [];
  };

  Bermuda.prototype.detachMarkers = function() {
    var marker, _i, _len, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push(marker.setMap(null));
    }
    return _results;
  };

  Bermuda.prototype.disable = function() {
    this.detachMarkers();
    return this.settings.disabled = true;
  };

  Bermuda.prototype.enable = function() {
    var marker, _i, _len, _ref;
    _ref = this.markers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      marker.setMap(this.map);
    }
    return this.settings.disabled = false;
  };

  Bermuda.prototype.draw = function(coords) {
    this.clear();
    this.initMarkers(coords);
    return this.initPolygon();
  };

  Bermuda.prototype.initMarkers = function(coords) {
    var latLng, _i, _len, _ref;
    _ref = toLatLngs(coords);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      latLng = _ref[_i];
      this.markers.push(this.createMarker(latLng));
    }
    this.listen("dragend", (function(_this) {
      return function() {
        return _this.settings.onChange(_this.getCoords());
      };
    })(this));
    if (this.settings.autoCentered) {
      return this.autoCenter();
    }
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
    var marker;
    marker = new google.maps.Marker(merge(this.settings.marker, {
      position: latLng,
      draggable: true,
      icon: this.icon
    }));
    if (!this.settings.disabled) {
      marker.setMap(this.map);
    }
    return marker;
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

  Bermuda.prototype.listen = function(event, callback) {
    var marker, _i, _len, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      _results.push(google.maps.event.addListener(marker, event, callback));
    }
    return _results;
  };

  Bermuda.prototype.initPolygon = function() {
    this.drawPolygon();
    return this.listen("drag", this.redrawPolygon);
  };

  Bermuda.prototype.redrawPolygon = function() {
    var prevPolygon;
    prevPolygon = this.polygon;
    this.drawPolygon();
    return removePolygon(prevPolygon);
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

  Bermuda.prototype.drawPolygon = function() {
    return this.polygon = new google.maps.Polygon(merge(this.settings.polygon, {
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
