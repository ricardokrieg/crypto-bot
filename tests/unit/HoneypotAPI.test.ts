const axios = require('axios').default

import HoneypotAPI from '../../src/HoneypotAPI'
import {FeeResponse} from '../../src/FeeChecker'

const contractAddress = '0x1'
const honeypotAPI = new HoneypotAPI('http://example.com')

test('Returns the correct response based on the is.honeypot API response', async () => {
  axios.get = jest.fn((_url) => {
    return {
      data: {
        BuyGas: 1500000,
        BuyTax: 19,
        SellGas: 1800000,
        SellTax: 17,
        IsHoneypot: true,
      }
    }
  })

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    buyFee: 19,
    buyGas: 1500000,
    sellFee: 17,
    sellGas: 1800000,
    isHoneypot: true
  })
})
