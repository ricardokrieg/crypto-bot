import Web3 from 'web3'
import BigNumber from 'bignumber.js'

import {pancakeEnhancedContract, wbnbEnhancedContract} from '../support/Contract'

const url = 'https://speedy-nodes-nyc.moralis.io/b93df11c78c36db2203d0a8f/bsc/mainnet'
const web3 = new Web3(new Web3.providers.HttpProvider(url))

test('Delegates getPair to contract', async () => {
  const bcoinAddress = '0x00e1656e45f18ec6747f5a8496fd39b50b38396d'

  const pairAddress = await pancakeEnhancedContract.getPair(bcoinAddress, wbnbEnhancedContract.address)

  expect(pairAddress.toUpperCase()).toEqual('0x2eebe0c34da9ba65521e98cbaa7d97496d05f489'.toUpperCase())
})

test('Delegates balanceOf to contract', async () => {
  const bcoinWbnbPairAddress = '0x2eebe0c34da9ba65521e98cbaa7d97496d05f489'

  const balance = await wbnbEnhancedContract.balanceOf(bcoinWbnbPairAddress)

  expect(balance.gt(new BigNumber(0))).toBeTruthy()
})
