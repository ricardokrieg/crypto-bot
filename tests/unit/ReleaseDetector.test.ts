import assert from 'assert'

import ReleaseDetector from '../../src/ReleaseDetector'
import {ILogStore} from '../../src/LogStore'
import {IReleaseListener, Release} from '../../src/Sniper'
import {generateLog} from '../support/Log'

class TestReleaseListener implements IReleaseListener {
  public release?: Release

  onRelease(release: Release): void {
    this.release = release
  }
}

class TestLogStore implements ILogStore {
  blockCount(): number {
    return 0
  }

  contractCount(_address: string, _blockNumber: number): number {
    return 0
  }
}

const logStore = new TestLogStore()
const releaseListener = new TestReleaseListener()
const contractAddress = '0x1'
const blockNumber = 1000

afterEach(() => {
  releaseListener.release = undefined
})

describe('When the Log Store has less than 100 blocks', () => {
  beforeEach(() => {
    logStore.blockCount = jest.fn(() => 99)

    assert(logStore.blockCount() < 100)
  })

  test('Does nothing', async () => {
    const releaseDetector = new ReleaseDetector(logStore, releaseListener)

    const log = generateLog({
      address: contractAddress,
      blockNumber
    })

    releaseDetector.onLog(log)

    expect(releaseListener.release).toBeUndefined()
  })
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

        let count = 0
        for (let i = 1; i <= 10; i++) {
          count += logStore.contractCount(contractAddress, blockNumber - i)
        }
        assert(count <= 5)
      })

      test('Emits the Release to the release listener', async () => {
        const releaseDetector = new ReleaseDetector(logStore, releaseListener)

        const log = generateLog({
          address: contractAddress,
          blockNumber
        })

        releaseDetector.onLog(log)

        expect(releaseListener.release).toEqual({ address: contractAddress })
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

        let count = 0
        for (let i = 1; i <= 10; i++) {
          count += logStore.contractCount(contractAddress, blockNumber - i)
        }
        assert(count > 5)
      })

      test('Does nothing', async () => {
        const releaseDetector = new ReleaseDetector(logStore, releaseListener)

        const log = generateLog({
          address: contractAddress,
          blockNumber
        })

        releaseDetector.onLog(log)

        expect(releaseListener.release).toBeUndefined()
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
      const releaseDetector = new ReleaseDetector(logStore, releaseListener)

      const log = generateLog({
        address: contractAddress,
        blockNumber
      })

      releaseDetector.onLog(log)

      expect(releaseListener.release).toBeUndefined()
    })
  })
})
