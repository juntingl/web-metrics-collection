import { getObserver, hiddenTime, getScore } from '../utils/utils'
import { logMetrics } from '../utils/log'
import ttiPolyfill from 'tti-polyfill'

let tbt = 0

/**
 * 网站性能的数据
 * @returns {PerformanceEntry}
 * https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming
 * https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming
 */
export const getNavigationTime = () => {
  const navigation = window.performance.getEntriesByType('navigation')
  if (navigation.length > 0) {
    const timing = navigation[0] as PerformanceNavigationTiming

    if (timing) {
      const {
        // PerformanceTiming
        domainLookupEnd,          // 解析域名结束时的 Unix毫秒时间戳
        domainLookupStart,        // 域名开始解析之时的 Unix毫秒时间戳
        // PerformanceResourceTiming
        transferSize,             // 获取资源大小
        encodedBodySize,          // 从 HTTP 或 cache 中获取的 body 资源大小
        connectEnd,               // 浏览器与服务器建立连接并检索资源时立即返回的毫秒时间戳
        connectStart,             // 返回用户开始与服务器建立连接以检索资源之前的时间戳
        workerStart,              //
        redirectEnd,              // 在接收到最后重定向响应的最后一个字节后，重定向只读属性会立即返回时间戳。
        redirectStart,
        redirectCount,
        responseEnd,
        responseStart,
        fetchStart,
        domContentLoadedEventEnd,
        domContentLoadedEventStart,
        requestStart,
      } = timing

      return {
        redirect: {
          count: redirectCount,
          time: redirectEnd - redirectStart,
        },
        appCache: domainLookupStart - fetchStart,
        // dns lookup time
        dnsTime: domainLookupEnd - domainLookupStart,
        // handshake end - handshake start time
        TCP: connectEnd - connectStart,
        // HTTP head size
        headSize: transferSize - encodedBodySize || 0,
        responseTime: responseEnd - responseStart,
        // Time to First Byte
        TTFB: responseStart - requestStart,
        // fetch resource time
        fetchTime: responseEnd - fetchStart,
        // Service work response time
        workerTime: workerStart > 0 ? responseEnd - workerStart : 0,
        domReady: domContentLoadedEventEnd - fetchStart,
        // DOMContentLoaded time
        DCL: domContentLoadedEventEnd - domContentLoadedEventStart,
      }
    }
  }
  return {}
}

/**
 * 网络信息
 * @returns
 */
export const getNetworkInfo = () => {
  if ('connection' in window.navigator) {
    const connection = window.navigator['connection']
    // 浏览器不同包含的属性也不同
    // @ts-ignore
    const { effectiveType, downlink, rtt, saveData } = connection

    return {
      effectiveType,
      downlink,
      // round-trip time
      rtt,
      saveData,
    }
  }
  return {}
}

/**
 * 绘制时间
 */
export const getPaintTime = () => {
  getObserver('paint', (entries) => {
    entries.forEach((entry) => {
      const time = entry.startTime
      const name = entry.name
      if (name === 'first-contentful-paint') {
        getLongTask(time)
        logMetrics('FCP', {
          time,
          score: getScore('fcp', time),
        })
      } else {
        logMetrics('FP', {
          time,
        })
      }
    })
  })
}

/**
 * 首次输入时间
 */
export const getFID = () => {
  getObserver('first-input', (entries) => {
    entries.forEach((entry) => {
      if (entry.startTime < hiddenTime) {
        const time = entry.processingStart - entry.startTime
        logMetrics('FID', {
          time,
          score: getScore('fid', time),
        })
        logMetrics('TBT', {
          time: tbt,
          score: getScore('tbt', tbt),
        })
      }
    })
  })
}

/**
 * 最大内容绘制时间
 */
export const getLCP = () => {
  getObserver('largest-contentful-paint', (entries) => {
    entries.forEach((entry) => {
      if (entry.startTime < hiddenTime) {
        const { startTime, renderTime, size } = entry
        logMetrics('LCP Update', {
          time: renderTime | startTime,
          size,
          score: getScore('lcp', renderTime | startTime),
        })
      }
    })
  })
}

/**
 * 累积布局偏移
 */
export const getCLS = () => {
  getObserver('layout-shift', (entries) => {
    let value = 0
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        value += entry.value
      }
    })
    logMetrics('CLS Update', {
      value,
      score: getScore('cls', value),
    })
  })
}

/**
 * 最长任务时间
 * @param fcp
 */
export const getLongTask = (fcp: number) => {
  window.__tti = { e: [] }
  getObserver('longtask', (entries) => {
    window.__tti.e = window.__tti.e.concat(entries)
    entries.forEach((entry) => {
      if (entry.name !== 'self' || entry.startTime < fcp) {
        return
      }
      const blockingTime = entry.duration - 50
      if (blockingTime > 0) tbt += blockingTime
    })
  })
}

/**
 * 可交互时间
 */
export const getTTI = () => {
  ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
    logMetrics('TTI', {
      value: tti,
    })
  })
}
