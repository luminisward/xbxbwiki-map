import './main.scss'

import { getXb2mapByName } from './xb2map'
import { collectionIcon, collectionCurrent } from './markerIcon'
import gmk from './data/gmk_collection.json'
import collectionPop from './data/collection_pop'

const mapName = 'ma05a_f02'
const map = getXb2mapByName('map', mapName)
const pointsOnMap = onMapSpace(gmk, map)

pointsOnMap.forEach(point => {
  const icon = highlight(point) ? collectionCurrent : collectionIcon
  map.addMarker(point, icon)
})

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

function highlight (gmkPoint) {
  const collectionInfo = collectionPop[gmkPoint.Name]
  return collectionInfo &&
  collectionInfo.Subpage === '植物学1'
}

// debug
// map.on('click', function (e) {
//   console.log([e.latlng.lng, e.latlng.lat])
// })
