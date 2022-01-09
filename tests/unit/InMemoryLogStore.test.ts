import InMemoryLogStore from '../../src/InMemoryLogStore'
import {generateLog} from '../support/Log'

test('Returns how many blocks it has stored', async () => {
  const logStore = new InMemoryLogStore()

  for (let i = 1; i <= 3; i++) {
    const log = generateLog({
      blockNumber: 1000 + i
    })

    logStore.add(log)
  }

  expect(logStore.blockCount()).toBe(3)
})

test('Returns the count of approvals for a specific Contract in a specific Block', async () => {
  const logStore = new InMemoryLogStore()

  logStore.add(generateLog({
    address: '0x1',
    blockNumber: 1000
  }))

  logStore.add(generateLog({
    address: '0x1',
    blockNumber: 1000
  }))

  logStore.add(generateLog({
    address: '0x2',
    blockNumber: 1000
  }))

  logStore.add(generateLog({
    address: '0x1',
    blockNumber: 1001
  }))

  expect(logStore.contractCount('0x1', 1000)).toBe(2)
})
