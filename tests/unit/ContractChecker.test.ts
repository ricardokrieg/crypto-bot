import ContractChecker from '../../src/ContractChecker'
import delay from '../../src/utils/Delay'

const contractAddress = '0x1'

const onSuccess = jest.fn((address: string) => {})
const onFail = jest.fn((address: string) => {})

describe('When the contract has no liquidity and fees are high', () => {
  test('Does not return immediately', async () => {
    const contractChecker = new ContractChecker()

    contractChecker.check(contractAddress, onSuccess, onFail)

    await delay(2000)

    expect(onSuccess).not.toBeCalled()
    expect(onFail).not.toBeCalled()
  })
})
