import {Log} from 'web3-core'
import WebSocket from 'ws'

import WebSocketForwarder from '../../../src/LogMonitor/WebSocketForwarder'

test('Forwards logs to a WebSocket server', async () => {
  const url = 'ws://example.com'
  const ws = new WebSocket(url)

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

  // @ts-ignore
  jest.spyOn(ws, 'send').mockImplementation((data: string) => {
    console.log(`WebSocket => ${data}`)
  })

  const webSocketForwarder = new WebSocketForwarder(ws)
  webSocketForwarder.onLog(log)

  expect(ws.send).toBeCalledWith(JSON.stringify(log))
})
