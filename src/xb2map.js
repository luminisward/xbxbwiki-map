import L from 'leaflet'
import $ from 'jquery'

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
      minZoom: -1,
      maxZoom: 3,
      // maxBounds: imageBoundsRotate180YX,
      crs: L.CRS.Simple
    },
    option
    )
    super(element, option)

    this.Name = mapinfo.Name
    this.mapId = mapinfo.Name.split('_')[0]
    this.bounds = imageBoundsRotate180
    this.XOffest = imageBounds[0][0] + imageBounds[1][0]
    this.addLayer(L.imageOverlay(imageUrl, imageBoundsRotate180YX))
    this.fitBounds(imageBoundsRotate180YX)
    this.xInterval = [mapinfo.LowerX, mapinfo.UpperX]
    this.yInterval = [mapinfo.LowerY, mapinfo.UpperY]
    this.zInterval = [mapinfo.LowerZ, mapinfo.UpperZ]
  }

  addMarker (point, icon) {
    const [x, y] = [point.PosX, point.PosZ]
    const tooltip = L.tooltip({ direction: 'bottom', offset: L.point(0, 18) })
    let content = `<pre>${point.Name}
${point.Subpage}
${point.areas}
</pre>`
    tooltip.setContent(content)

    const marker = L.marker(
      xy([x - this.XOffest, -y]),
      { riseOnHover: true, icon: icon }
    ).on('click', function (e) {
      // console.log([e.latlng.lng, e.latlng.lat])
      $(`#${point.Name}`).slideToggle()
      console.log(point.Name)
    }).bindTooltip(tooltip).openTooltip()
    this.addLayer(marker)
    // L.DomUtil.addClass(marker._icon, 'mw-customtoggle-' + point.Name)
  }

  addMarkers (markers, icon) {
    markers.forEach(marker => {
      this.addMarker(marker, icon)
    })
  }
}

function xy ([x, y]) {
  if (L.Util.isArray(x)) { // When doing xy([x, y]);
    return L.latLng(x[1], x[0])
  }
  return L.latLng(y, x) // When doing xy(x, y);
};

function getXb2mapByName (element, name, game = 'base') {
  let imageUrl, mapinfos
  if (game === 'base') {
    mapinfos = require('./data/mapinfo')
    imageUrl = require('./images/base/' + name + '_map_0.png')
  } else if (game === 'torna') {
    mapinfos = require('./data/mapinfo_ira')
    imageUrl = require('./images/torna/' + name + '_map_0.png')
  }

  if (name in mapinfos) {
    const themapinfo = mapinfos[name]
    themapinfo.Name = name

    const map = new Xb2map(element, {}, imageUrl, themapinfo)

    return map
  }
  throw Error('Invalid map.')
}

export {
  Xb2map, getXb2mapByName
}
