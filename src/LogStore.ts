import {Log} from 'web3-core'

export interface ILogReceiver {
  onLog: (log: Log) => void
}

export interface ILogStore {
  logs: Log[]
  blockCount: () => number
}

export default class LogStore implements ILogReceiver, ILogStore {
  readonly logs: Log[]
  private readonly blocks: { [blockNumber: number]: string[] }

  constructor() {
    this.logs = []
    this.blocks = {}
  }

  onLog(log: Log) {
    this.logs.push(log)

    const block = this.blocks[log.blockNumber] || []
    this.blocks[log.blockNumber] = [ ...block, log.address ]
  }

  blockCount(): number {
    return Object.keys(this.blocks).length
  }
}
