import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { tbox as icon } from '../markerIcon'
import { setContainerHeight, onMapSpace } from '../utils'
import gmkBase from '../data/gmk_tbox.json'
import gmkIra from '../data/gmk_tbox_ira.json'

const gmk = [...gmkBase, ...gmkIra]

function draw (element) {
  const gmkIds = $(element).data('gmkId')
    .trim()
    .split(' ')
    .filter(s => s.length > 0)
    .map(s => s.toLowerCase())

  if (gmkIds.length > 0) {
    const inputGmks = gmkIds.map(gmkId => gmk.filter(point => point.Name === gmkId)[0]).filter(point => point !== undefined)
    const mapName = $(element).data('mapName')

    if (inputGmks.length > 0) {
      const areas = Array.from(new Set(inputGmks.map(point => point.areas).flat()))
      const mapId = mapName ? mapName.toLowerCase() : areas[0] // 未指定地图时，使用区域列表里的第一个
      const map = getXb2mapByName(element, mapId)

      onMapSpace(inputGmks, map).forEach(point => {
        map.addMarker(point, { icon }, point.Name)
      })

      // 右下角地名
      map.attributionControl.setPrefix(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)
      map.attributionControl.addAttribution('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')
    } else {
      throw Error('No valid gmk id.')
    }
  }
}

$('.xb2map-tbox').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
