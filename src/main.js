'use strict'
import $ from 'jquery'
import './main.scss'

import { getXb2mapByName } from './xb2map'
import { collectionIcon, collectionCurrent } from './markerIcon'
import gmkBase from './data/gmk_collection.json'
import gmkIra from './data/gmk_ira.json'

const gmk = [...gmkBase, ...gmkIra]

function draw (element) {
  const mapName = $(element).data('mapName')
  const highlightCollectionType = $(element).data('highlightCollectionType')

  const map = getXb2mapByName(element, mapName)
  const pointsOnMap = onMapSpace(gmk, map)
  pointsOnMap.forEach(point => {
    const icon = highlight(point, highlightCollectionType) ? collectionCurrent : collectionIcon
    const content = `<pre>${point.Name}
${point.Subpage}
${point.areas}
</pre>`
    map.addMarker(point, icon, content)
  })
}

function between (number, interval) {
  if (number >= interval[0] && number <= interval[1]) return true
  return false
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    // point.areas.map(area => area.toLowerCase()).includes(map.Name) &&
    point.Name.split('_')[1] === map.mapId &&
    between(point.PosX, map.xInterval) &&
    between(point.PosY, map.yInterval) &&
    between(point.PosZ, map.zInterval)
  )
}

function highlight (gmkPoint, subpage) {
  return gmkPoint.Subpage === subpage
}

function setContainerHeight (element) {
  $(element).height($(element).width() * 0.618)
  $(window).resize(function () {
    $(element).height($(element).width() * 0.618)
  })
}

// debug
// map.on('click', function (e) {
//   console.log([e.latlng.lng, e.latlng.lat])
// })

$('.xb2map').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
