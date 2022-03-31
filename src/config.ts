import { ICallbackProps } from './types'
import { isDev } from './utils/utils'

export const config: ICallbackProps = {
  tracker: () => {},
  log: isDev(),
}
