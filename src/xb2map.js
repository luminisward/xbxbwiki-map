import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'

import mapinfo from './data/mapinfo'
import collectionIconUrl from './collection-icon.png'

class Xb2map extends L.Map {
  constructor (element, option, imageUrl, imageBounds) {
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

    this.collectionIcon = L.icon({
      iconUrl: collectionIconUrl,
      iconSize: [22, 32]
    })
  }

  addMarker (x, y) {
    this.addLayer(
      L.marker(
        xy([x - this.XOffest, -y]), { riseOnHover: true, icon: this.collectionIcon }
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

function getMapByDebugName (debugName) {
  if (debugName in mapinfo) {
    const imageBounds = [
      [mapinfo[debugName].LowerX, mapinfo[debugName].LowerY],
      [mapinfo[debugName].UpperX, mapinfo[debugName].UpperY]
    ]

    const imageUrl = require('./images/' + debugName + '_map_0.png')

    const map = new Xb2map('map', {}, imageUrl, imageBounds)
    map.xInterval = [mapinfo[debugName].LowerX, mapinfo[debugName].UpperX]
    map.yInterval = [mapinfo[debugName].LowerY, mapinfo[debugName].UpperY]
    map.zInterval = [mapinfo[debugName].LowerZ, mapinfo[debugName].UpperZ]

    return map
  }
  throw Error('Invalid map.')
}

export {
  Xb2map, getMapByDebugName
}
