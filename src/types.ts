// WMC => Web Metrics Collection
export type ICallback = (entries: any[]) => void

export type IWebMetricsType =
  | 'navigationTime'
  | 'networkInfo'
  | 'fcp'
  | 'fp'
  | 'lcp'
  | 'cls'
  | 'fid'
  | 'tbt'
  | 'tti'
  | 'fmp'
export interface ICallbackProps {
  tracker?: (type: IWebMetricsType, data: any, allData: any) => void
  log?: boolean
}

export type IWebMetricsCollectionData = Object | number

// 对外公共接口
export interface IWebMetricsCollection {
  // performance mark
  markStart: (name: string) => void
  // performance mark and log measures
  markEnd: (startName: string, endName: string) => void
  // performance clearMarks
  clearMarks: (name?: string) => void
  // performance clearMeasures
  clearMeasures: (name?: string) => void
  // fmp start
  fmpStart: () => void
  // fmp end and log fmp measure
  fmpEnd: () => void
}
