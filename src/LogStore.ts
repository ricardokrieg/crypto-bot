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
  private firstBlock: number = 0
  private lastBlock: number = 0
  private readonly blocks: { [blockNumber: number]: string[] } = {}

  onLog(log: Log) {
    if (this.firstBlock === 0) {
      this.firstBlock = log.blockNumber
    }

    if (log.blockNumber > this.lastBlock) {
      this.lastBlock = log.blockNumber
    }

    const block = this.blocks[log.blockNumber] || []
    this.blocks[log.blockNumber] = [ ...block, log.address ]

    logger.info(this.blocks)
    logger.info(`Block Count: ${this.blockCount()}`)
  }

  blockCount(): number {
    if (this.firstBlock === 0) return 0

    return this.lastBlock - this.firstBlock + 1
  }
}
