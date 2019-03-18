import L from 'leaflet'

import collectionIconUrl from './icons/collection-marker-icon.png'
import collectionCurrentUrl from './icons/collection-marker-current.png'
import playerIcon from './icons/player.png'

const collectionIcon = L.icon({
  iconUrl: collectionIconUrl,
  iconSize: [22, 32]
})
const collectionCurrent = L.icon({
  iconUrl: collectionCurrentUrl,
  iconSize: [22, 32]
})
const player = L.icon({
  iconUrl: playerIcon,
  iconSize: [22, 31]
})

export { collectionIcon, collectionCurrent, player }
