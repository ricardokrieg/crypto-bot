import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogReceiver} from './LogStore'

const FULL_APPROVAL = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const logger = createLogger('LogMonitor')

export interface ILogEmitter {
  subscribe: (onLog: (log: Log) => void) => void
}

export default class LogMonitor {
  private readonly logEmitter: ILogEmitter
  private readonly logReceivers: ILogReceiver[]

  constructor(logEmitter: ILogEmitter, logReceivers: ILogReceiver[]) {
    this.logEmitter  = logEmitter
    this.logReceivers = logReceivers
  }

  async start() {
    logger.info('Start')

    this.logEmitter.subscribe((log: Log) => {
      // @ts-ignore
      if (log.removed) {
        return
      }

      if (log.data !== FULL_APPROVAL) {
        return
      }

      for (let logReceiver of this.logReceivers) {
        logReceiver.onLog(log)
      }
    })
  }
}
