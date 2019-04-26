import echarts from 'echarts'

const dom = document.getElementsByClassName('chart-param')[0]
const myChart = echarts.init(dom)
const option = {
  radar: {
    name: {
      textStyle: {
        color: '#fff',
        backgroundColor: '#999',
        borderRadius: 3,
        padding: [3, 5]
      }
    },
    indicator: [
      { name: 'HP', max: 2, min: -2 },
      { name: '力量', max: 0.9 * 2 },
      { name: '以太力', max: 0.9 * 2 },
      { name: '灵巧', max: 1 * 2 },
      { name: '敏捷', max: 0.75 * 2 },
      { name: '运气', max: 0.75 * 2 }
    ],
    radius: '75%',
    splitNumber: 10,
    scale: true
  },
  series: [{
    type: 'radar',
    data: [
      {
        value: [33 * 1.3, 4, 2.2, 1, 7, 2.5].map(x => Math.log(x))
      }
    ]
  }]
}
if (option && typeof option === 'object') {
  myChart.setOption(option, true)
}
