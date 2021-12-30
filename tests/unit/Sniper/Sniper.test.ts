class TestLogEmitter implements ILogEmitter {
  private readonly log: Log

  constructor(log: Log) {
    this.log = log
  }

  subscribe(onLog: (log: Log) => void) {
    onLog(this.log)
  }
}

test('Forwards logs from logEmitter to logReceiver', async () => {
  const logEmitter = new TestLogEmitter()

  const sniper = new Sniper(logEmitter)
  await sniper.start()

  expect(logReceiver.log).toEqual(log)
})
