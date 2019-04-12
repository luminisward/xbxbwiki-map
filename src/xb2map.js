import L from 'leaflet'
import { queryJson } from './utils'

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

    option = Object.assign({
      zoomSnap: 0.25,
      minZoom: -3,
      maxZoom: 2,
      crs: L.CRS.Simple,
      // attributionControl: false,
      doubleClickZoom: false
    },
    option
    )

    super(element, option)

    this.mapinfo = mapinfo
    const mapId = mapinfo.Name.split('_')[0]
    this.mapId = mapId === 'dlc3' ? mapinfo.Name.split('_')[1] : mapId
    this.bounds = imageBoundsRotate180
    this.XOffest = imageBounds[0][0] + imageBounds[1][0]

    this.addLayer(L.imageOverlay(imageUrl, xyBounds(this.bounds)))
    this.fitBounds(xyBounds(this.bounds))
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

    this.addLayer(marker)
    return marker
  }
}

function xy ([x, y]) {
  if (L.Util.isArray(x)) { // When doing xy([x, y]);
    return L.latLng(x[1], x[0])
  }
  return L.latLng(y, x) // When doing xy(x, y);
}

function xyBounds (bounds) {
  return [
    [bounds[0][1], bounds[0][0]],
    [bounds[1][1], bounds[1][0]]
  ]
}

async function getXb2mapByName (element, name) {
  name = name.toLowerCase()
  const theMapinfo = await queryJson('Mapinfo/' + name)

  // const imageUrl = require('./map-images/' + theMapinfo.Name + '_map_0.png')
  const imageUrl = `/特殊:重定向/file/${theMapinfo.Name}_map_0.png`

  return new Xb2map(element, {}, imageUrl, theMapinfo)
}

export {
  Xb2map, getXb2mapByName
}
