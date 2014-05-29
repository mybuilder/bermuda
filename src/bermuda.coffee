class Bermuda
  
  DEFAULT_SETTINGS =
    marker: {}
    polygon: {}
    icon: {}
    map: {}

  changeCallback: (coords) ->
  
  constructor: (@elem, config = {}) ->
    @settings = combine(DEFAULT_SETTINGS, config)
    @icon = createIcon(@settings)

  combine = (defaults, config) ->
    for name, item of config
      defaults[name][key] = value for key, value of item
    defaults
    
  createIcon = (settings) ->
    return null if isEmpty(settings.icon)
    size = new google.maps.Size(settings.icon.width, settings.icon.height)
    new google.maps.MarkerImage(settings.icon.image, null, null, null, size)

  isEmpty = (object) ->
     Object.keys(object).length is 0

  onChange: (callback) ->
    @changeCallback = callback
  
  draw: (coords) ->
    map = new google.maps.Map(@elem, @settings.map)
    @initPolygon(map, @initMarkers(map, coords))
    
  initMarkers: (map, coords) ->
    markers = @createMarkers(map, coords)
    autoCenter(map, markerLatLangs(markers))
    for marker in markers    
      listen marker, "dragend", =>
        @changeCallback(markerCoordinates(markers))
    markers
  
  createMarkers: (map, coords) ->
    points = toLatLangs(coords)
    @createMarker(map, point) for point in points
  
  toLatLangs = (coords) ->
    toLatLang (coord) for coord in coords
      
  toLatLang = (coord) ->
    new google.maps.LatLng(coord[0], coord[1])
  
  createMarker: (map, point) ->
    new google.maps.Marker merge @settings.marker,
      position: point
      map: map
      draggable: true
      icon: @icon

  merge = (objs...) ->
    dest = {}
    for obj in objs
      dest[key] = value for key, value of obj
    dest
  
  autoCenter = (map, markers) ->
    bounds = new google.maps.LatLngBounds()
    bounds.extend(position) for position in markers
    map.fitBounds(bounds)
 
  listen = (elem, event, callback) ->
    google.maps.event.addListener(elem, event, callback)
  
  initPolygon: (map, markers) ->
    polygon = @createPolygon(map, markers)
    for marker in markers
      listen marker, "drag", =>
        prevPolygon = polygon
        polygon = @createPolygon(map, markers)
        removePolygon(prevPolygon)
  
  markerLatLangs = (markers) ->
    marker.position for marker in markers

  markerCoordinates = (markers) ->
    [marker.position.lat(), marker.position.lng()] for marker in markers
      
  removePolygon = (polygon) ->
    polygon.setMap(null)
      
  createPolygon: (map, markers) ->
    new google.maps.Polygon merge @settings.polygon,
      map: map
      paths: markerLatLangs(markers)
      draggable: false
      geodesic: true