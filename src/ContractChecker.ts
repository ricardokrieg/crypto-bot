import {default as createLogger} from 'logging'

import {IContractChecker} from './Sniper'

const logger = createLogger('ContractChecker')

export type FeeCheckerSuccessCallback = (address: string, buyFee: number, sellFee: number) => void
export type FeeCheckerFailCallback = (address: string, buyFee: number, sellFee: number, error: Error) => void

export interface IFeeChecker {
  check: (address: string, onSuccess: FeeCheckerSuccessCallback, onFail: FeeCheckerFailCallback, timeout: number) => void
}

export default class ContractChecker implements IContractChecker {
  private readonly feeChecker: IFeeChecker

  constructor(feeChecker: IFeeChecker) {
    this.feeChecker = feeChecker
  }

  async check(address: string, onSuccess: (address: string) => void, onFail: (address: string) => void) {
    const feePromise = this.feeChecker.check(address, this.onFeeSuccess, this.onFeeFail, 5000)

    await feePromise
  }

  onFeeSuccess(address: string, buyFee: number, sellFee: number) {
    logger.info(`Successful Fee Response for ${address}`)
    logger.info(`Buy Fee:  ${buyFee}%`)
    logger.info(`Sell Fee: ${sellFee}%`)
  }

  onFeeFail(address: string, buyFee: number, sellFee: number, error: Error) {
    logger.warn(`Failed Fee Response for ${address}`)
    logger.warn(`Buy Fee:  ${buyFee}%`)
    logger.warn(`Sell Fee: ${sellFee}%`)
    logger.warn(`Error: ${error.message}%`)
  }
}
