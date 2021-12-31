import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import {ILogReceiver} from './LogStore'
import {IReleaseListener} from './Sniper'

const logger = createLogger('ReleaseDetector')

export default class ReleaseDetector implements ILogReceiver {
  private readonly releaseListener: IReleaseListener

  constructor(releaseListener: IReleaseListener) {
    this.releaseListener = releaseListener
  }

  onLog(log: Log) {
    logger.info(log)
  }
}
