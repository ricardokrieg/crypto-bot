import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogReceiver} from './ReleaseDetector'

const FULL_APPROVAL = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const logger = createLogger('LogMonitor')

export interface ILogEmitter {
  subscribe: (onLog: (log: Log) => void) => void
}

export default class LogMonitor {
  private readonly logEmitter: ILogEmitter
  private readonly logReceiver: ILogReceiver

  constructor(logEmitter: ILogEmitter, logReceiver: ILogReceiver) {
    this.logEmitter = logEmitter
    this.logReceiver = logReceiver
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

      this.logReceiver.onLog(log)
    })
  }
}
