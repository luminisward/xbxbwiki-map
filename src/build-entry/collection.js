import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { collectionIcon, collectionCurrent } from '../markerIcon'
import { setContainerHeight, ask, askGmkFromWiki } from '../utils'
import gmk from '../data/gmk_collection'

async function draw (element) {
  const mapName = $(element).data('mapName')
  const highlightCollectionType = $(element).data('highlightCollectionType')
  const highlightCollectionItem = $(element).data('highlightCollectionItem')

  const map = getXb2mapByName(element, mapName)
  const query = `[[Areas::${map.mapinfo.Name}]][[采集点:+||黄金之国采集点:+]]|limit=200`
  const pointsOnMap = await askGmkFromWiki(query)

  const collectionTypes = new Set(pointsOnMap.map(point => point.fulltext.split('#')[0]))

  if (highlightCollectionType) {
    pointsOnMap.forEach(point => {
      let icon, zIndexOffset
      if (highlight(point, highlightCollectionType)) {
        icon = collectionCurrent
        zIndexOffset = 100
      } else {
        icon = collectionIcon
        zIndexOffset = 0
      }
      const marker = map.addMarker(point, { icon, zIndexOffset }, point.fulltext)

      // 开关截图
      marker.on('click', () => {
      // $(`#${point.Name}`).slideToggle()
        $(`#${point.Name}`).find(`[title="场景截图:${point.Name}"]`)[0].click()
      })
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
  } else if (highlightCollectionItem) {
    const query = `[[采集点:+||黄金之国采集点:+]][[采集物::${highlightCollectionItem}]]|?单次采集数量|?${highlightCollectionItem}PopRate=概率`
    const highlightTypes = await ask(query)
    const highlightTypesArray = Object.values(highlightTypes).map(collectionType => collectionType.fulltext)

    pointsOnMap.forEach(point => {
      const pointType = point.fulltext.split('#')[0]

      let icon, zIndexOffset
      if (highlightTypesArray.includes(pointType)) {
        icon = collectionCurrent
        zIndexOffset = 100
      } else {
        icon = collectionIcon
        zIndexOffset = 0
      }
      let tooltipContent = ''
      if (highlightTypes[pointType]) {
        tooltipContent = [
          pointType,
          highlightTypes[pointType]['printouts']['单次采集数量'][0],
          highlightTypes[pointType]['printouts']['概率'][0]
        ].join('<hr>')
      }
      map.addMarker(point, { icon, zIndexOffset }, tooltipContent)
    })
  }
}

function highlight (gmkPoint, pageName) {
  return gmkPoint.fulltext.includes(pageName)
}

async function getCollectionPop (pointType) {
  const query = `[[${pointType}]]|?采集道具1|?采集道具2|?采集道具3|?采集道具4|?采集概率1|?采集概率2|?采集概率3|?采集概率4`
  const result = await ask(query)
  console.log(Object.values(result)[0])
  return Object.values(result)[0]
}

$('.xb2map').each((index, element) => {
  setContainerHeight(element)
  draw(element)
})
