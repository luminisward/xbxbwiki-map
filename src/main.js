import './main.scss'

import { getMapByDebugName } from './xb2map'
import gmk from './data/gmk.json'
import mapinfo from './data/mapinfo'

const mapName = 'ma17a_f01'
const mapId = mapName.split('_')[0]

const map = getMapByDebugName(mapName, mapinfo)

const collectionsOnMap = gmk
  .filter(point =>
    point.Map === mapId &&
    point.GmkType === 'GmkCollection' &&
    between(point.PosX, map.xInterval) &&
    between(point.PosY, map.yInterval) &&
    between(point.PosZ, map.zInterval)
  )

const coordinates = collectionsOnMap.map(point => [point.PosX, point.PosZ])
map.addMarkers(coordinates)

function between (number, interval) {
  if (number >= interval[0] && number <= interval[1]) return true
  return false
}

// debug
console.log(map)
console.log(collectionsOnMap)
map.on('click', function (e) {
  console.log([e.latlng.lng, e.latlng.lat])
})
