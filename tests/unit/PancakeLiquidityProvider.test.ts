import BigNumber from 'bignumber.js'

import PancakeLiquidityProvider from '../../src/PancakeLiquidityProvider'
import {IEnhancedContract} from '../../src/EnhancedContract'
import {IEnhancedContractBuilder} from '../../src/EnhancedContractBuilder'

class TestSuccessEnhancedContract implements IEnhancedContract {
  public address: string = '0x2'
  public decimals: number = 18

  balanceOf(_address: string): Promise<BigNumber> {
    return Promise.resolve(new BigNumber('12e+18'))
  }

  getPair(_address1: string, _address2: string): Promise<string> {
    return Promise.resolve('0x1000000000000000000000000000000000000000')
  }
}

class TestSuccessEnhancedContractNineDecimals extends TestSuccessEnhancedContract {
  public decimals: number = 9

  balanceOf(_address: string): Promise<BigNumber> {
    return Promise.resolve(new BigNumber('6000000e+9'))
  }
}

class TestFailEnhancedContract implements IEnhancedContract {
  public address: string = '0x2'
  public decimals: number = 18

  balanceOf(_address: string): Promise<BigNumber> {
    return Promise.resolve(new BigNumber(0))
  }

  getPair(_address1: string, _address2: string): Promise<string> {
    return Promise.resolve('0x0000000000000000000000000000000000000000')
  }
}

class TestSuccessEnhancedContractBuilder implements IEnhancedContractBuilder {
  build(_address: string): Promise<IEnhancedContract> {
    return Promise.resolve(new TestSuccessEnhancedContractNineDecimals())
  }
}

class TestFailEnhancedContractBuilder implements IEnhancedContractBuilder {
  build(_address: string): Promise<IEnhancedContract> {
    return Promise.resolve(new TestFailEnhancedContract())
  }
}

const address = '0x1'

test('Returns zero when the contract does not exist on PancakeSwap', async () => {
  const pancakeSwapContract = new TestFailEnhancedContract()
  const wbnbContract = new TestSuccessEnhancedContract()
  const enhanchedContractBuilder = new TestSuccessEnhancedContractBuilder()

  const liquidityProvider = new PancakeLiquidityProvider(pancakeSwapContract, wbnbContract, enhanchedContractBuilder)

  const rate = await liquidityProvider.check(address)

  expect(rate).toEqual(new BigNumber(0))
})

test('Returns zero when WBNB has no balance for this contract', async () => {
  const pancakeSwapContract = new TestSuccessEnhancedContract()
  const wbnbContract = new TestFailEnhancedContract()
  const enhanchedContractBuilder = new TestSuccessEnhancedContractBuilder()

  const liquidityProvider = new PancakeLiquidityProvider(pancakeSwapContract, wbnbContract, enhanchedContractBuilder)

  const rate = await liquidityProvider.check(address)

  expect(rate).toEqual(new BigNumber(0))
})

test('Returns zero when the contract has no balance', async () => {
  const pancakeSwapContract = new TestSuccessEnhancedContract()
  const wbnbContract = new TestSuccessEnhancedContract()
  const enhanchedContractBuilder = new TestFailEnhancedContractBuilder()

  const liquidityProvider = new PancakeLiquidityProvider(pancakeSwapContract, wbnbContract, enhanchedContractBuilder)

  const rate = await liquidityProvider.check(address)

  expect(rate).toEqual(new BigNumber(0))
})

test('Returns the correct rate', async () => {
  const pancakeSwapContract = new TestSuccessEnhancedContract()
  const wbnbContract = new TestSuccessEnhancedContract()
  const enhanchedContractBuilder = new TestSuccessEnhancedContractBuilder()

  const liquidityProvider = new PancakeLiquidityProvider(pancakeSwapContract, wbnbContract, enhanchedContractBuilder)

  const rate = await liquidityProvider.check(address)

  expect(rate).toEqual(new BigNumber('0.000002'))
})
