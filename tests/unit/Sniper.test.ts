import Sniper, {IContractChecker, IEnhancedContractBuilder} from '../../src/Sniper'
import EnhancedContract from '../../src/EnhancedContract'
import {AbiItem} from 'web3-utils'
import Web3 from 'web3'

class TestContractChecker implements IContractChecker {
  check(_enhancedContract: EnhancedContract): Promise<boolean> {
    return Promise.resolve(true)
  }
}

class TestEnhancedContractBuilder implements IEnhancedContractBuilder {
  build(_address: string): Promise<EnhancedContract> {
    const url = 'https://example.com'
    const web3 = new Web3(new Web3.providers.HttpProvider(url))

    const contractAbi = '[{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
    const contract = new web3.eth.Contract(
      JSON.parse(contractAbi) as AbiItem[],
      '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    )
    return Promise.resolve(new EnhancedContract(contract, 18))
  }
}

const address = '0x1'
const contractChecker = new TestContractChecker()
const enhancedContractBuilder = new TestEnhancedContractBuilder()

describe('When the contract passes the check', () => {
  beforeAll(() => {
    jest.spyOn(contractChecker, 'check').mockImplementation(() => {
      return Promise.resolve(true)
    })
  })

  test('does nothing', async () => {
    const sniper = new Sniper(contractChecker, enhancedContractBuilder)

    sniper.onRelease({ address })

    expect(true).toBeTruthy()
  })
})

describe('When the contract does not pass the check', () => {
  test('does nothing', async () => {
    const sniper = new Sniper(contractChecker, enhancedContractBuilder)

    sniper.onRelease({ address })

    expect(true).toBeTruthy()
  })
})
