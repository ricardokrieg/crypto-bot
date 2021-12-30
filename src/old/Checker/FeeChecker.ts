import {default as createLogger} from 'logging'

import Checker, {CheckRequest, CheckResult} from './Checker'
import HoneypotAPI from '../HoneypotAPI'

const logger = createLogger('FeeChecker')

export interface FeeCheckRequest extends CheckRequest {
  address: string
  blockLimit: number
  minBuyFee: number
  minSellFee: number
}

export default class FeeChecker extends Checker {
  async doCheck(request: FeeCheckRequest, blockNumber: number): Promise<CheckResult> {
    logger.info(`Block: ${blockNumber} / ${request.blockLimit}`)

    const result = await HoneypotAPI.instance.report(request.address)
    logger.info(result)

    if (result.IsHoneypot) {
      return CheckResult.FALSE
    }

    if (result.BuyTax <= request.minBuyFee && result.SellTax <= request.minSellFee) {
      return CheckResult.TRUE
    }

    return CheckResult.WAIT
  }
}
