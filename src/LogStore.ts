import {Log} from 'web3-core'

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
  }

  blockCount(): number {
    return Object.keys(this.blocks).length
  }
}
