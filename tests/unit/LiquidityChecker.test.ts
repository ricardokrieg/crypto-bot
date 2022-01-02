import LiquidityChecker, {LiquidityResponse, ILiquidityProvider} from '../../src/LiquidityChecker'
import delay from '../../src/utils/Delay'
import {LiquidityCheckerResult} from '../../src/ContractChecker'
import EnhancedContract from '../../src/EnhancedContract'
import BigNumber from 'bignumber.js'
import {AbiItem} from 'web3-utils'
import Web3 from 'web3'

const url = 'http://example.com'
const web3 = new Web3(new Web3.providers.HttpProvider(url))

const sampleContractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
const sampleContract = new web3.eth.Contract(JSON.parse(sampleContractAbi) as AbiItem, '0x00e1656e45f18ec6747f5a8496fd39b50b38396d')
const sampleEnhancedContract = new EnhancedContract(sampleContract, 9)

class TestLiquidityProvider implements ILiquidityProvider {
  check(enhancedContract: EnhancedContract): Promise<LiquidityResponse> {
    return Promise.resolve({
      address: enhancedContract.address,
      rate: new BigNumber(0)
    })
  }
}

const liquidityProvider = new TestLiquidityProvider()

afterEach(() => {
  jest.clearAllMocks()
})

describe('When the liquidity provider returns error', () => {
  beforeEach(() => {
    liquidityProvider.check = jest.fn((enhancedContract: EnhancedContract) => {
      return Promise.resolve({
        address: enhancedContract.address,
        rate: new BigNumber(0),
        error: new Error('Contract does not exist on PancakeSwap')
      })
    })
  })

  test('Does not return immediately', async () => {
    const liquidityChecker = new LiquidityChecker(liquidityProvider)

    let done = false
    const promise = liquidityChecker.check(sampleEnhancedContract, 2500)
      .then((response) => {

      })
      .finally(() => done = true)

    await delay(2000)

    expect(done).toBeFalsy()

    await delay(2000)

    expect(done).toBeTruthy()

    await promise
  })
})

describe('When the liquidity provider returns a successful response', () => {
  beforeEach(() => {
    liquidityProvider.check = jest.fn((enhancedContract: EnhancedContract) => {
      return Promise.resolve({
        address: enhancedContract.address,
        rate: new BigNumber(0.002)
      })
    })
  })

  test('Calls the success callback', async () => {
    const liquidityChecker = new LiquidityChecker(liquidityProvider)

    const promise = liquidityChecker.check(sampleEnhancedContract, 5000)
      .then((response) => {
        expect(response).toEqual({
          address: sampleEnhancedContract.address,
          rate: new BigNumber(0.002)
        })
      })

    await promise
  })
})

