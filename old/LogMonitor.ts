import {Log} from 'web3-core'
import {default as createLogger} from 'logging'

import Web3Proxy from './Web3Proxy'

const APPROVE_TOPIC   = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const PANCAKE_ADDRESS = '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e'
const FULL_APPROVAL   = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const logger = createLogger('LogMonitor')

export interface ILogListener {
  onLog: (log: Log) => void
}

export default class LogMonitor implements ILogEmitter {
  private readonly listeners: ILogListener[]

  constructor() {
    this.listeners = []
  }

  start() {
    Web3Proxy.instance.subscribeToLogs({
      topics: [
        APPROVE_TOPIC,
        null,
        PANCAKE_ADDRESS
      ]
    }, (error, log) => {
      if (error) {
        logger.error(error)
        return
      }

      this.onLog(log)
    })
  }

  add(listener: ILogListener) {
    this.listeners.push(listener)
  }

  private onLog(log: Log) {
    // @ts-ignore
    if (log['removed']) {
      logger.debug(`Log ${log.address} has been removed`)
      return
    }

    for (let listener of this.listeners) {
      listener.onLog(log)
    }
  }
}
