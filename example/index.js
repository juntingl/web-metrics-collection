import WebMetricsCollection from '../dist/index'

const webMetrics = new WebMetricsCollection({
  tracker: (type, data, allData) => {
    console.group("完整日志"),
    console.log('type: ', type)
    console.log(`${type} data: `, data)
    console.log('allData: ', allData)
    console.groupEnd()
  },
})

webMetrics.fmpStart()

webMetrics.markStart('MarkTest')
setTimeout(() => {
  webMetrics.markEnd('MarkTest')
  webMetrics.fmpEnd()
}, 2000)
