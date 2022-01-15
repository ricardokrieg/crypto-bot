import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import {Contract} from 'web3-eth-contract'

import EnhancedContract from '../../src/EnhancedContract'
import EnhancedContractBuilder, {IAbiFetcher, IDecimalsFetcher} from '../../src/EnhancedContractBuilder'

const url = 'http://example.com'
const web3 = new Web3(new Web3.providers.HttpProvider(url))

class TestAbiFetcher implements IAbiFetcher {
  fetchAbi(_address: string): Promise<AbiItem> {
    const abi = '[{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
    return Promise.resolve(JSON.parse(abi) as AbiItem)
  }
}

class TestDecimalsFetcher implements IDecimalsFetcher {
  fetchDecimals(_contract: Contract): Promise<number> {
    return Promise.resolve(9)
  }
}

test('builds an EnhancedContract', async () => {
  const enhancedContractBuilder = new EnhancedContractBuilder(web3, new TestAbiFetcher(), new TestDecimalsFetcher())

  const address = '0x33E55396FC29b0B9E1a14E93aF07DA951c17458F'
  const enhancedContract = await enhancedContractBuilder.build(address)

  expect(enhancedContract).toBeInstanceOf(EnhancedContract)
  expect(enhancedContract.decimals).toEqual(9)
})
