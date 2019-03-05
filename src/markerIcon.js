import L from 'leaflet'

import collectionIconUrl from './collection-marker-icon.png'
import collectionCurrentUrl from './collection-marker-current.png'

const collectionIcon = L.icon({
  iconUrl: collectionIconUrl,
  iconSize: [22, 32]
})
const collectionCurrent = L.icon({
  iconUrl: collectionCurrentUrl,
  iconSize: [22, 32]
})

export { collectionIcon, collectionCurrent }
