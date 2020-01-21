import L from 'leaflet'

import collectionIconUrl from './icons/collection-marker-icon.png'
import collectionCurrentUrl from './icons/collection-marker-current.png'
import enemyIcon from './icons/enemy.png'
import playerIcon from './icons/player.png'
import tboxIcon from './icons/tbox.png'
import salvageIcon from './icons/salvage.png'
import npcIcon from './icons/npc.svg'

console.log(npcIcon)

export const collectionIcon = L.icon({
  iconUrl: collectionIconUrl,
  iconSize: [22, 32]
})
export const collectionCurrent = L.icon({
  iconUrl: collectionCurrentUrl,
  iconSize: [22, 32]
})
export const enemy = L.icon({
  iconUrl: enemyIcon,
  iconSize: [22, 32]
})
export const player = L.icon({
  iconUrl: playerIcon,
  iconSize: [22, 31]
})
export const tbox = L.icon({
  iconUrl: tboxIcon,
  iconSize: [26, 26]
})
export const salvage = L.icon({
  iconUrl: salvageIcon,
  iconSize: [22, 32]
})
export const npc = L.divIcon({
  html: npcIcon,
  iconSize: [12, 12],
  className: null
})
