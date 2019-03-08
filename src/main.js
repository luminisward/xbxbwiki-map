import $ from 'jquery'
import './main.scss'

import { getXb2mapByName } from './xb2map'
import { collectionIcon, collectionCurrent } from './markerIcon'
import gmkBase from './data/gmk_collection.json'
import gmkIra from './data/gmk_collection_ira.json'

const gmk = [...gmkBase, ...gmkIra]

function draw (element) {
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
    map.addMarker(point, { icon, zIndexOffset })
  })
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    point.areas.map(area => area.toLowerCase()).includes(map.Name)
  )
}

function highlight (gmkPoint, subpage) {
  return gmkPoint.Subpage === subpage
}

function setContainerHeight (element) {
  $(element).height($(element).width() * 0.618)
  $(window).resize(function () {
    $(element).height($(element).width() * 0.618)
  })
}

$('.xb2map').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
