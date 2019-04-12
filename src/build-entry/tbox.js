import $ from 'jquery'
import '../main.scss'

import { getXb2mapByName } from '../xb2map'
import { tbox as icon } from '../markerIcon'
import { setContainerHeight, askGmkFromWiki } from '../utils'

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
    const inputGmks = gmkIds.map(gmkId => askGmkFromWiki(`[[TboxGmkName::${gmkId}]][[宝箱:+||黄金之国宝箱:+]]|?areas|?FieldSkill|?TboxPopDisplay|?Gold|limit=100`))
    let points = await Promise.all(inputGmks)
    points = points.flat().filter(point => point !== undefined)

    if (points.length > 0) {
      // 未指定地图时，使用指定宝箱地图列表里的第一个
      const areas = Array.from(new Set(points.map(point => point.printouts.Areas).flat()))
      const mapId = mapName || areas[0]
      map = await getXb2mapByName(element, mapId)
      points.forEach(point => {
        map.addMarker(point, { icon })
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
      const popItem = point.printouts.TboxPopDisplay.join('<br>')
      const popGold = point.printouts.Gold[0] ? point.printouts.Gold[0] + ' G' : ''
      const fieldSkill = point.printouts.FieldSkill.join('<br>')
      const tooltipContent = [point.fulltext, fieldSkill, popGold, popItem].filter(Boolean).join('<hr>')

      map.addMarker(
        point, { icon }, tooltipContent
      ).on('click', () => {
        window.open(point.fullurl, '_blank')
      })
    })
  }

  // 右下角显示地名
  map.attributionControl.setPrefix('<a href="//xenoblade2.cn">XENOBLADE2.CN</a>')
  map.attributionControl.addAttribution(map.mapinfo.mapName + '・' + map.mapinfo.menuGroup)
}

async function main () {
  for (const element of $('.xb2map-tbox')) {
    setContainerHeight(element)
    await draw(element)
  }
}
main()
