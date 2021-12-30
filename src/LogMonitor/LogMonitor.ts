import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

const logger = createLogger('LogMonitor')

export interface ILogEmitter {
  subscribe: (onLog: (log: Log) => void) => void
}

export interface ILogReceiver {
  onLog: (log: Log) => void
}

export default class LogMonitor {
  private readonly logEmitter: ILogEmitter
  private readonly logReceiver: ILogReceiver

  constructor(logEmitter: ILogEmitter, logReceiver: ILogReceiver) {
    this.logEmitter  = logEmitter
    this.logReceiver = logReceiver
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

      this.logReceiver.onLog(log)
    })
  }
}
