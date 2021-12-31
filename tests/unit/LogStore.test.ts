import {Log} from 'web3-core'

import LogStore from '../../src/LogStore'

test('Returns how many blocks it has stored', async () => {
  const logStore = new LogStore()

  for (let i = 1; i <= 3; i++) {
    const log: Log = {
      address: "",
      blockHash: "",
      blockNumber: 1000 + i,
      data: "",
      logIndex: 0,
      topics: [],
      transactionHash: "",
      transactionIndex: 0
    }

    logStore.onLog(log)
  }

  expect(logStore.blockCount()).toBe(3)
})
