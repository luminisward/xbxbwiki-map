import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'

class Xb2map extends L.Map {
  constructor (element, option, imageUrl, imageBounds) {
    imageBounds = [
      [imageBounds[1][1], imageBounds[0][0]],
      [imageBounds[0][1], imageBounds[1][0]]
    ]
    option = Object.assign({
      zoomSnap: 0.25,
      zoom: 0,
      // maxBounds: imageBounds,
      crs: L.CRS.Simple
    },
    option
    )

    super(element, option)

    this.heightOffest = Math.abs(imageBounds[0][0] - imageBounds[1][0]) * 2
    this.addLayer(L.imageOverlay(imageUrl, imageBounds))
    this.fitBounds(imageBounds)
  }

  addMarker (x, y) {
    this.addLayer(L.marker(xy([x, y - this.heightOffest])))
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

export {
  Xb2map
}
