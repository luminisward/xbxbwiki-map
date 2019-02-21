import {
  getMapByDebugName
} from './xb2map'
import collections from './data/collections.json'

const mapName = 'ma05a_f02'
const mapId = mapName.split('_')[0]

const map = getMapByDebugName(mapName)

const collectionsOnMap = collections
  .filter(point =>
    point.Map === mapId &&
    between(point.PosX, map.xInterval) &&
    between(point.PosY, map.yInterval) &&
    between(point.PosZ, map.zInterval)
  )

const coordinates = collectionsOnMap.map(point => [point.PosX, point.PosY])
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
