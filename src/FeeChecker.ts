import {default as createLogger} from 'logging'

import {FeeCheckerFailCallback, FeeCheckerSuccessCallback, IFeeChecker} from './ContractChecker'
import delay from './utils/Delay'

const logger = createLogger('FeeChecker')

export interface FeeResponse {
  address: string
  buyFee: number
  sellFee: number
  isHoneypot: boolean
  error?: Error
}

export interface IFeeProvider {
  check: (address: string) => Promise<FeeResponse>
}

export default class FeeChecker implements IFeeChecker {
  private readonly feeProvider: IFeeProvider

  constructor(feeProvider: IFeeProvider) {
    this.feeProvider = feeProvider
  }

  async check(address: string, onSuccess: FeeCheckerSuccessCallback, onFail: FeeCheckerFailCallback, timeout: number) {
    const startTime = Date.now()

    while (true) {
      logger.info(`Checking ${address}`)

      const response: FeeResponse = await this.feeProvider.check(address)

      if (response.isHoneypot) {
        onFail(
          address,
          response.buyFee,
          response.sellFee,
          new Error('Honeypot!'),
        )
        return
      }

      if (response.error === undefined) {
        onSuccess(
          address,
          response.buyFee,
          response.sellFee
        )
        return
      }

      if (Date.now() - startTime >= timeout) {
        onFail(
          address,
          0,
          0,
          new Error('Timeout'),
        )
        return
      }

      await delay(1000)
    }
  }
}
