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

async function ask (query) {
  const { query: { results } } = await $.ajax({
    url: `/api.php`,
    data: {
      action: 'ask',
      query,
      format: 'json'
    }
  })
  return results
}

async function askGmkFromWiki (query) {
  const results = await ask(query + '|?PosX|?PosY|?PosZ')
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

export { setContainerHeight, onMapSpace, ask, askGmkFromWiki }
