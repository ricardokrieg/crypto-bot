import {Log} from 'web3-core'
import Web3 from 'web3'

import Web3LogSubscriber from '../../src/Web3LogSubscriber'
import {generateLog} from '../support/Log'

test('Forwards logs from web3', async () => {
  const url = 'wss://example.com'
  const web3 = new Web3(new Web3.providers.WebsocketProvider(url))

  const log = generateLog()

  // @ts-ignore
  jest.spyOn(web3.eth, 'subscribe').mockImplementation((type: any, options: any, callback: any) => {
    callback(null, log)
  })

  const onLog = jest.fn((_log: Log) => {})

  const web3LogSubscriber = new Web3LogSubscriber(web3)
  web3LogSubscriber.subscribe(onLog)

  expect(onLog).toBeCalledWith(log)
})
