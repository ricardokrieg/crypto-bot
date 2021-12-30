import {Log} from 'web3-core'
import Web3 from 'web3'
import {default as createLogger} from 'logging'

import {ILogEmitter} from './LogMonitor'

const APPROVE_TOPIC   = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const PANCAKE_ADDRESS = '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e'

const logger = createLogger('Web3LogSubscriber')

export default class Web3LogSubscriber implements ILogEmitter {
  private readonly web3: Web3

  constructor(web3: Web3) {
    this.web3 = web3
  }

  subscribe(onLog: (log: Log) => void): void {
    logger.info(`Subscribing to Web3 logs`)

    this.web3.eth.subscribe(
      'logs',
      { topics: [APPROVE_TOPIC, null, PANCAKE_ADDRESS] },
      (error: Error, log: Log) => {
        if (error) {
          logger.error(error)
          return
        }

        onLog(log)
      }
    )
  }
}
