import {Log} from 'web3-core'

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

test('Stores all received logs', async () => {
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
  const logReceiver = new TestLogReceiver()

  const logStore = new LogStore(logEmitter, logReceiver)

  expect(logReceiver.log).toEqual(log)
})

test('Forwards all received logs to the log receiver', async () => {
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
  const logReceiver = new TestLogReceiver()

  const logStore = new LogStore(logEmitter, logReceiver)
  await logStore.start()

  expect(logReceiver.log).toEqual(log)
})
