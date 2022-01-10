import FeeChecker, {FeeResponse, IFeeProvider} from '../../src/FeeChecker'
import delay from '../../src/utils/Delay'

const contractAddress = '0x1'

class TestSuccessFeeProvider implements IFeeProvider {
  async check(_address: string): Promise<FeeResponse> {
    return Promise.resolve({
      buyFee: 0,
      buyGas: 0,
      sellFee: 0,
      sellGas: 0,
      isHoneypot: false
    })
  }
}

class TestHighBuyFeeProvider implements IFeeProvider {
  async check(_address: string): Promise<FeeResponse> {
    return Promise.resolve({
      buyFee: 95,
      buyGas: 0,
      sellFee: 0,
      sellGas: 0,
      isHoneypot: false
    })
  }
}

class TestHoneypotFeeProvider implements IFeeProvider {
  async check(_address: string): Promise<FeeResponse> {
    return Promise.resolve({
      buyFee: 0,
      buyGas: 0,
      sellFee: 0,
      sellGas: 0,
      isHoneypot: true
    })
  }
}

test('Returns true when the contract is valid', async () => {
  const feeProvider = new TestSuccessFeeProvider()
  const feeChecker = new FeeChecker(feeProvider)

  const success = await feeChecker.check(contractAddress, 5000)

  expect(success).toBeTruthy()
})

test('Returns false when the contract has high fees', async () => {
  const feeProvider = new TestHighBuyFeeProvider()
  const feeChecker = new FeeChecker(feeProvider)

  let done = false
  feeChecker
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

test('Returns false when the contract is a honeypot', async () => {
  const feeProvider = new TestHoneypotFeeProvider()
  const feeChecker = new FeeChecker(feeProvider)

  let done = false
  feeChecker
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
