import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { tbox as icon } from '../markerIcon'
import { setContainerHeight, askGmkFromWiki, batchAskGmk, onMapSpace } from '../utils'

async function draw (element) {
  const gmkIds = $(element).data('gmkId')
    ? $(element).data('gmkId')
      .trim()
      .split(' ')
      .filter(s => s.length > 0)
    : []
  const mapName = $(element).data('mapName')

  let map
  if (gmkIds.length > 0) {
    // 指定宝箱列表
    const points = await batchAskGmk('TboxGmkName', gmkIds, { additionalCondition: '[[宝箱:+||黄金之国宝箱:+]]|?Areas|?FieldSkill|?TboxPopDisplay|?Gold|limit=100' })
    if (points.length > 0) {
      // 未指定地图时，使用指定宝箱地图列表里的第一个
      const areas = Array.from(new Set(points.map(point => point.printouts.Areas).flat()))
      const mapId = mapName || areas[0]
      map = await getXb2mapByName(element, mapId)
      onMapSpace(points, map).forEach(point => {
        map.addMarker(point, { icon }, getTooltipContent(point)
        ).on('click', () => {
          if (point.fullurl !== window.location.origin + window.location.pathname) {
            window.open(point.fullurl, '_blank')
          }
        })
      })
    } else {
      throw Error('No valid gmk id.')
    }
  } else {
    // 未指定宝箱列表，展示指定地图上所有宝箱
    const mapId = mapName
    map = await getXb2mapByName(element, mapId)

    const query = `[[Areas::${map.mapinfo.Name}]][[宝箱:+||黄金之国宝箱:+]]|?FieldSkill|?TboxPopDisplay|?Gold|limit=100`
    const points = await askGmkFromWiki(query)

    points.forEach(point => {
      map.addMarker(
        point, { icon }, getTooltipContent(point)
      ).on('click', () => {
        window.open(point.fullurl, '_blank')
      })
    })
  }

  // 右下角显示地名
  map.attributionControl.setPrefix('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')
  map.attributionControl.addAttribution(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)
}

function getTooltipContent (pointData) {
  const popItem = pointData.printouts.TboxPopDisplay.join('<br>')
  const popGold = pointData.printouts.Gold[0] ? pointData.printouts.Gold[0] + ' G' : ''
  const fieldSkill = pointData.printouts.FieldSkill.join('<br>')
  return [pointData.fulltext, fieldSkill, popGold, popItem].filter(Boolean).join('<hr>')
}

async function main () {
  for (const element of $('.xb2map-tbox')) {
    setContainerHeight(element)
    await draw(element)
  }
}
main()
