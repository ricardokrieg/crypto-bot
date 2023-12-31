import {Log} from 'web3-core'

import LogMonitor, {ILogEmitter} from '../../src/LogMonitor'
import {ILogReceiver} from '../../src/ReleaseDetector'
import {generateLog} from '../support/Log'

class TestLogEmitter implements ILogEmitter {
  private readonly log: Log

  constructor(log: Log) {
    this.log = log
  }

  subscribe(onLog: (log: Log) => void) {
    onLog(this.log)
  }
}

class TestLogReceiver implements ILogReceiver {
  log?: Log

  onLog(log: Log) {
    this.log = log
  }
}

test('Forwards logs from logEmitter to logReceiver', async () => {
  const log: Log = generateLog({
    data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  })

  const logEmitter = new TestLogEmitter(log)
  const logReceiver = new TestLogReceiver()

  const logMonitor = new LogMonitor(logEmitter, logReceiver)
  await logMonitor.start()

  expect(logReceiver.log).toEqual(log)
})

test('Does not forward a removed log', async () => {
  const log: Log = generateLog({
    removed: true
  })

  const logEmitter = new TestLogEmitter(log)
  const logReceiver = new TestLogReceiver()

  const logMonitor = new LogMonitor(logEmitter, logReceiver)
  await logMonitor.start()

  expect(logReceiver.log).toBeUndefined()
})

test('Does not forward a log that is not full approval', async () => {
  const log = generateLog({
    data: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  })

  const logEmitter = new TestLogEmitter(log)
  const logReceiver = new TestLogReceiver()

  const logMonitor = new LogMonitor(logEmitter, logReceiver)
  await logMonitor.start()

  expect(logReceiver.log).toBeUndefined()
})
