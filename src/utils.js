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

// ajax

const apiUrl = '/api.php'

const askCache = {}
async function ask (query) {
  if (askCache[query]) return askCache[query]
  const { query: { results } } = await $.ajax({
    url: apiUrl,
    data: {
      action: 'ask',
      query,
      format: 'json'
    }
  })
  askCache[query] = results
  return results
}

async function askGmkFromWiki (query) {
  const results = await ask('[[PosX::+]][[PosY::+]][[PosZ::+]]' + query + '|?PosX|?PosY|?PosZ')
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

const jsonCache = {}
async function queryJson (pagename) {
  if (jsonCache[pagename]) return jsonCache[pagename]

  let result
  try {
    result = await $.ajax({
      url: `/JSON:${pagename}`,
      data: {
        action: 'raw'
      }
    })
  } catch (error) {
    if (error.status === 404) {
      throw Error('404: 找不到名为 ' + pagename + ' 的JSON数据')
    } else if (error.status === 0) {
      throw Error('网络错误，或禁止跨域')
    } else {
      throw error
    }
  }

  const resultJson = JSON.parse(result)
  jsonCache[pagename] = resultJson
  return resultJson
}

export { setContainerHeight, onMapSpace, ask, askGmkFromWiki, queryJson }
