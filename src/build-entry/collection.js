import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { collectionIcon, collectionCurrent } from '../markerIcon'
import { setContainerHeight, ask, askGmkFromWiki } from '../utils'

async function draw (element) {
  const mapName = $(element).data('mapName')
  const highlightCollectionType = $(element).data('highlightCollectionType')
  const highlightCollectionItem = $(element).data('highlightCollectionItem')

  const map = getXb2mapByName(element, mapName)
  const query = `[[Areas::${map.mapinfo.Name}]][[采集点:+||黄金之国采集点:+]]|limit=200`
  const pointsOnMap = await askGmkFromWiki(query)

  if (highlightCollectionType) {
    const highlight = (gmkPoint, pageName) => gmkPoint.fulltext.includes(pageName)
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
    const dynamicAskData = {}

    const query = `采集物::${highlightCollectionItem}`
    const highlightTypes = await getCollectionPop(query)
    const highlightTypesArray = Object.values(highlightTypes).map(collectionType => collectionType.fulltext)
    Object.assign(dynamicAskData, highlightTypes)

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

      const marker = map.addMarker(point, { icon, zIndexOffset }, pointType.split('/')[1])
      marker.on('click', () => {
        window.open(point.fullurl, '_blank')
      })

      marker.on('mouseover', async function () {
        if (!dynamicAskData[pointType]) {
          const result = await getCollectionPop(pointType)
          Object.assign(dynamicAskData, result)
        }

        const red = text => `<span style="color:red;">${text}</span>`
        const printouts = dynamicAskData[pointType]['printouts']
        const itemPopData = []
        for (let i = 1; i <= 4; i++) {
          let row = [
            printouts['采集道具' + i][0].fulltext.split(':')[1],
            printouts['采集概率' + i][0] + '%'
          ]

          if (printouts['采集道具' + i][0].fulltext === highlightCollectionItem) {
            row = [ red(row[0]), red(row[1]) ]
          }
          itemPopData.push(row)
        }
        const itemPop = `<table>
                          <tr>
                            <td>${itemPopData[0][0]}</td>
                            <td>${itemPopData[0][1]}</td>
                          </tr>
                          <tr>
                            <td>${itemPopData[1][0]}</td>
                            <td>${itemPopData[1][1]}</td>
                          </tr>
                          <tr>
                            <td>${itemPopData[2][0]}</td>
                            <td>${itemPopData[2][1]}</td>
                          </tr>
                          <tr>
                            <td>${itemPopData[3][0]}</td>
                            <td>${itemPopData[3][1]}</td>
                          </tr>
                        </table>`

        this.setTooltipContent([
          pointType.split('/')[1],
          '数量: ' + printouts['单次采集数量'][0],
          itemPop
        ].join('<hr>'))
      })
    })
  }
}

async function getCollectionPop (pointType) {
  const query = `[[采集点:+||黄金之国采集点:+]][[${pointType}]]|?单次采集数量|?采集道具1|?采集道具2|?采集道具3|?采集道具4|?采集概率1|?采集概率2|?采集概率3|?采集概率4`
  const result = await ask(query)
  return result
}

function load () {
  $('.xb2map-collection').each((index, element) => {
    setContainerHeight(element)
    draw(element)
  })
}

async function main () {
  // multi-map
  const xb2maps = $('.multi-xb2map-collection').map(async (i, element) => {
    const highlightCollectionItem = $(element).data('highlightCollectionItem')
    const query = `[[采集物::${highlightCollectionItem}]]|?Areas`
    const response = await ask(query)
    const mapSet = new Set(Object.values(response).map(collectionType => collectionType.printouts.Areas).flat())

    mapSet.forEach(mapName => {
      const mapElement = $('<div>')
        .addClass('xb2map-collection')
        .data('mapName', mapName)
        .data('highlightCollectionItem', highlightCollectionItem)
      $(element).append(mapElement)
    })
  })
  await Promise.all(xb2maps)

  // load xb2map
  load()
}
main()
