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

    const blockCount = this.logStore.blockCount()
    const contractCount = this.logStore.contractCount(log.address, log.blockNumber)

    logger.debug(`Block Count: ${blockCount} (min 10)`)
    logger.debug(`Contract Count (last block): ${contractCount} (min 10)`)

    if (this.logStore.blockCount() < 10) return
    if (this.logStore.contractCount(log.address, log.blockNumber) < 10) return

    let count = 0
    for (let i = 1; i <= 10; i++) {
      count += this.logStore.contractCount(log.address, log.blockNumber - i)
    }

    logger.debug(`Contract Count (previous blocks): ${count} (max 5)`)

    if (count > 5) return

    this.sniper.add(log.address)
  }
}
