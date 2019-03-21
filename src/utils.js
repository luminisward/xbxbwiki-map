import $ from 'jquery'

function setContainerHeight (element) {
  $(element).height($(element).width() * 0.618)
  $(window).resize(function () {
    $(element).height($(element).width() * 0.618)
  })
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    point.areas.map(area => area.toLowerCase()).includes(map.mapinfo.Name)
  )
}

export { setContainerHeight, onMapSpace }
