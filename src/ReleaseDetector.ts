import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ISniper} from './Sniper'

const logger = createLogger('ReleaseDetector')

export interface ILogReceiver {
  onLog: (log: Log) => void
}

export interface ILogStore {
  add: (log: Log) => void
  blockCount: () => number
  contractCount: (address: string, blockNumber: number) => number
}

export default class ReleaseDetector implements ILogReceiver {
  private readonly logStore: ILogStore
  private readonly sniper: ISniper

  constructor(logStore: ILogStore, sniper: ISniper) {
    this.logStore = logStore
    this.sniper = sniper
  }

  onLog(log: Log) {
    this.logStore.add(log)

    if (this.logStore.blockCount() < 100) return
    if (this.logStore.contractCount(log.address, log.blockNumber) < 10) return

    let count = 0
    for (let i = 1; i <= 10; i++) {
      count += this.logStore.contractCount(log.address, log.blockNumber - i)
    }

    if (count > 5) return

    this.sniper.add(log.address)
  }
}
