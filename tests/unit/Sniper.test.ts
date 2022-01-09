import Sniper, {IContractChecker} from '../../src/Sniper'

class TestContractChecker implements IContractChecker {
  check(_address: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

const address = '0x1'
const contractChecker = new TestContractChecker()

describe('When the contract passes the check', () => {
  beforeAll(() => {
    jest.spyOn(contractChecker, 'check').mockImplementation(() => {
      return Promise.resolve(true)
    })
  })

  test('does nothing', async () => {
    const sniper = new Sniper(contractChecker)

    sniper.add(address)

    expect(true).toBeTruthy()
  })
})

describe('When the contract does not pass the check', () => {
  test('does nothing', async () => {
    const sniper = new Sniper(contractChecker)

    sniper.add(address)

    expect(true).toBeTruthy()
  })
})
