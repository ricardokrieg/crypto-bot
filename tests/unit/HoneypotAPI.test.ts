const axios = require('axios').default

import HoneypotAPI from '../../src/HoneypotAPI'
import {FeeResponse} from '../../src/FeeChecker'

const contractAddress = '0x1'

describe('When fees are high', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 1500000,
          BuyTax: 90,
          SellGas: 1800000,
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
      buyGas: 1500000,
      sellFee: 80,
      sellGas: 1800000,
      isHoneypot: false,
      error: new Error('Buy Fee is too high: 90%'),
    })
  })
})

describe('When gas are high', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 1500000,
          BuyTax: 10,
          SellGas: 2100000,
          SellTax: 10,
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
      buyFee: 10,
      buyGas: 1500000,
      sellFee: 10,
      sellGas: 2100000,
      isHoneypot: false,
      error: new Error('Sell Gas is too high: 2100000'),
    })
  })
})

describe('When fees are low', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 1500000,
          BuyTax: 19,
          SellGas: 1800000,
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
      buyGas: 1500000,
      sellFee: 18,
      sellGas: 1800000,
      isHoneypot: false,
    })
  })
})

describe('When the address is a Honeypot', () => {
  beforeEach(() => {
    axios.get = jest.fn((_url) => {
      return {
        data: {
          BuyGas: 1500000,
          BuyTax: 0,
          SellGas: 1800000,
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
      buyGas: 1500000,
      sellFee: 0,
      sellGas: 1800000,
      isHoneypot: true,
      error: new Error('Honeypot!'),
    })
  })
})
