class Bermuda
  
  DEFAULT_SETTINGS =
    autoCenter: true
    marker: {}
    polygon: {}
    icon: {}
    map: {}
    onChange: (coords) ->

  markers: []
  polygon: null
  icon: null
  
  constructor: (@elem, config = {}) ->
    @settings = merge(DEFAULT_SETTINGS, config)
    @initMap()
    @initIcon()

  merge = (objs...) ->
    dest = {}
    for obj in objs
      dest[key] = value for key, value of obj
    dest
    
  initMap: ->
    @map = new google.maps.Map(@elem, @settings.map)

  initIcon: ->
    return if isEmpty(@settings.icon)
    size = new google.maps.Size(@settings.icon.width, @settings.icon.height)
    @icon = new google.maps.MarkerImage(@settings.icon.image, null, null, null, size)

  isEmpty = (object) ->
     Object.keys(object).length is 0
  
  clear: ->
    @removeMarkers()
    removePolygon(@polygon) if @polygon

  removeMarkers: ->
    @disable()
    @markers = []

  disable: ->
    marker.setMap(null) for marker in @markers

  enable: ->
    marker.setMap(@map) for marker in @markers

  draw: (coords) ->
    @clear()
    @initMarkers(coords)
    @initPolygon()
  
  initMarkers: (coords) ->
    @markers.push(@createMarker(latLng)) for latLng in toLatLngs(coords)
    @listen("dragend", => @settings.onChange(@getCoords()))
    @autoCenter() if @settings.autoCenter
  
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
 
  listen: (event, callback) ->
    google.maps.event.addListener(marker, event, callback) for marker in @markers
  
  initPolygon: ->
    @drawPolygon()
    @listen("drag", @redrawPolygon)

  redrawPolygon: =>
    prevPolygon = @polygon
    @drawPolygon()
    removePolygon(prevPolygon)
  
  getPositions: ->
    marker.position for marker in @markers

  getCoords: ->
    [marker.position.lat(), marker.position.lng()] for marker in @markers
      
  removePolygon = (polygon) ->
    polygon.setMap(null)
      
  drawPolygon: ->
    @polygon = new google.maps.Polygon merge @settings.polygon,
      map: @map
      paths: @getPositions()
      draggable: false
      geodesic: true

  zoomIn: ->
    @map.setZoom(@map.zoom + 1)

  zoomOut: ->
    @map.setZoom(@map.zoom - 1)