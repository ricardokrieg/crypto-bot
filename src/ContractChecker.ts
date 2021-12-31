import {default as createLogger} from 'logging'

import {IContractChecker} from './Sniper'

const logger = createLogger('ContractChecker')

export type FeeCheckerResult = {
  address: string
  buyFee: number
  buyGas: number
  sellFee: number
  sellGas: number
  error?: Error
}
export type FeeCheckerCallback = (response: FeeCheckerResult) => void

export interface IFeeChecker {
  check: (address: string, onSuccess: FeeCheckerCallback, onFail: FeeCheckerCallback, timeout: number) => void
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

  onFeeSuccess(result: FeeCheckerResult) {
    logger.info(`Successful Fee Response for ${result.address}`)
    logger.info(`Buy Fee:  ${result.buyFee}%`)
    logger.info(`Buy Gas:  ${result.buyGas}%`)
    logger.info(`Sell Fee: ${result.sellFee}%`)
    logger.info(`Sell Gas: ${result.sellGas}%`)
  }

  onFeeFail(result: FeeCheckerResult) {
    logger.warn(`Failed Fee Response for ${result.address}`)
    logger.warn(`Buy Fee:  ${result.buyFee}%`)
    logger.warn(`Buy Gas:  ${result.buyGas}%`)
    logger.warn(`Sell Fee: ${result.sellFee}%`)
    logger.warn(`Sell Gas: ${result.sellGas}%`)
    logger.warn(`Error: ${result.error?.message}%`)
  }
}
