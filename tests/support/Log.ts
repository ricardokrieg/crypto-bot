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
    address: '',
    blockHash: '',
    blockNumber: 0,
    data: '',
    logIndex: 0,
    topics: [],
    transactionHash: '',
    transactionIndex: 0
  }

  // @ts-ignore
  return { ...log, ...overrides }
}

export const generateSimulatedLogs = (overrides: LogOverrides = {}): Log[] => {
  const logs: Log[] = []
  let blockNumber = 0
  const FULL_APPROVAL = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  const BCOIN_ADDRESS = '0x00e1656e45f18ec6747f5a8496fd39b50b38396d'

  // initial logs, to reach 10 blocks
  for (let i = 1; i <= 10; i++) {
    blockNumber++

    const log = generateLog({
      data: FULL_APPROVAL,
      blockNumber,
      ...overrides
    })

    logs.push(log)
  }

  // previous logs for a specific contract, must be < 5
  blockNumber++
  for (let i = 1; i < 5; i++) {
    const log = generateLog({
      data: FULL_APPROVAL,
      address: BCOIN_ADDRESS,
      blockNumber,
      ...overrides
    })

    logs.push(log)
  }

  // logs for a specific contract in the current block, must be >= 10
  blockNumber++
  for (let i = 1; i <= 10; i++) {
    const log = generateLog({
      data: FULL_APPROVAL,
      address: BCOIN_ADDRESS,
      blockNumber: blockNumber,
      ...overrides
    })

    logs.push(log)
  }

  return logs
}
