import {Log} from 'web3-core'
import WebSocket, {WebSocketServer} from 'ws'

import {ILogReceiver} from '../../../src/Sniper/LogStore'
import WebSocketForwarder from '../../../src/LogMonitor/WebSocketForwarder'
import WebSocketListener from '../../../src/Sniper/WebSocketListener'

const SNIPER_WS_PORT = 8001

jest.setTimeout(15000)

class TestLogReceiver implements ILogReceiver {
  log?: Log

  onLog(log: Log) {
    this.log = log
  }
}

const emitLog = async (log: Log) => {
  return new Promise((resolve: any) => {
    const ws = new WebSocket(`ws://localhost:${SNIPER_WS_PORT}`)
    ws.on('open', () => {
      const webSocketForwarder = new WebSocketForwarder(ws)

      webSocketForwarder.onLog(log)
      resolve()
    })
  })
}

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

  const logReceiver = new TestLogReceiver()
  const wss = new WebSocketServer({ port: SNIPER_WS_PORT })

  const webSocketListener = new WebSocketListener(wss, logReceiver)
  await webSocketListener.start()

  await emitLog(log)

  expect(logReceiver.log).toEqual(log)
})
