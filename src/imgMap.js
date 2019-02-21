import { Xb2map } from './xb2map'

import imageUrl from './images/ma21a_a_floor_02_map_0.png'

const imageBounds = [
  [-150, -1050],
  [302, -350]
]

const map = new Xb2map('map', {}, imageUrl, imageBounds)

map.addMarkers([
  [-31.19032, 498.4538],
  [-81.37274, 595.0247],
  [-111.1726, 733.8743],
  [188.966, 907.981],
  [21.61831, 905.9102],
  [-33.78973, 854.564],
  [231.9399, 798.4176],
  [79.69092, 523.4773],
  [130.0751, 522.4558]
])

// debug
console.log(map)
map.on('click', function (e) {
  console.log([e.latlng.lng, e.latlng.lat])
})
