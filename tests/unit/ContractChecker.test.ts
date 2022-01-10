import ContractChecker, {IChecker} from '../../src/ContractChecker'

class TestSuccessChecker implements IChecker {
  check(_address: string, _timeout: number): Promise<boolean> {
    return Promise.resolve(true)
  }
}

class TestFailChecker implements IChecker {
  check(_address: string, _timeout: number): Promise<boolean> {
    return Promise.resolve(false)
  }
}

const address = '0x1'

test('returns true if both checkers returns true', async () => {
  const feeChecker = new TestSuccessChecker()
  const liquidityChecker = new TestSuccessChecker()

  const contractChecker = new ContractChecker(feeChecker, liquidityChecker)

  const success = await contractChecker.check(address)

  expect(success).toBeTruthy()
})

test('returns false if one checker returns false', async () => {
  const feeChecker = new TestSuccessChecker()
  const liquidityChecker = new TestFailChecker()

  const contractChecker = new ContractChecker(feeChecker, liquidityChecker)

  const success = await contractChecker.check(address)

  expect(success).toBeFalsy()
})
