import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogStore} from './ReleaseDetector'

const logger = createLogger('LogStore')

export default class InMemoryLogStore implements ILogStore {
  private firstBlock: number = 0
  private lastBlock: number = 0
  private readonly blocks: { [blockNumber: number]: string[] } = {}

  add(log: Log) {
    if (this.firstBlock === 0) {
      this.firstBlock = log.blockNumber
    }

    if (log.blockNumber > this.lastBlock) {
      this.lastBlock = log.blockNumber
    }

    const block = this.blocks[log.blockNumber] || []
    this.blocks[log.blockNumber] = [ ...block, log.address ]
  }

  blockCount(): number {
    if (this.firstBlock === 0) return 0

    return this.lastBlock - this.firstBlock + 1
  }

  contractCount(address: string, blockNumber: number): number {
    if (!this.blocks.hasOwnProperty(blockNumber)) return 0

    return this.blocks[blockNumber].reduce((count, addr) => (addr === address ? count + 1 : count), 0)
  }
}
