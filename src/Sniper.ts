import {default as createLogger} from 'logging'

import {IExchanger} from './Exchanger'

const logger = createLogger('Sniper')

export interface ISniper {
  add: (address: string) => Promise<void>
}

export interface IContractChecker {
  check: (address: string) => Promise<boolean>
}

export default class Sniper implements ISniper {
  private readonly contractChecker: IContractChecker
  private readonly exchanger: IExchanger

  constructor(contractChecker: IContractChecker, exchanger: IExchanger) {
    this.contractChecker = contractChecker
    this.exchanger = exchanger
  }

  async add(address: string) {
    logger.info(`Starting ${address}`)

    const success = await this.contractChecker.check(address)

    if (success) {
      logger.info(`Contract ${address} is ready!`)
      this.exchanger.trade(address).then(() => {})
    } else {
      logger.warn(`Contract ${address} failed the check`)
    }

    return Promise.resolve()
  }
}
