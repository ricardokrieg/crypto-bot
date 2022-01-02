import Web3 from 'web3'
import {Log} from 'web3-core'

import Web3LogSubscriber from '../../src/Web3LogSubscriber'
import delay from '../../src/utils/Delay'

jest.setTimeout(15000)

let logCount: number = 0

const onLog = (_log: Log) => {
  logCount++
}

test('Forwards logs from web3', async () => {
  const url = 'wss://speedy-nodes-nyc.moralis.io/b93df11c78c36db2203d0a8f/bsc/mainnet/ws'
  const web3 = new Web3(new Web3.providers.WebsocketProvider(url))

  const web3LogSubscriber = new Web3LogSubscriber(web3)
  web3LogSubscriber.subscribe(onLog)

  await delay(10000)

  expect(logCount).toBeGreaterThanOrEqual(5)
})
