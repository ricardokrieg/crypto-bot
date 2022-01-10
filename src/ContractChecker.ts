import {default as createLogger} from 'logging'

import {IContractChecker} from './Sniper'

const logger = createLogger('ContractChecker')

export interface IChecker {
  check: (address: string, timeout: number) => Promise<boolean>
}

export default class ContractChecker implements IContractChecker {
  private readonly feeChecker: IChecker
  private readonly liquidityChecker: IChecker

  constructor(feeChecker: IChecker, liquidityChecker: IChecker) {
    this.feeChecker = feeChecker
    this.liquidityChecker = liquidityChecker
  }

  async check(address: string): Promise<boolean> {
    logger.info(`Calling feeChecker with ${address}`)
    const feePromise = this.feeChecker.check(address, 5000)

    logger.info(`Calling liquidityChecker with ${address}`)
    const liquidityPromise = this.liquidityChecker.check(address, 5000)

    const feeSuccess = await feePromise
    const liquiditySuccess = await liquidityPromise

    return Promise.resolve(feeSuccess && liquiditySuccess)
  }
}
