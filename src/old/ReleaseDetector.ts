import {default as createLogger} from 'logging'
import {Log} from 'web3-core'

import {ILogListener} from './LogMonitor'
import Web3Proxy from "./Web3Proxy";

const logger = createLogger('ApproveDetector')

const APPROVE_TOPIC   = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const PANCAKE_ADDRESS = '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e'
const FULL_APPROVAL   = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export interface IReleaseListener {
  onApprove: (approval: Approval) => void
}

export interface Release {
  address: string
  blockNumber: number
}

export default class ReleaseDetector implements ILogListener {
  private readonly listeners: IApproveListener[]
  // private readonly approvals: any

  constructor() {
    this.listeners = []
    // this.approvals = {}
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

  // onLog(log: Log): void {
  //   logger.info(log)
  //
  //   const address = log.address.toUpperCase()
  //   const addressApprovals = this.approvals[address] || {}
  //   const blockApprovals = (addressApprovals[log.blockNumber] || 0) + 1
  //
  //   addressApprovals[log.blockNumber] = blockApprovals
  //   this.approvals[address] = addressApprovals
  //
  //   if (blockApprovals >= 5 && this.approvalsOnBlock(address, log.blockNumber - 1) <= 1 && this.approvalsOnBlock(address, log.blockNumber - 2) <= 1) {
  //     for (let listener of this.listeners) {
  //       listener.onApprove({ address, blockNumber: log.blockNumber })
  //     }
  //   }
  //
  //   logger.info(this.approvals)
  // }
  //
  // add(listener: IApproveListener) {
  //   this.listeners.push(listener)
  // }
  //
  // private approvalsOnBlock(address: string, blockNumber: number): number {
  //   const addressApprovals = this.approvals[address] || {}
  //   return addressApprovals[blockNumber] || 0
  // }
}
