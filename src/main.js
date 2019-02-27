import ClipboardJS from 'clipboard'

import './main.scss'

import { getMapByDebugName } from './xb2map'
import { collectionIcon, collectionCurrent } from './markerIcon'
import gmk from './data/gmk.json'
import mapinfo from './data/mapinfo'
import collectionPop from './data/collectionPop'

const mapName = 'ma07a_b_floor_01'
const map = getMapByDebugName(mapName, mapinfo)

let currentPoints = gmk.filter(point =>
  point.GmkType === 'GmkCollection').filter(point => {
  const collectionInfo = collectionPop[point.Name]
  return collectionInfo &&
    // point.Name === 'colle_ma02a_c003'
    collectionInfo.itm1ID === '苔藓绒棉' &&
    collectionInfo.itm1Per === 35 &&
    collectionInfo.randitmPopMin === 3
})

let collectionsOnMap = gmk.filter(point =>
  point.GmkType === 'GmkCollection' &&
  !currentPoints.map(point => point.Name).includes(point.Name)
)

map.addMarkers(onMapSpace(currentPoints, map), collectionCurrent)
map.addMarkers(onMapSpace(collectionsOnMap, map), collectionIcon)

function between (number, interval) {
  if (number >= interval[0] && number <= interval[1]) return true
  return false
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    point.Map === map.mapId &&
    between(point.PosX, map.xInterval) &&
    between(point.PosY, map.yInterval) &&
    between(point.PosZ, map.zInterval)
  )
}

// debug
console.log(map)
// console.log(collectionsOnMap)
map.on('click', function (e) {
  console.log([e.latlng.lng, e.latlng.lat])
})

const areasAvalible = new Set()
currentPoints.forEach(point => {
  point.areas.forEach(area => areasAvalible.add(area))
})
console.log(areasAvalible)
console.log(currentPoints)
new ClipboardJS('.btn')
