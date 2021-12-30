import {exec} from 'child_process'
import express, {Express} from 'express'
import {Server} from 'http'

jest.setTimeout(60000)

const WEB3_HTTP_PORT = 8002

class TestHttpServer {
  requests: any[]

  private readonly app: Express
  private server?: Server

  constructor() {
    this.requests = []

    this.app = express()
  }

  start(resolve: any) {
    this.app.use(express.json())

    this.app.post('/', (req, res) => {
      const { body } = req

      console.log(body)

      const jsonrpc = body['jsonrpc']
      const id = body['id']
      const method = body['method']
      const params = body['params']

      switch (method) {
        case 'eth_blockNumber':
          res.json({ jsonrpc, id, result: '0xd3e2e5' })
          break
      }

      resolve()
    })

    this.server = this.app.listen(WEB3_HTTP_PORT, () => {
      console.log(`⚡️[server]: Server is running at https://localhost:${WEB3_HTTP_PORT}`)
    })
  }

  stop() {
    this.server?.close()
  }
}

const startSniper = () => {
  return exec('yarn sniper')
}

const emitLogs = async () => {
  return Promise.resolve()
}

test('', async () => {
  const server = new TestHttpServer()

  const serverPromise = new Promise((resolve) => {
    server.start(resolve)
  })
  let sniperProcess

  try {
    console.log(`Starting Sniper`)
    sniperProcess = startSniper()

    await emitLogs()
    await serverPromise

    expect(server.requests.length).toBe(1)
  } finally {
    await server.stop()
    sniperProcess?.kill()
  }
})
