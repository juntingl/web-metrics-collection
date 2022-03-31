import { config } from '../config'
import { IWebMetricsCollectionData, IWebMetricsType } from '../types'

const allData: Partial<Record<IWebMetricsType, IWebMetricsCollectionData>> = {}

const typeMap: Record<string, IWebMetricsType> = {
  'Navigation Time': 'navigationTime',
  'Network Info': 'networkInfo',
  FCP: 'fcp',
  FP: 'fp',
  'LCP Update': 'lcp',
  'CLS Update': 'cls',
  TBT: 'tbt',
  FID: 'fid',
  TTI: 'tti',
}

export default (type: string, data: IWebMetricsCollectionData) => {
  const currentType = typeMap[type]
  allData[currentType] = data
  config.tracker && config.tracker(currentType, data, allData)
}
