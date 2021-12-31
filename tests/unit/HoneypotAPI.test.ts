const axios = require('axios').default

import HoneypotAPI from '../../src/HoneypotAPI'
import {FeeResponse} from '../../src/FeeChecker'

const contractAddress = '0x1'

describe('When fees are high', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 0,
          BuyTax: 90,
          SellGas: 0,
          SellTax: 80,
          IsHoneypot: false,
        }
      }
    })
  })

  test('Returns the appropriate error message', async () => {
    const honeypotAPI = new HoneypotAPI()

    const response: FeeResponse = await honeypotAPI.check(contractAddress)

    expect(response).toEqual({
      address: contractAddress,
      buyFee: 90,
      sellFee: 80,
      isHoneypot: false,
      error: new Error('Buy Fee is too high: 90%'),
    })
  })
})

describe('When fees are low', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 0,
          BuyTax: 19,
          SellGas: 0,
          SellTax: 18,
          IsHoneypot: false,
        }
      }
    })
  })

  test('Returns a successful response', async () => {
    const honeypotAPI = new HoneypotAPI()

    const response: FeeResponse = await honeypotAPI.check(contractAddress)

    expect(response).toEqual({
      address: contractAddress,
      buyFee: 19,
      sellFee: 18,
      isHoneypot: false,
    })
  })
})

describe('When the address is a Honeypot', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 0,
          BuyTax: 0,
          SellGas: 0,
          SellTax: 0,
          IsHoneypot: true,
        }
      }
    })
  })

  test('Returns the appropriate error message', async () => {
    const honeypotAPI = new HoneypotAPI()

    const response: FeeResponse = await honeypotAPI.check(contractAddress)

    expect(response).toEqual({
      address: contractAddress,
      buyFee: 0,
      sellFee: 0,
      isHoneypot: true,
      error: new Error('Honeypot!'),
    })
  })
})
