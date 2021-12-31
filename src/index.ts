require('dotenv').config({ path: '.env' })

import Web3 from 'web3'

import LogMonitor from './LogMonitor'
import Web3LogSubscriber from './Web3LogSubscriber'
import LogStore from './LogStore'

(async () => {
  const web3WsUrl = process.env['WEB3_WS_URL'] || ''
  const web3 = new Web3(new Web3.providers.WebsocketProvider(web3WsUrl))

  const web3LogSubscriber = new Web3LogSubscriber(web3)

  const logStore = new LogStore()

  const logMonitor = new LogMonitor(web3LogSubscriber, [logStore])
  await logMonitor.start()
})()
