import { WebSocketServer } from 'ws'
import { exec } from 'child_process'

jest.setTimeout(60000)

const SNIPER_WS_PORT = 8001

class TestWebSocketServer {
  messages: any[]

  private readonly wss: WebSocketServer

  constructor() {
    this.messages = []
    this.wss = new WebSocketServer({ port: SNIPER_WS_PORT })
  }

  start(resolve: any) {
    const self = this

    this.wss.on('connection', function connection(ws) {
      console.log('Client connected')

      ws.on('message', function message(data) {
        console.log(data.toString())
        self.messages.push(data)

        if (self.messages.length === 5) {
          resolve()
        }
      })
    })

    console.log(`WebSocket server started`)
  }

  async stop() {
    await this.wss.close()
  }
}

const startLogMonitor = () => {
  return exec(`SNIPER_WS_PORT=${SNIPER_WS_PORT} yarn log_monitor`)
}

test('Continuously forwards logs from Web3 to a WebSocket server', async () => {
  const server = new TestWebSocketServer()

  const serverPromise = new Promise((resolve) => {
    server.start(resolve)
  })
  let logMonitorProcess

  try {
    console.log(`Starting LogMonitor`)
    logMonitorProcess = startLogMonitor()

    await serverPromise

    expect(server.messages.length).toBeGreaterThanOrEqual(5)
  } finally {
    await server.stop()
    logMonitorProcess?.kill()
  }
})
