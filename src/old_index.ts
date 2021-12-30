require('dotenv').config({ path: '.env' })

import Web3 from 'web3'
import WebSocket from 'ws'

import LogMonitor from './LogMonitor/LogMonitor'
import Web3LogSubscriber from './LogMonitor/Web3LogSubscriber'
import WebSocketForwarder from './LogMonitor/WebSocketForwarder'

(async () => {
  const web3Url = process.env['WEB3_WS_URL'] || ''
  const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Url))
  const web3LogSubscriber = new Web3LogSubscriber(web3)

  const wsUrl = process.env['SNIPER_WS_URL'] || ''
  const wsPort = process.env['SNIPER_WS_PORT'] || '8000'
  const ws = new WebSocket(`${wsUrl}:${wsPort}`)
  const webSocketForwarder = new WebSocketForwarder(ws)

  const logMonitor = new LogMonitor(web3LogSubscriber, webSocketForwarder)
  await logMonitor.start()
})()
