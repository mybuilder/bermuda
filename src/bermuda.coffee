class Bermuda
  
  DEFAULT_SETTINGS =
    autoCenter: true
    marker: {}
    polygon: {}
    icon: {}
    map: {}
    onChange: (coords) ->

  markers: []
  
  constructor: (@elem, config = {}) ->
    @settings = merge(DEFAULT_SETTINGS, config)
    @map = @initMap()
    @icon = @initIcon()

  merge = (objs...) ->
    dest = {}
    for obj in objs
      dest[key] = value for key, value of obj
    dest
    
  initMap: ->
    new google.maps.Map(@elem, @settings.map)

  initIcon: ->
    return if isEmpty(@settings.icon)
    size = new google.maps.Size(@settings.icon.width, @settings.icon.height)
    new google.maps.MarkerImage(@settings.icon.image, null, null, null, size)

  isEmpty = (object) ->
     Object.keys(object).length is 0
  
  disable: ->
    marker.setMap(null) for marker in @markers

  enable: ->
    marker.setMap(@map) for marker in @markers

  draw: (coords) ->
    @addMarkers(coords)
    @autoCenter() if @settings.autoCenter
    @initPolygon()
  
  addMarkers: (coords) ->
    for latLng in toLatLngs(coords)
      marker = @createMarker(latLng)
      listen marker, "dragend", =>
        @settings.onChange(@getCoords())
      @markers.push(marker)
  
  toLatLngs = (coords) ->
    new google.maps.LatLng(coord[0], coord[1]) for coord in coords
  
  createMarker: (latLng) ->
    new google.maps.Marker merge @settings.marker,
      position: latLng
      map: @map
      draggable: true
      icon: @icon
  
  autoCenter: ->
    bounds = new google.maps.LatLngBounds()
    bounds.extend(position) for position in @getPositions()
    @map.fitBounds(bounds)
 
  listen = (elem, event, callback) ->
    google.maps.event.addListener(elem, event, callback)
  
  initPolygon: ->
    polygon = @createPolygon()
    for marker in @markers
      listen marker, "drag", =>
        prevPolygon = polygon
        polygon = @createPolygon()
        removePolygon(prevPolygon)
  
  getPositions: ->
    marker.position for marker in @markers

  getCoords: ->
    [marker.position.lat(), marker.position.lng()] for marker in @markers
      
  removePolygon = (polygon) ->
    polygon.setMap(null)
      
  createPolygon: ->
    new google.maps.Polygon merge @settings.polygon,
      map: @map
      paths: @getPositions()
      draggable: false
      geodesic: true

  zoomIn: ->
    @map.setZoom(@map.zoom + 1)

  zoomOut: ->
    @map.setZoom(@map.zoom - 1)