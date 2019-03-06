import $ from 'jquery'
import './main.scss'
import ClipboardJS from 'clipboard'

import { getXb2mapByName } from './xb2map'
import { collectionIcon, collectionCurrent } from './markerIcon'
import gmkBase from './data/gmk_collection.json'
import gmkIra from './data/gmk_collection_ira.json'

const gmk = [...gmkBase, ...gmkIra]

function draw (element) {
  const mapName = $(element).data('mapName')
  const highlightCollectionType = $(element).data('highlightCollectionType')

  const map = getXb2mapByName(element, mapName)
  map.on('click', e => {
    console.log([e.latlng.lng + map.XOffest, -e.latlng.lat])
  })
  const pointsOnMap = onMapSpace(gmk, map)
  pointsOnMap.forEach(point => {
    const icon = highlight(point, highlightCollectionType) ? collectionCurrent : collectionIcon
    const content = `<pre>${point.Name}
${point.CollectionTable}
${point.areas}
</pre>`
    map.addMarker(point, icon, content)
  })
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    point.areas.map(area => area.toLowerCase()).includes(map.Name)
  )
}

function highlight (gmkPoint, subpage) {
  return gmkPoint.Subpage === subpage || gmkPoint.CollectionTable === subpage ||
  gmkPoint.Name === ''
}

function setContainerHeight (element) {
  $(element).height($(element).width() * 0.618)
  $(window).resize(function () {
    $(element).height($(element).width() * 0.618)
  })
}

// debug
// map.on('click', function (e) {
//   console.log([e.latlng.lng, e.latlng.lat])
// })

$('.xb2map').each((index, element) => {
  setContainerHeight(element)
  draw(element)

  const points = gmk.filter(point =>
    highlight(point, $(element).data('highlightCollectionType'))
  )
  const areas = points.map(point => point.areas).reduce((areas1, areas2) =>
    [...areas1, ...areas2]
  )
  const output = points.map(point =>
    `{{采集点位置|CollectionPointId=${point.Name}}}`
  ).join('\n')
  console.log(output)
  console.log(new Set(areas))
})
new ClipboardJS('.btn')
