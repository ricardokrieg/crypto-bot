import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

const logger = createLogger('LogStore')

export interface ILogReceiver {
  onLog: (log: Log) => void
}

export interface ILogStore {
  blockCount: () => number
}

export default class LogStore implements ILogReceiver, ILogStore {
  private readonly blocks: { [blockNumber: number]: string[] }

  constructor() {
    this.blocks = {}
  }

  onLog(log: Log) {
    const block = this.blocks[log.blockNumber] || []
    this.blocks[log.blockNumber] = [ ...block, log.address ]

    logger.info(this.blocks)
    logger.info(`Block Count: ${this.blockCount()}`)
  }

  blockCount(): number {
    return Object.keys(this.blocks).length
  }
}
