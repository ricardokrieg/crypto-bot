import LogStore from '../../src/LogStore'
import {generateLog} from '../support/Log'

test('Returns how many blocks it has stored', async () => {
  const logStore = new LogStore()

  for (let i = 1; i <= 3; i++) {
    const log = generateLog({
      blockNumber: 1000 + i
    })

    logStore.onLog(log)
  }

  expect(logStore.blockCount()).toBe(3)
})
