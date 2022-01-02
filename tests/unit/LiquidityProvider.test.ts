import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import BigNumber from 'bignumber.js'

import LiquidityProvider from '../../src/LiquidityProvider'
import EnhancedContract from '../../src/EnhancedContract'

const url = 'http://example.com'
const web3 = new Web3(new Web3.providers.HttpProvider(url))

const pancakeSwapContractAbi = '[{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
const pancakeSwapContract = new web3.eth.Contract(JSON.parse(pancakeSwapContractAbi) as AbiItem, '0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
const pancakeEnhancedContract = new EnhancedContract(pancakeSwapContract, 18)

const wbnbContractAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]'
const wbnbContract = new web3.eth.Contract(JSON.parse(wbnbContractAbi) as AbiItem, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
const wbnbEnhancedContract = new EnhancedContract(wbnbContract, 18)

const sampleContractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
const sampleContract = new web3.eth.Contract(JSON.parse(sampleContractAbi) as AbiItem, '0x00e1656e45f18ec6747f5a8496fd39b50b38396d')
const sampleEnhancedContract = new EnhancedContract(sampleContract, 9)

describe('When the Contract does not exist on PancakeSwap', () => {
  beforeEach(() => {
    jest.spyOn(pancakeEnhancedContract, 'getPair').mockImplementation(
      jest.fn(async (_address1: string, _address2) => {
        return Promise.resolve('0x0000000000000000000000000000000000000000')
      })
    )
  })

  test('Returns the appropriate error message', async () => {
    const liquidityProvider = new LiquidityProvider(pancakeEnhancedContract, wbnbEnhancedContract)

    const response = await liquidityProvider.check(sampleEnhancedContract)

    expect(response.error).toEqual(new Error(`Contract does not exist on PancakeSwap`))
  })
})

describe('When the Contract exists on PancakeSwap', () => {
  beforeEach(() => {
    jest.spyOn(pancakeEnhancedContract, 'getPair').mockImplementation(
      jest.fn(async (_address1: string, _address2) => {
        return Promise.resolve('0x1000000000000000000000000000000000000000')
      })
    )
  })

  describe('When the Contract has no liquidity due zero WBNB balance', () => {
    beforeEach(() => {
      jest.spyOn(wbnbEnhancedContract, 'balanceOf').mockImplementation(
        jest.fn(async (_address: string) => {
          return Promise.resolve(new BigNumber(0))
        })
      )
    })

    test('Returns the appropriate error message', async () => {
      const liquidityProvider = new LiquidityProvider(pancakeEnhancedContract, wbnbEnhancedContract)

      const response = await liquidityProvider.check(sampleEnhancedContract)

      expect(response.error).toEqual(new Error(`Contract does not have liquidity`))
    })
  })

  describe('When the Contract has no liquidity due zero Contract balance', () => {
    beforeEach(() => {
      jest.spyOn(wbnbEnhancedContract, 'balanceOf').mockImplementation(
        jest.fn(async (_address: string) => {
          return Promise.resolve(new BigNumber('12e+18'))
        })
      )

      jest.spyOn(sampleEnhancedContract, 'balanceOf').mockImplementation(
        jest.fn(async (_address: string) => {
          return Promise.resolve(new BigNumber('0'))
        })
      )
    })

    test('Returns the appropriate error message', async () => {
      const liquidityProvider = new LiquidityProvider(pancakeEnhancedContract, wbnbEnhancedContract)

      const response = await liquidityProvider.check(sampleEnhancedContract)

      expect(response.error).toEqual(new Error(`Contract does not have liquidity`))
    })
  })

  describe('When the Contract has liquidity', () => {
    beforeEach(() => {
      jest.spyOn(wbnbEnhancedContract, 'balanceOf').mockImplementation(
        jest.fn(async (_address: string) => {
          return Promise.resolve(new BigNumber('12e+18'))
        })
      )

      jest.spyOn(sampleEnhancedContract, 'balanceOf').mockImplementation(
        jest.fn(async (_address: string) => {
          return Promise.resolve(new BigNumber('6000000e+9'))
        })
      )
    })

    test('Returns the correct rate', async () => {
      const liquidityProvider = new LiquidityProvider(pancakeEnhancedContract, wbnbEnhancedContract)

      const response = await liquidityProvider.check(sampleEnhancedContract)

      expect(response.error).toBeUndefined()
      expect(response.rate).toEqual(new BigNumber('0.000002'))
    })
  })
})
