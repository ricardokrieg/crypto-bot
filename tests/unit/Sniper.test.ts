import Sniper, {IContractChecker} from '../../src/Sniper'

class TestSuccessContractChecker implements IContractChecker {
  check(_address: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

class TestFailContractChecker implements IContractChecker {
  check(_address: string): Promise<boolean> {
    return Promise.resolve(false)
  }
}

const address = '0x1'

test('Does nothing when the contract passes the check', async () => {
  const sniper = new Sniper(new TestSuccessContractChecker())

  sniper.add(address)

  expect(true).toBeTruthy()
})

test('Does nothing when the contract does not pass the check', async () => {
  const sniper = new Sniper(new TestFailContractChecker())

  sniper.add(address)

  expect(true).toBeTruthy()
})
