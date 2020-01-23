import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { npc as icon } from '../markerIcon'
import { setContainerHeight, queryJson, onMapSpace } from '../utils'

// import gmk from '../data/gmk'

async function draw (element) {
  const gmkIds = $(element).data('gmkId')
    ? $(element).data('gmkId')
      .trim()
      .split(' ')
      .filter(s => s.length > 0)
    : []
  const mapName = $(element).data('mapName')

  const gmk = await queryJson('Gmk/npc')

  let map
  if (gmkIds.length > 0) { // 使用gmkid定位地图
    const points = gmk.filter(point => gmkIds.includes(point.Name))

    if (points.length === 0) {
      console.error(`找不到GmkId ${gmkIds.join()} 的数据`)
      return
    }

    // 未指定地图时，使用指定宝箱地图列表里的第一个
    const areas = Array.from(new Set(
      points.map(point => point.areas).reduce((a, b) => a.concat(b), [])
    ))
    const mapId = mapName || areas[0]
    map = await getXb2mapByName(element, mapId)
    onMapSpace(points, map).forEach(point => {
      map.addMarker(point, { icon }, point.Name)
    })
  } else { // 显示map上所有
    const mapId = mapName
    map = await getXb2mapByName(element, mapId)

    const points = gmk.filter(point => point.areas.includes(mapId))
    console.log(points)
    points.forEach(point => {
      map.addMarker(point, { icon }, point.Name)
    })
  }

  // 右下角显示地名
  map.attributionControl.setPrefix('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')
  map.attributionControl.addAttribution(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)
}

async function main () {
  const $npcMaps = $('.xb2map-npc')
  for (let i = 0; i < $npcMaps.length; i++) {
    const element = $npcMaps[i]
    setContainerHeight(element)
    await draw(element)
  }
}
main()
