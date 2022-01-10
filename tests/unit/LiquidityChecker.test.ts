import LiquidityChecker, {ILiquidityProvider} from '../../src/LiquidityChecker'
import delay from '../../src/utils/Delay'
import BigNumber from 'bignumber.js'

class TestSuccessLiquidityProvider implements ILiquidityProvider {
  check(_address: string): Promise<BigNumber> {
    return Promise.resolve(new BigNumber(0.002))
  }
}

class TestFailLiquidityProvider implements ILiquidityProvider {
  check(_address: string): Promise<BigNumber> {
    return Promise.resolve(new BigNumber(0))
  }
}

const contractAddress = '0x1'

test('Returns true when the contract is valid', async () => {
  const liquidityProvider = new TestSuccessLiquidityProvider()
  const liquidityChecker = new LiquidityChecker(liquidityProvider)

  const success = await liquidityChecker.check(contractAddress, 5000)

  expect(success).toBeTruthy()
})

test('Returns false when the contract has no liquidity', async () => {
  const liquidityProvider = new TestFailLiquidityProvider()
  const liquidityChecker = new LiquidityChecker(liquidityProvider)

  let done = false
  liquidityChecker
    .check(contractAddress, 2500)
    .then((response) => {
      expect(response).toBeFalsy()
    })
    .finally(() => done = true)

  await delay(2000)

  expect(done).toBeFalsy()

  await delay(2000)

  expect(done).toBeTruthy()
})

