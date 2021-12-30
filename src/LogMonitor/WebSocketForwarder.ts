import {Log} from 'web3-core'
import {default as createLogger} from 'logging'
import WebSocket from 'ws'

import {ILogReceiver} from './LogMonitor'

const logger = createLogger('WebSocketForwarder')

export default class WebSocketForwarder implements ILogReceiver {
  private readonly ws: WebSocket

  constructor(ws: WebSocket) {
    this.ws = ws
  }

  onLog(log: Log) {
    logger.info(`Forwarding log`)

    this.ws.send(JSON.stringify(log))
  }
}
