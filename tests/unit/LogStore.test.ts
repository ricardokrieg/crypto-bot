import {Log} from 'web3-core'

import LogStore from '../../src/LogStore'

test('Stores all received logs', async () => {
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

  const logStore = new LogStore()
  logStore.onLog(log)

  expect(logStore.logs.length).toBe(1)
  expect(logStore.logs[0]).toEqual(log)
})
