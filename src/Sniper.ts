import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

const logger = createLogger('Sniper')

export interface ILogEmitter {
  subscribe: (onLog: (log: Log) => void) => void
}

export default class Sniper {
  private readonly logEmitter: ILogEmitter

  constructor(logEmitter: ILogEmitter) {
    this.logEmitter  = logEmitter
  }

  async start() {
    logger.info('Start')
  }
}
