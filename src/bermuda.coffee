class Bermuda
  
  settings:
    markerTitle: 'Drag me!'
    strokeColor: '#FF0000'
    strokeOpacity: 0.8
    strokeWeight: 2
    fillColor: '#FF0000'
    fillOpacity: 0.35
    onChange: (coords) ->
  
  constructor: (@elem, config = {}) ->
    @settings[key] = value for key, value of config

  onChange: (callback) ->
    settings.onChange = callback
  
  draw: (coords) ->
    map = createMap(@elem, @settings)
    @initPolygon(map, @initMarkers(map, coords))

  createMap = (elem, settings) ->
    new google.maps.Map(elem, settings)
    
  initMarkers: (map, coords) ->
    markers = createMarkers(map, @settings, coords)
    autoCenter(map, markerLatLangs(markers))
    for marker in markers    
      listen marker, "dragend", =>
        @settings.onChange(markerCoordinates(markers))
    markers
  
  createMarkers = (map, settings, coords) ->
    points = toLatLangs(coords)
    createMarker(map, point, settings) for point in points
  
  toLatLangs = (coords) ->
    toLatLang (coord) for coord in coords
      
  toLatLang = (coord) ->
    new google.maps.LatLng(coord[0], coord[1])
  
  createMarker = (map, point, settings) ->
    new google.maps.Marker
      position: point
      map: map
      draggable: true
      title: settings.markerTitle
  
  autoCenter = (map, markers) ->
    bounds = new google.maps.LatLngBounds()
    bounds.extend(position) for position in markers
    map.fitBounds(bounds)
 
  listen = (elem, event, callback) ->
    google.maps.event.addListener(elem, event, callback)
  
  initPolygon: (map, markers) ->
    polygon = createPolygon(map, @settings, markers)
    for marker in markers
      listen marker, "drag", =>
        prevPolygon = polygon
        polygon = createPolygon(map, @settings, markers)
        removePolygon(prevPolygon)
  
  markerLatLangs = (markers) ->
    marker.position for marker in markers

  markerCoordinates = (markers) ->
    [marker.position.lat(), marker.position.lng()] for marker in markers
      
  removePolygon = (polygon) ->
    polygon.setMap(null)
      
  createPolygon = (map, settings, markers) ->
    new google.maps.Polygon
      map: map
      paths: markerLatLangs(markers)
      strokeColor: settings.strokeColor
      strokeOpacity: settings.strokeOpacity
      strokeWeight: settings.strokeWeight
      fillColor: settings.fillColor
      fillOpacity: settings.fillOpacity
      draggable: false,
      geodesic: true