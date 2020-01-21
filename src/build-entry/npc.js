import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { npc as icon } from '../markerIcon'
import { setContainerHeight, queryJson } from '../utils'

// import gmk from '../data/gmk'

async function draw (element) {
  const gmkId = $(element).data('gmkId') ? $(element).data('gmkId').trim() : ''
  const mapName = $(element).data('mapName')

  const gmk = await queryJson('Gmk/npc')
  const point = gmk.filter(point => point.Name === gmkId)[0]
  console.log(point)

  const mapId = mapName || point.areas[0]
  const map = await getXb2mapByName(element, mapId)
  map.addMarker(point, { icon })

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
