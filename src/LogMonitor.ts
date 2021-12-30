import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogReceiver} from './LogStore'

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
      logger.info('Received Log')

      // @ts-ignore
      if (log.removed) {
        logger.warn(`Discarding removed log`)
        return
      }

      for (let logReceiver of this.logReceivers) {
        logReceiver.onLog(log)
      }
    })
  }
}
