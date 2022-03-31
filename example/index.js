import WebMetricsCollection from '../dist/index'

const webMetrics = new WebMetricsCollection({
  tracker: (type, data, allData) => {
    console.log('type: ', type)
    console.log(`${type} data: `, data)
    console.log('allData: ', allData)
  },
})

webMetrics.fmpStart()

webMetrics.markStart('MarkTestStart')
setTimeout(() => {
  webMetrics.markEnd('MarkTestEnd')
  webMetrics.fmpEnd()
}, 2000)
