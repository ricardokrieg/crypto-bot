require('dotenv').config({ path: '.env' })

import {WebSocketServer} from 'ws'
import {default as createLogger} from 'logging'

(async () => {
  const logger = createLogger('WebSocketServer')
  const port = parseInt(process.env['SNIPER_WS_PORT'] || '8000')

  const wss = new WebSocketServer({ port })
  logger.info(`Listening on port ${port}`)

  wss.on('connection', function connection(ws) {
    logger.info(`Client connected`)

    ws.on('message', function message(data) {
      logger.info(data.toString())
    })
  })
})()
