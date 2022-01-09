import assert from 'assert'
import {Log} from 'web3-core'

import ReleaseDetector, {ILogStore} from '../../src/ReleaseDetector'
import {ISniper} from '../../src/Sniper'
import {generateLog} from '../support/Log'

class TestSniper implements ISniper {
  public address?: string

  add(address: string): void {
    this.address = address
  }
}

class TestLogStore implements ILogStore {
  add(_log: Log) {
  }

  blockCount(): number {
    return 0
  }

  contractCount(_address: string, _blockNumber: number): number {
    return 0
  }
}

const logStore = new TestLogStore()
const sniper = new TestSniper()
const contractAddress = '0x1'
const blockNumber = 1000

afterEach(() => {
  sniper.address = undefined
})

test('Forwards the logs to the log store', async () => {
  const spy = jest.spyOn(logStore, 'add')

  const releaseDetector = new ReleaseDetector(logStore, sniper)

  const log = generateLog({
    address: contractAddress,
    blockNumber
  })

  releaseDetector.onLog(log)

  expect(spy).toBeCalledWith(log)
})

test('Does nothing when the Log Store has less than 100 blocks', () => {
  logStore.blockCount = jest.fn(() => 99)
  assert(logStore.blockCount() < 100)
  assert(sniper.address === undefined)

  const releaseDetector = new ReleaseDetector(logStore, sniper)

  const log = generateLog({
    address: contractAddress,
    blockNumber
  })

  releaseDetector.onLog(log)

  expect(sniper.address).toBeUndefined()
})

describe('When the Log Store has 100 or more blocks', () => {
  beforeEach(() => {
    logStore.blockCount = jest.fn(() => 100)

    assert(logStore.blockCount() >= 100)
  })

  describe('When the Contract has 10 or more approvals in the current block', () => {
    describe('When the Contract has 5 or less approvals in the last 10 blocks', () => {
      beforeEach(() => {
        logStore.contractCount = jest.fn((addr, blockN) => {
          if (addr === contractAddress && blockN === blockNumber) {
            return 10
          } else if (addr === contractAddress && blockN === (blockNumber - 1)) {
            return 5
          } else {
            return 0
          }
        })

        assert(logStore.contractCount(contractAddress, blockNumber) === 10)
        assert(logStore.contractCount(contractAddress, blockNumber - 1) === 5)
        assert(logStore.contractCount(contractAddress, blockNumber - 2) === 0)
      })

      test('Sends the address to the Sniper', async () => {
        const releaseDetector = new ReleaseDetector(logStore, sniper)

        const log = generateLog({
          address: contractAddress,
          blockNumber
        })

        releaseDetector.onLog(log)

        expect(sniper.address).toEqual(contractAddress)
      })
    })

    describe('When the Contract has more than 5 approvals in the last 10 blocks', () => {
      beforeEach(() => {
        logStore.contractCount = jest.fn((addr, blockN) => {
          if (addr === contractAddress && blockN === blockNumber) {
            return 10
          } else if (addr === contractAddress && blockN === (blockNumber - 1)) {
            return 6
          } else {
            return 0
          }
        })

        assert(logStore.contractCount(contractAddress, blockNumber) === 10)
        assert(logStore.contractCount(contractAddress, blockNumber - 1) === 6)
        assert(logStore.contractCount(contractAddress, blockNumber - 2) === 0)
      })

      test('Does nothing', async () => {
        const releaseDetector = new ReleaseDetector(logStore, sniper)

        const log = generateLog({
          address: contractAddress,
          blockNumber
        })

        releaseDetector.onLog(log)

        expect(sniper.address).toBeUndefined()
      })
    })
  })

  describe('When the Contract has less than 10 approvals in the current block', () => {
    beforeEach(() => {
      logStore.contractCount = jest.fn((addr, blockN) => {
        if (addr === contractAddress && blockN === blockNumber) {
          return 9
        } else {
          return 0
        }
      })

      assert(logStore.contractCount(contractAddress, blockNumber) < 10)
    })

    test('Does nothing', async () => {
      const releaseDetector = new ReleaseDetector(logStore, sniper)

      const log = generateLog({
        address: contractAddress,
        blockNumber
      })

      releaseDetector.onLog(log)

      expect(sniper.address).toBeUndefined()
    })
  })
})
