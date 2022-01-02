import FeeChecker, {FeeResponse, IFeeProvider} from '../../src/FeeChecker'
import delay from '../../src/utils/Delay'
import {FeeCheckerResult} from '../../src/ContractChecker'

const contractAddress = '0x1'

class TestFeeProvider implements IFeeProvider {
  async check(address: string): Promise<FeeResponse> {
    return Promise.resolve({
      address,
      buyFee: 0,
      buyGas: 0,
      sellFee: 0,
      sellGas: 0,
      isHoneypot: false
    })
  }
}

const onSuccess = jest.fn((_result: FeeCheckerResult) => {})
const onFail = jest.fn((_result: FeeCheckerResult) => {})

const feeProvider = new TestFeeProvider()

afterEach(() => {
  jest.clearAllMocks()
})

describe('When the fee provider returns error', () => {
  beforeEach(() => {
    feeProvider.check = jest.fn((address) => {
      return Promise.resolve({
        address,
        buyFee: 90,
        buyGas: 1000000,
        sellFee: 0,
        sellGas: 1000000,
        isHoneypot: false,
        error: new Error('Buy Fee is too high: 90%')
      })
    })
  })

  test('Does not return immediately', async () => {
    const feeChecker = new FeeChecker(feeProvider)

    const promise = feeChecker.check(contractAddress, onSuccess, onFail, 2500)

    await delay(2000)

    expect(onSuccess).not.toBeCalled()
    expect(onFail).not.toBeCalled()

    await delay(2000)

    expect(onSuccess).not.toBeCalled()
    expect(onFail).toBeCalledWith({
      address: contractAddress,
      buyFee: 90,
      buyGas: 1000000,
      sellFee: 0,
      sellGas: 1000000,
      error: new Error('Timeout')
    })

    await promise
  })
})

describe('When the fee provider returns a Honeypot error', () => {
  beforeEach(() => {
    feeProvider.check = jest.fn((address) => {
      return Promise.resolve({
        address,
        buyFee: 0,
        buyGas: 0,
        sellFee: 0,
        sellGas: 0,
        isHoneypot: true,
        error: new Error('Honeypot!')
      })
    })
  })

  test('Calls the fail callback', async () => {
    const feeChecker = new FeeChecker(feeProvider)

    const promise = feeChecker.check(contractAddress, onSuccess, onFail, 5000)

    await delay(100)

    expect(onSuccess).not.toBeCalled()
    expect(onFail).toBeCalledWith({
      address: contractAddress,
      buyFee: 0,
      buyGas: 0,
      sellFee: 0,
      sellGas: 0,
      error: new Error('Honeypot!')
    })

    await promise
  })
})

describe('When the fee provider returns a successful response', () => {
  beforeEach(() => {
    feeProvider.check = jest.fn((address) => {
      return Promise.resolve({
        address,
        buyFee: 5,
        buyGas: 1500000,
        sellFee: 10,
        sellGas: 1800000,
        isHoneypot: false,
      })
    })
  })

  test('Calls the success callback', async () => {
    const feeChecker = new FeeChecker(feeProvider)

    const promise = feeChecker.check(contractAddress, onSuccess, onFail, 5000)

    await delay(100)

    expect(onSuccess).toBeCalledWith({
      address: contractAddress,
      buyFee: 5,
      buyGas: 1500000,
      sellFee: 10,
      sellGas: 1800000,
    })
    expect(onFail).not.toBeCalled()

    await promise
  })
})

