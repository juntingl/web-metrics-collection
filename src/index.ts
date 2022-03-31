import { isSupportPerformance } from './utils/utils'
import { log, logMetrics } from './utils/log'
import {
  getNavigationTime,
  getNetworkInfo,
  getPaintTime,
  getFID,
  getLCP,
  getCLS,
  getTTI,
} from './core/metrics'
import { hiddenTime } from './utils/utils'
import { ICallbackProps, IWebMetricsCollection } from './types'
import { config } from './config'

export default class WebMetricsCollection implements IWebMetricsCollection {
  constructor(args: ICallbackProps) {
    config.tracker = args.tracker
    if (typeof args.log === 'boolean') config.log = args.log
    if (!isSupportPerformance) {
      log(`This browser doesn't support Performance API.`)
      return
    }
    logMetrics('Navigation Time', getNavigationTime())
    logMetrics('Network Info', getNetworkInfo())

    getPaintTime()
    getFID()
    getLCP()
    getCLS()
    getTTI()

    // 监听选项卡切换
    document.addEventListener(
      'visibilitychange',
      (event) => {
        // @ts-ignore
        hiddenTime = Math.min(hiddenTime, event.timeStamp)
      },
      { once: true }
    )
  }
  markStart(name: string) {
    performance.mark(name)
  }
  markEnd(startName: string, endName: string) {
    performance.mark(endName)
    const measureName = `WebMetricsCollection-${startName}`
    performance.measure(measureName, startName, endName)
    const measures = performance.getEntriesByName(measureName)
    measures.forEach((measure) => logMetrics(measureName, measure, true))
  }
  clearMarks(name?: string) {
    performance.clearMarks(name)
  }
  clearMeasures(name?: string) {
    performance.clearMeasures(`WebMetricsCollection-${name}`)
  }
  fmpStart() {
    this.markStart('fmp-start')
  }
  fmpEnd() {
    performance.mark('fmp-end')
    performance.measure('fmp', 'fmp-start', 'fmp-end')
    const measures = performance.getEntriesByName('fmp')
    measures.forEach((measure) =>
      logMetrics('fmp', {
        time: measure.duration,
      })
    )
  }
}
