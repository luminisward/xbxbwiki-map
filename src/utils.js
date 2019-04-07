import $ from 'jquery'

function setContainerHeight (element) {
  $(element).height($(element).width() * 0.618)
  $(window).resize(function () {
    $(element).height($(element).width() * 0.618)
  })
}

function onMapSpace (gmkPoints, map) {
  return gmkPoints.filter(point =>
    point.areas.map(area => area.toLowerCase()).includes(map.mapinfo.Name)
  )
}

async function askGmkFromWiki (query) {
  const { query: { results } } = await $.ajax({
    url: `//192.168.66.118/api.php`,
    data: {
      action: 'ask',
      query: query + '|?PosX|?PosY|?PosZ',
      format: 'json'
    }
  })
  const points = Object.values(results).map(pageData => {
    // 兼容addMarker
    Object.assign(pageData, {
      PosX: pageData.printouts.PosX[0],
      PosY: pageData.printouts.PosY[0],
      PosZ: pageData.printouts.PosZ[0]
    })
    return pageData
  })
  return points
}

export { setContainerHeight, onMapSpace, askGmkFromWiki }
