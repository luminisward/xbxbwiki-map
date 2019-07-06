import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { salvage as icon } from '../markerIcon'
import { setContainerHeight, queryJson } from '../utils'

// import gmk from '../data/gmk_salvage'

async function draw (element) {
  const gmkId = $(element).data('gmkId') ? $(element).data('gmkId').trim() : ''
  const mapName = $(element).data('mapName')

  const gmk = await queryJson('Gmk/salvage')
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
  for (let i = 0; i < $('.xb2map-salvage').length; i++) {
    const element = $('.xb2map-salvage')[i]
    setContainerHeight(element)
    await draw(element)
  }
}
main()
