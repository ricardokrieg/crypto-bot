import {Log} from 'web3-core'
import {WebSocketServer} from 'ws'
import {default as createLogger} from 'logging'

import {ILogReceiver} from './LogStore'

const logger = createLogger('WebSocketListener')

export default class WebSocketListener {
  private readonly wss: WebSocketServer
  private readonly logReceiver: ILogReceiver

  constructor(wss: WebSocketServer, logReceiver: ILogReceiver) {
    this.wss = wss
    this.logReceiver = logReceiver
  }

  async start() {
    logger.info(`Listening on port ${this.wss.options.port}`)

    const self = this
    this.wss.on('connection', function connection(ws) {
      logger.info(`Client connected`)

      ws.on('message', function message(data) {
        logger.info(data.toString())

        self.logReceiver.onLog(JSON.parse(data.toString()) as Log)
      })
    })

    return new Promise((resolve) => {
      this.wss.on('listening', resolve)
    })
  }
}
