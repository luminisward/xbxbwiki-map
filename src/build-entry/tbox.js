import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { player as icon } from '../markerIcon'
import { setContainerHeight, onMapSpace } from '../utils'
import gmkBase from '../data/gmk_tbox.json'
import gmkIra from '../data/gmk_tbox_ira.json'

const gmk = [...gmkBase, ...gmkIra]

function draw (element) {
  const mapName = $(element).data('mapName').toLowerCase()

  const map = getXb2mapByName(element, mapName)
  const pointsOnMap = onMapSpace(gmk, map)

  map.attributionControl.setPrefix() // remove attribution

  pointsOnMap.forEach(point => {
    map.addMarker(point, { icon }, point.Name)
  })
}

$('.xb2map-tbox').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
