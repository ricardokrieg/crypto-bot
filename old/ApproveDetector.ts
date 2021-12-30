import {default as createLogger} from 'logging'
import {Log} from 'web3-core'

import {ILogListener} from './LogMonitor'

const logger = createLogger('ApproveDetector')

export interface IApproveListener {
  onApprove: (approval: Approval) => void
}

export interface Approval {
  address: string
  blockNumber: number
}

export default class ApproveDetector implements ILogListener {
  private readonly listeners: IApproveListener[]
  private readonly approvals: any

  constructor() {
    this.listeners = []
  }

  onLog(log: Log): void {
    logger.info(log)

    if (LogMonitor.isApproval(log)) {
      for (let listener of this.listeners) {
        listener.onApproval({ address: log.address, blockNumber: log.blockNumber })
      }
    }

    const address = log.address.toUpperCase()
    const addressApprovals = this.approvals[address] || {}
    const blockApprovals = (addressApprovals[log.blockNumber] || 0) + 1

    addressApprovals[log.blockNumber] = blockApprovals
    this.approvals[address] = addressApprovals

    if (blockApprovals >= 5 && this.approvalsOnBlock(address, log.blockNumber - 1) <= 1 && this.approvalsOnBlock(address, log.blockNumber - 2) <= 1) {
      for (let listener of this.listeners) {
        listener.onApprove({ address, blockNumber: log.blockNumber })
      }
    }

    logger.info(this.approvals)
  }

  private static isApproval(log: Log): boolean {
    const { topics, data } = log

    return topics.length === 3 && topics[1] !== topics[2] && data.toLowerCase() === FULL_APPROVAL
  }

  add(listener: IApproveListener) {
    this.listeners.push(listener)
  }

  private approvalsOnBlock(address: string, blockNumber: number): number {
    const addressApprovals = this.approvals[address] || {}
    return addressApprovals[blockNumber] || 0
  }
}
