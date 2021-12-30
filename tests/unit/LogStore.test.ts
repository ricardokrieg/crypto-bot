import {Log} from 'web3-core'

import LogStore from '../../src/LogStore'

test('Stores all received logs', async () => {
  const logs: Log[] = []
  const logStore = new LogStore()

  for (let i = 0; i < 2; i++) {
    const log: Log = {
      address: "",
      blockHash: "",
      blockNumber: 0,
      data: "",
      logIndex: 0,
      topics: [],
      transactionHash: "",
      transactionIndex: 0
    }

    logs.push(log)
    logStore.onLog(log)
  }

  expect(logStore.logs.length).toBe(2)
  expect(logStore.logs[0]).toEqual(logs[0])
})

test('Returns how many blocks it has stored', async () => {
  const logStore = new LogStore()

  for (let i = 0; i < 3; i++) {
    const log: Log = {
      address: "",
      blockHash: "",
      blockNumber: i === 0 ? 1 : i, // resulting blocks will be: 1, 1, 2
      data: "",
      logIndex: 0,
      topics: [],
      transactionHash: "",
      transactionIndex: 0
    }

    logStore.onLog(log)
  }

  expect(logStore.blockCount()).toBe(2)
})
