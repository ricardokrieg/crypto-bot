const axios = require('axios').default

import HoneypotAPI from '../../src/HoneypotAPI'
import {FeeResponse} from '../../src/FeeChecker'

describe('When fees are high', () => {
  test('Returns the appropriate error message', async () => {
    const contractAddress = '0xB97f20eE047004ee59a06D941F53b01458e486CF' // OX XRP
    const honeypotAPI = new HoneypotAPI()

    const response: FeeResponse = await honeypotAPI.check(contractAddress)

    expect(response.error).toEqual(
      new Error('Sell Fee is too high: 47.2%')
    )
  })
})

describe('When fees are low', () => {
  test('Returns a successful response', async () => {
    const contractAddress = '0x00e1656e45f18ec6747f5a8496fd39b50b38396d' // BCOIN
    const honeypotAPI = new HoneypotAPI()

    const response: FeeResponse = await honeypotAPI.check(contractAddress)

    expect(response.error).toBeUndefined()
  })
})

describe('When the address is a Honeypot', () => {
  test('Returns the appropriate error message', async () => {
    const contractAddress = '0x8c91B0900f3bd0049dEdcc391D2b37D0a1F2cD1e' // GZT
    const honeypotAPI = new HoneypotAPI()

    const response: FeeResponse = await honeypotAPI.check(contractAddress)

    expect(response.isHoneypot).toBeTruthy()
    expect(response.error).toEqual(
      new Error('Honeypot!')
    )
  })
})
