import $ from 'jquery'
import './main.scss'

import { getXb2mapByName } from './xb2map'
import { collectionIcon, collectionCurrent } from './markerIcon'
import gmk from './data/gmk_collection.json'
import mapinfos from './data/mapinfo'

function draw (element) {
  const mapName = $(element).data('mapName')
  const highlightCollectionType = $(element).data('highlightCollectionType')

  const map = getXb2mapByName(element, mapName)
  const pointsOnMap = onMapSpace(gmk, map)
  pointsOnMap.forEach(point => {
    const icon = highlight(point, highlightCollectionType) ? collectionCurrent : collectionIcon
    map.addMarker(point, icon)
  })
}

function between (number, interval) {
  if (number >= interval[0] && number <= interval[1]) return true
  return false
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    point.areas.map(area => area.toLowerCase()).includes(map.Name) &&
    between(point.PosX, map.xInterval) &&
    between(point.PosY, map.yInterval) &&
    between(point.PosZ, map.zInterval)
  )
}

function highlight (gmkPoint, subpage) {
  return gmkPoint.Subpage === subpage
}

// debug
// map.on('click', function (e) {
//   console.log([e.latlng.lng, e.latlng.lat])
// })

$('.xb2map').each((index, element) => {
  // const mapName = $(element).data('mapName')
  // const containerHeight = mapinfos[mapName].Height
  // $(element).height(containerHeight / 4)
  draw(element)
})
