import Sniper, {IContractChecker} from '../../src/Sniper'
import {IExchanger} from '../../src/Exchanger'

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

class TestExchanger implements IExchanger {
  trade(_address: string): Promise<void> {
    return Promise.resolve()
  }
}

const address = '0x1'

test('Sends the contract to the exchanger when the contract passes the check', async () => {
  const exchanger = new TestExchanger()
  const sniper = new Sniper(new TestSuccessContractChecker(), exchanger)

  // @ts-ignore
  const trade = jest.spyOn(exchanger, 'trade')

  await sniper.add(address)

  expect(trade).toBeCalledWith(address)
})

test('Does nothing when the contract does not pass the check', async () => {
  const exchanger = new TestExchanger()
  const sniper = new Sniper(new TestFailContractChecker(), exchanger)

  // @ts-ignore
  const trade = jest.spyOn(exchanger, 'trade')

  await sniper.add(address)

  expect(trade).not.toBeCalled()
})
