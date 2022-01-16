import {default as createLogger} from 'logging'

const logger = createLogger('Sniper')

export interface ISniper {
  add: (address: string) => void
}

export interface IContractChecker {
  check: (address: string) => Promise<boolean>
}

export default class Sniper implements ISniper {
  private readonly contractChecker: IContractChecker

  constructor(contractChecker: IContractChecker) {
    this.contractChecker = contractChecker
  }

  add(address: string) {
    logger.info(`Starting ${address}`)

    this.contractChecker.check(address)
      .then((success) => {
        if (success) {
          logger.info(`Contract ${address} is ready!`)
        } else {
          logger.warn(`Contract ${address} failed the check`)
        }
      })
  }
}
