import L from 'leaflet'
import 'leaflet.chinatmsproviders'
import imageUrl from './ma21a_a_floor_02_map_0.png'

const map = L.map('map', {
  minZoom: -10,
  zoomSnap: 0.25,
  zoom: 0,
  crs: L.CRS.Simple
})

const imageBounds = [
  [350, -150],
  [1050, 302]
]
L.imageOverlay(imageUrl, imageBounds).addTo(map)

const xy = (x, y) => L.latLng(y, x)

L.marker(xy(-31.19032, 498.4538)).addTo(map)
L.marker(xy(-81.37274, 595.0247)).addTo(map)
L.marker(xy(-111.1726, 733.8743)).addTo(map)
L.marker(xy(188.966, 907.981)).addTo(map)
L.marker(xy(21.61831, 905.9102)).addTo(map)
L.marker(xy(-33.78973, 854.564)).addTo(map)
L.marker(xy(231.9399, 798.4176)).addTo(map)
L.marker(xy(79.69092, 523.4773)).addTo(map)
L.marker(xy(130.0751, 522.4558)).addTo(map)

map.fitBounds(imageBounds)

// debug
console.log(map)
map.on('click', function (e) {
  console.log(e.latlng)
})
