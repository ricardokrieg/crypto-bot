import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogStore, ILogReceiver} from './LogStore'
import {IReleaseListener} from './Sniper'

const logger = createLogger('ReleaseDetector')

export default class ReleaseDetector implements ILogReceiver {
  private readonly logStore: ILogStore
  private readonly releaseListener: IReleaseListener

  constructor(logStore: ILogStore, releaseListener: IReleaseListener) {
    this.logStore = logStore
    this.releaseListener = releaseListener
  }

  onLog(log: Log) {
    logger.info(log)

    if (this.logStore.blockCount() < 100) return
    if (this.logStore.contractCount(log.address, log.blockNumber) < 10) return

    let count = 0
    for (let i = 1; i <= 10; i++) {
      count += this.logStore.contractCount(log.address, log.blockNumber - i)
    }

    if (count > 5) return

    this.releaseListener.onRelease({ address: log.address })
  }
}
