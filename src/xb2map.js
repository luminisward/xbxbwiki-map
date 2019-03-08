import L from 'leaflet'
import $ from 'jquery'

import mapinfosBase from './data/mapinfo'
import mapinfosIra from './data/mapinfo_ira'
const mapinfos = { ...mapinfosBase, ...mapinfosIra }

class Xb2map extends L.Map {
  constructor (element, option, imageUrl, mapinfo) {
    const imageBounds = [
      [mapinfo.LowerX, mapinfo.LowerZ],
      [mapinfo.UpperX, mapinfo.UpperZ]
    ]
    const imageBoundsRotate180 = [
      [-imageBounds[1][0], -imageBounds[1][1]],
      [-imageBounds[0][0], -imageBounds[0][1]]
    ]
    const imageBoundsRotate180YX = [
      [imageBoundsRotate180[0][1], imageBoundsRotate180[0][0]],
      [imageBoundsRotate180[1][1], imageBoundsRotate180[1][0]]
    ]

    option = Object.assign({
      zoomSnap: 0.25,
      minZoom: -3,
      maxZoom: 2,
      maxBounds: imageBoundsRotate180YX,
      crs: L.CRS.Simple,
      attributionControl: false
    },
    option
    )
    super(element, option)

    this.Name = mapinfo.Name
    const mapId = mapinfo.Name.split('_')[0]
    this.mapId = mapId === 'dlc3' ? mapinfo.Name.split('_')[1] : mapId
    this.bounds = imageBoundsRotate180YX
    this.XOffest = imageBounds[0][0] + imageBounds[1][0]
    this.addLayer(L.imageOverlay(imageUrl, imageBoundsRotate180YX))
    this.fitBounds(imageBoundsRotate180YX)
    this.xInterval = [mapinfo.LowerX, mapinfo.UpperX]
    this.yInterval = [mapinfo.LowerY, mapinfo.UpperY]
    this.zInterval = [mapinfo.LowerZ, mapinfo.UpperZ]
  }

  addMarker (point, options, tooltipContent = '') {
    const coordinate = xy([point.PosX - this.XOffest, -point.PosZ])

    const marker = L.marker(coordinate, {
      riseOnHover: true,
      ...options
    })

    // 悬停文本
    if (tooltipContent) {
      const tooltip = L.tooltip({
        direction: 'bottom',
        offset: L.point(0, 18)
      }).setContent(tooltipContent)
      marker.bindTooltip(tooltip)
    }

    // 开关截图
    marker.on('click', () => {
      $(`#${point.Name}`).slideToggle()
    })

    this.addLayer(marker)
  }
}

function xy ([x, y]) {
  if (L.Util.isArray(x)) { // When doing xy([x, y]);
    return L.latLng(x[1], x[0])
  }
  return L.latLng(y, x) // When doing xy(x, y);
}

function getXb2mapByName (element, name) {
  if (name in mapinfos) {
    const themapinfo = mapinfos[name]
    themapinfo.Name = name

    const imageUrl = require('./images/' + name + '_map_0.png')

    return new Xb2map(element, {}, imageUrl, themapinfo)
  }
  throw Error('Invalid map.')
}

export {
  Xb2map, getXb2mapByName
}
