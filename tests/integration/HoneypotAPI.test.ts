require('dotenv').config({ path: '.env' })

import HoneypotAPI from '../../src/HoneypotAPI'
import {FeeResponse} from '../../src/FeeChecker'

const url = process.env['HONEYPOT_API_URl'] || ''
const honeypotAPI = new HoneypotAPI(url)

test('Returns the correct response when contract has high fees', async () => {
  const contractAddress = '0xB97f20eE047004ee59a06D941F53b01458e486CF' // OX XRP

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    'buyFee': 0,
    'buyGas': 722763,
    'isHoneypot': false,
    'sellFee': 47.2,
    'sellGas': 521161
  })
})

test('Returns the correct response when the contract is valid', async () => {
  const contractAddress = '0x00e1656e45f18ec6747f5a8496fd39b50b38396d' // BCOIN

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response).toEqual({
    'buyFee': 0,
    'buyGas': 140618,
    'isHoneypot': false,
    'sellFee': 0,
    'sellGas': 125139
  })
})

test('Returns the correct response when the contract is a honeypot', async () => {
  const contractAddress = '0x8c91B0900f3bd0049dEdcc391D2b37D0a1F2cD1e' // GZT

  const response: FeeResponse = await honeypotAPI.check(contractAddress)

  expect(response.isHoneypot).toBeTruthy()
  expect(response).toEqual({
    'buyFee': 0,
    'buyGas': 0,
    'isHoneypot': true,
    'sellFee': 0,
    'sellGas': 0
  })
})
