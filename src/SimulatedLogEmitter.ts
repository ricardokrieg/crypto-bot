import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogEmitter} from './LogMonitor'

const logger = createLogger('SimulatedLogEmitter')

export default class SimulatedLogEmitter implements ILogEmitter {
  private readonly logs: Log[]

  constructor(logs: Log[]) {
    this.logs = logs
  }

  subscribe(onLog: (log: Log) => void) {
    logger.info(`Starting simulation`)

    for (let log of this.logs) {
      onLog(log)
    }
  }
}
