import {Log} from 'web3-core'

import LogMonitor, {ILogEmitter} from '../../src/LogMonitor'
import {ILogReceiver} from '../../src/LogStore'

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

  const logEmitter = new TestLogEmitter(log)
  const logReceiver1 = new TestLogReceiver()
  const logReceiver2 = new TestLogReceiver()

  const logMonitor = new LogMonitor(logEmitter, [logReceiver1, logReceiver2])
  await logMonitor.start()

  expect(logReceiver1.log).toEqual(log)
  expect(logReceiver2.log).toEqual(log)
})

test('Does not forward a removed log', async () => {
  const log: Log = {
    address: "",
    blockHash: "",
    blockNumber: 0,
    data: "",
    logIndex: 0,
    topics: [],
    transactionHash: "",
    transactionIndex: 0,
    // @ts-ignore
    removed: true
  }

  const logEmitter = new TestLogEmitter(log)
  const logReceiver1 = new TestLogReceiver()
  const logReceiver2 = new TestLogReceiver()

  const logMonitor = new LogMonitor(logEmitter, [logReceiver1, logReceiver2])
  await logMonitor.start()

  expect(logReceiver1.log).toBeUndefined()
  expect(logReceiver2.log).toBeUndefined()
})
