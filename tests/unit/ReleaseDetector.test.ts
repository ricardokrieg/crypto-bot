import {Log} from 'web3-core'
import assert from 'assert'

import ReleaseDetector from '../../src/ReleaseDetector'
import {ILogStore} from '../../src/LogStore'
import {IReleaseListener, Release} from '../../src/Sniper'

class TestReleaseListener implements IReleaseListener {
  public release?: Release

  onRelease(release: Release): void {
    this.release = release
  }
}

class TestLogStore implements ILogStore {
  blockCount(): number {
    return 99
  }
}

describe('When the Log Store has less than 100 blocks', () => {
  let logStore = new TestLogStore()

  beforeEach(() => {
    assert(logStore.blockCount() < 100)
  })

  test('Does nothing', async () => {
    const releaseListener = new TestReleaseListener()

    const releaseDetector = new ReleaseDetector(logStore, releaseListener)

    for (let i = 0; i < 3; i++) {
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

      releaseDetector.onLog(log)
    }

    expect(releaseListener.release).toBeUndefined()
  })
})
