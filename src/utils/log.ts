import tracker from '../core/tracker'
import { IWebMetricsCollectionData } from '../types'
import { config } from '../config'

export const log = (message?: any) => {
  if (!config.log) return
  console.log(
    `%cWebMetrics`,
    'background: #35495E; color: white; padding: 1px 10px; border-radius: 3px;',
    message
  )
}

export const logMetrics = (
  type: string,
  data: IWebMetricsCollectionData,
  measure = false
) => {
  !measure && tracker(type, data)
  if (!config.log) return
  console.log(
    `%cWebMetrics%c${type}`,
    'background: #35495E; color: white; padding: 1px 10px; border-top-left-radius: 3px; border-bottom-left-radius: 3px;',
    'background: #2d8cf0; color: white; padding: 1px 10px; border-top-right-radius: 3px;border-bottom-right-radius: 3px;',
    data
  )
}

enum Colors {
  Default = '#35495E',
  Info = '#2db7f5',
  Primary = '#2d8cf0',
  Success = '##19be6b',
  Warning = '#ff9900',
  Error = '#ed4014',
}

type colorType = keyof typeof Colors

const logFunc = (type: string, color: colorType, content: any) => {
  console.log(
    `%WebMetrics%c${type}`,
    `background:${Colors['Info']}; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;`,
    `background: ${Colors[color]}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;background:transparent;`,
    content
  )
}

logFunc('日志', 'Success', '成功输出日志');

// 函数重载
// function log(message: string): void
// function log(type): void
// function log(message: string, type) {
//   if (!config.log) return
//   logFunc()
// }

// console.group("完整日志"),
// console.log("message ", e.message),
// console.log("time: ", e.time),
// console.log("type: ", e.type),
// console.log("meta: ", e.meta),
// console.groupEnd()
