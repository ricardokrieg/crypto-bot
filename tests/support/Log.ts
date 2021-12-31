import {Log} from 'web3-core'

interface LogOverrides {
  address?: string,
  blockHash?: string,
  blockNumber?: number,
  data?: string,
  logIndex?: number,
  topics?: any[],
  transactionHash?: string,
  transactionIndex?: number,
  removed?: boolean
}

export const generateLog = (overrides: LogOverrides = {}): Log => {
  const log = {
    address: "",
    blockHash: "",
    blockNumber: 0,
    data: "",
    logIndex: 0,
    topics: [],
    transactionHash: "",
    transactionIndex: 0
  }

  return { ...log, ...overrides }
}
