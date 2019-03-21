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
  const mapName = $(element).data('mapName')

  let map
  if (gmkIds.length > 0) {
    // 指定宝箱列表
    const inputGmks = gmkIds
      .map(gmkId => gmk.filter(point => point.Name === gmkId)[0])
      .filter(point => point !== undefined)

    if (inputGmks.length > 0) {
      // 未指定地图时，使用指定宝箱地图列表里的第一个
      const areas = Array.from(new Set(inputGmks.map(point => point.areas).flat()))
      const mapId = mapName ? mapName.toLowerCase() : areas[0]
      map = getXb2mapByName(element, mapId)

      onMapSpace(inputGmks, map).forEach(point => {
        map.addMarker(point, { icon }, point.Name)
      })
    } else {
      throw Error('No valid gmk id.')
    }
  } else {
    // 未指定宝箱列表，展示指定地图上所有宝箱
    const mapId = mapName.toLowerCase()
    map = getXb2mapByName(element, mapId)
    onMapSpace(gmk, map).forEach(point => {
      map.addMarker(point, { icon }, point.Name)
    })
  }

  // 右下角显示地名
  map.attributionControl.setPrefix(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)
  map.attributionControl.addAttribution('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')
}

$('.xb2map-tbox').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
