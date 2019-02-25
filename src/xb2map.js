import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { collectionIcon as markerIcon } from './markerIcon'

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
      zoom: 0,
      minZoom: -5,
      maxBounds: imageBoundsRotate180YX,
      crs: L.CRS.Simple
    },
    option
    )
    super(element, option)

    this.bounds = imageBoundsRotate180
    this.XOffest = imageBounds[0][0] + imageBounds[1][0]
    this.addLayer(L.imageOverlay(imageUrl, imageBoundsRotate180YX))
    this.fitBounds(imageBoundsRotate180YX)
    this.xInterval = [mapinfo.LowerX, mapinfo.UpperX]
    this.yInterval = [mapinfo.LowerY, mapinfo.UpperY]
    this.zInterval = [mapinfo.LowerZ, mapinfo.UpperZ]
  }

  addMarker (x, y, icon = markerIcon) {
    this.addLayer(
      L.marker(
        xy([x - this.XOffest, -y]), { riseOnHover: true, icon: markerIcon }
      ).on('click', function (e) { console.log([e.latlng.lng, e.latlng.lat]) })
    )
  }

  addMarkers (markers) {
    markers.forEach(marker => {
      this.addMarker(...marker)
    })
  }
}

function xy ([x, y]) {
  if (L.Util.isArray(x)) { // When doing xy([x, y]);
    return L.latLng(x[1], x[0])
  }
  return L.latLng(y, x) // When doing xy(x, y);
};

function getMapByDebugName (debugName, mapinfos, game = 'base') {
  if (debugName in mapinfos) {
    const themapinfo = mapinfos[debugName]

    let imageUrl
    if (game === 'base') imageUrl = require('./images/base/' + debugName + '_map_0.png')
    else if (game === 'torna') imageUrl = require('./images/torna/' + debugName + '_map_0.png')

    const map = new Xb2map('map', {}, imageUrl, themapinfo)

    return map
  }
  throw Error('Invalid map.')
}

export {
  Xb2map, getMapByDebugName
}
