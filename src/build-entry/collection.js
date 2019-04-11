import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { collectionIcon, collectionCurrent } from '../markerIcon'
import { setContainerHeight, ask, askGmkFromWiki } from '../utils'

async function draw (element) {
  // 判断输入的是采集类型还是道具名
  const highlightCollectionType = $(element).data('highlightCollectionType')
  const highlightCollectionItem = $(element).data('highlightCollectionItem')
  const mode = highlightCollectionType ? 'CollectionType' : (highlightCollectionItem ? 'CollectionItem' : null)

  // 创建L地图对象
  const map = await getXb2mapByName(element, $(element).data('mapName'))
  // 设置右下角显示地名
  map.attributionControl.setPrefix('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')

  const query = `[[Areas::${map.mapinfo.Name}]][[采集点:+||黄金之国采集点:+]]|limit=200`
  const pointsOnMap = await askGmkFromWiki(query)

  switch (mode) {
    case 'CollectionType':
      // 右下角展开全部
      const expandAllButton = $('<a>').text('展开全部').attr('href', '#').addClass('expand-all')
      map.attributionControl.addAttribution(expandAllButton.prop('outerHTML'))
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

      const highlight = (gmkPoint, pageName) => gmkPoint.fulltext.includes(pageName)
      pointsOnMap.forEach(point => {
        const [pointType, gmkId] = point.fulltext.split('#')
        let icon, zIndexOffset

        // marker setting
        if (highlight(point, highlightCollectionType)) {
          icon = collectionCurrent
          zIndexOffset = 100
        } else {
          icon = collectionIcon
          zIndexOffset = 0
        }

        map.addMarker(point, { icon, zIndexOffset }, pointType.split('/')[1])
          .on('click', () => {
            try {
              $(`#${gmkId.replace(/ /g, '_')}`).find(`[title="场景截图:${gmkId.replace(/ /g, '_')}"]`)[0].click()
            } catch (error) {
              window.open(point.fullurl.split('#')[0], '_blank')
              // throw error
            }
          })
          .on('mouseover', displayPopInfo(pointType))
      })
      break

    case 'CollectionItem':
      // 右下角显示地名
      map.attributionControl.addAttribution(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)

      const query = `采集物::${highlightCollectionItem}`
      const highlightTypes = await getCollectionPop(query)
      const highlightTypesArray = Object.values(highlightTypes).map(collectionType => collectionType.fulltext)

      pointsOnMap.forEach(point => {
        const pointType = point.fulltext.split('#')[0]

        // marker setting
        let icon, zIndexOffset
        if (highlightTypesArray.includes(pointType)) {
          icon = collectionCurrent
          zIndexOffset = 100
        } else {
          icon = collectionIcon
          zIndexOffset = 0
        }
        map.addMarker(point, { icon, zIndexOffset }, pointType.split('/')[1])
          .on('click', () => {
            window.open(point.fullurl.split('#')[0], '_blank')
          })
          .on('mouseover', displayPopInfo(pointType, highlightCollectionItem))
      })
      break
  }
}

function displayPopInfo (collectionType, highlightCollectionItem) {
  return async function () {
    const result = await getCollectionPop(collectionType)

    const red = text => `<span style="color:red;">${text}</span>`
    const printouts = result[collectionType]['printouts']
    const itemPopData = []
    for (let i = 1; i <= 4; i++) {
      if (printouts['采集道具' + i][0]) {
        let row = [
          printouts['采集道具' + i][0].fulltext.split(':')[1],
          printouts['采集概率' + i][0] + '%'
        ]
        if (highlightCollectionItem && printouts['采集道具' + i][0].fulltext === highlightCollectionItem) {
          row = [ red(row[0]), red(row[1]) ]
        }
        itemPopData.push(row)
      }
    }
    const itemPop = '<table class="item-pop">' + itemPopData.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('') + '</table>'
    this.setTooltipContent([ collectionType.split('/')[1], '数量: ' + printouts['单次采集数量'][0], itemPop ].join('<hr>'))
  }
}

async function getCollectionPop (pointType) {
  const query = `[[采集点:+||黄金之国采集点:+]][[${pointType}]]|?单次采集数量|?采集道具1|?采集道具2|?采集道具3|?采集道具4|?采集概率1|?采集概率2|?采集概率3|?采集概率4`
  const result = await ask(query)
  return result
}

async function main () {
  // multi-map, append div.xb2map
  for (const element of $('.multi-xb2map-collection')) {
    const highlightCollectionItem = $(element).data('highlightCollectionItem')
    const query = `[[采集点:+||黄金之国采集点:+]][[采集物::${highlightCollectionItem}]]|?Areas`
    const response = await ask(query)
    const mapSet = new Set(Object.values(response).map(collectionType => collectionType.printouts.Areas).flat())

    mapSet.forEach(mapName => {
      const mapElement = $('<div>')
        .addClass('xb2map-collection')
        .data('mapName', mapName)
        .data('highlightCollectionItem', highlightCollectionItem)
      $(element).append(mapElement)
    })
  }

  // load xb2map
  for (const element of $('.xb2map-collection')) {
    setContainerHeight(element)
    await draw(element)
  }
}
main()
