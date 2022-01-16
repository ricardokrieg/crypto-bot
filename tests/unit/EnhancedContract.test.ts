import Web3 from 'web3'

import {pancakeContract, pancakeEnhancedContract, wbnbContract, wbnbEnhancedContract} from '../support/Contract'

const url = 'http://example.com'
const web3 = new Web3(new Web3.providers.HttpProvider(url))

test('Exposes the address', () => {
  expect(pancakeEnhancedContract.address.toUpperCase())
    .toEqual('0xca143ce32fe78f1f7019d7d551a6402fc5350c73'.toUpperCase())
})

test('Exposes the decimals', () => {
  expect(pancakeEnhancedContract.decimals).toEqual(18)
})

test('Delegates getPair to contract', async () => {
  const call = jest.fn(() => {})
  jest.spyOn(pancakeContract.methods, 'getPair').mockImplementation(() => {
    return { call }
  })

  await pancakeEnhancedContract.getPair('0x1', '0x2')

  expect(pancakeContract.methods.getPair).toBeCalledWith('0x1', '0x2')
  expect(call).toBeCalled()
})

test('Delegates balanceOf to contract', async () => {
  const call = jest.fn(() => {})
  jest.spyOn(wbnbContract.methods, 'balanceOf').mockImplementation(() => {
    return { call }
  })

  await wbnbEnhancedContract.balanceOf('0x1')

  expect(wbnbContract.methods.balanceOf).toBeCalledWith('0x1')
  expect(call).toBeCalled()
})
