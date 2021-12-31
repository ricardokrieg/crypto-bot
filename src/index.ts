require('dotenv').config({ path: '.env' })

import Web3 from 'web3'

import LogMonitor from './LogMonitor'
import LogStore from './LogStore'
import ReleaseDetector from './ReleaseDetector'
import Sniper from './Sniper'
import Web3LogSubscriber from './Web3LogSubscriber'

(async () => {
  const sniper = new Sniper()

  const web3WsUrl = process.env['WEB3_WS_URL'] || ''
  const web3 = new Web3(new Web3.providers.WebsocketProvider(web3WsUrl))

  const web3LogSubscriber = new Web3LogSubscriber(web3)

  const logStore = new LogStore()
  const releaseDetector = new ReleaseDetector(logStore, sniper)

  const logMonitor = new LogMonitor(web3LogSubscriber, [logStore, releaseDetector])
  await logMonitor.start()
})()
