import {Log} from 'web3-core'

import ReleaseDetector from '../../src/ReleaseDetector'
import {IReleaseListener, Release} from '../../src/Sniper'

class TestReleaseListener implements IReleaseListener {
  public release?: Release

  onRelease(release: Release): void {
    this.release = release
  }
}

test('Does nothing', async () => {
  const releaseListener = new TestReleaseListener()

  const releaseDetector = new ReleaseDetector(releaseListener)

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
