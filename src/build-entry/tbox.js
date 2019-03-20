import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { tbox as icon } from '../markerIcon'
import { setContainerHeight } from '../utils'
import gmkBase from '../data/gmk_tbox.json'
import gmkIra from '../data/gmk_tbox_ira.json'

const gmk = [...gmkBase, ...gmkIra]

function draw (element) {
  const gmkId = $(element).data('gmkId').toLowerCase()

  const inputGmk = gmk.filter(point => point.Name === gmkId)
  if (inputGmk.length > 0) {
    const point = inputGmk[0]
    const mapName = point.areas[0]
    const map = getXb2mapByName(element, mapName)
    map.attributionControl.setPrefix(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)
    map.attributionControl.addAttribution('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')
    map.addMarker(point, { icon }, point.Name)
  } else {
    throw Error('No valid gmk id.')
  }
}

$('.xb2map-tbox').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
