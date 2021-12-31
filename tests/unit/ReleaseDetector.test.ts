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
  private readonly blocks: number

  constructor(blocks: number) {
    this.blocks = blocks
  }

  blockCount(): number {
    return this.blocks
  }
}

describe('When the Log Store has less than 100 blocks', () => {
  let logStore = new TestLogStore(99)

  beforeEach(() => {
    assert(logStore.blockCount() < 100)
  })

  test('Does nothing', async () => {
    const releaseListener = new TestReleaseListener()

    const releaseDetector = new ReleaseDetector(logStore, releaseListener)

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

    expect(releaseListener.release).toBeUndefined()
  })
})

describe('When the Log Store has 100 blocks or more', () => {
  let logStore = new TestLogStore(100)

  beforeEach(() => {
    assert(logStore.blockCount() >= 100)
  })

  test('Emits the Release to the release listener', async () => {
    const releaseListener = new TestReleaseListener()

    const releaseDetector = new ReleaseDetector(logStore, releaseListener)

    const log: Log = {
      address: "0x0",
      blockHash: "",
      blockNumber: 0,
      data: "",
      logIndex: 0,
      topics: [],
      transactionHash: "",
      transactionIndex: 0
    }

    releaseDetector.onLog(log)

    expect(releaseListener.release).toEqual({ address: "0x0" })
  })
})
