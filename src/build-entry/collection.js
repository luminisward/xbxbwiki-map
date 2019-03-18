import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { collectionIcon, collectionCurrent } from '../markerIcon'
import { setContainerHeight, onMapSpace } from '../utils'
import gmkBase from '../data/gmk_tbox.json'
import gmkIra from '../data/gmk_tbox_ira.json'

const gmk = [...gmkBase, ...gmkIra]

export default function draw (element) {
  const mapName = $(element).data('mapName').toLowerCase()
  const highlightCollectionType = $(element).data('highlightCollectionType')

  const map = getXb2mapByName(element, mapName)
  const pointsOnMap = onMapSpace(gmk, map)

  pointsOnMap.forEach(point => {
    let icon, zIndexOffset
    if (highlight(point, highlightCollectionType)) {
      icon = collectionCurrent
      zIndexOffset = 100
    } else {
      icon = collectionIcon
      zIndexOffset = 0
    }
    map.addMarker(point, { icon, zIndexOffset }, point.Name)
  })

  // 右下角展开全部
  const expandAllButton = $('<a>').text('展开全部').attr('href', '#').addClass('expand-all')
  map.attributionControl.setPrefix(expandAllButton.prop('outerHTML'))

  $(element).find('.expand-all').click(function (e) {
    e.preventDefault()
    const selector = pointsOnMap.filter(point => highlight(point, highlightCollectionType)).map(point => '#' + point.Name).join(',')
    if ($(this).data('expanded')) {
      $(selector).slideUp()
      $(this).data('expanded', false)
    } else {
      $(selector).slideDown()
      $(this).data('expanded', true)
    }
  })
}

function highlight (gmkPoint, subpage) {
  return gmkPoint.Subpage === subpage || gmkPoint.Name === subpage
}

$('.xb2map').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})