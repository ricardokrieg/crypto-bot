const axios = require('axios').default

import HoneypotAPI from '../../src/HoneypotAPI'
import {FeeResponse} from '../../src/FeeChecker'

const contractAddress = '0x1'
const honeypotAPI = new HoneypotAPI('http://example.com')

test('Returns the correct response when contract has high fees', async () => {
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

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    buyFee: 90,
    buyGas: 1500000,
    sellFee: 80,
    sellGas: 1800000,
    isHoneypot: false
  })
})

test('Returns the correct response when contract has high gas', async () => {
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

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    buyFee: 10,
    buyGas: 1500000,
    sellFee: 10,
    sellGas: 2100000,
    isHoneypot: false
  })
})

test('Returns the correct response when the contract is valid', async () => {
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

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    buyFee: 19,
    buyGas: 1500000,
    sellFee: 18,
    sellGas: 1800000,
    isHoneypot: false
  })
})

test('Returns the correct response when the contract is a honeypot', async () => {
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

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    buyFee: 0,
    buyGas: 1500000,
    sellFee: 0,
    sellGas: 1800000,
    isHoneypot: true
  })
})
