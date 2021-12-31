import {default as createLogger} from 'logging'

import {FeeCheckerCallback, FeeCheckerResult, IFeeChecker} from './ContractChecker'
import delay from './utils/Delay'

const logger = createLogger('FeeChecker')

export interface FeeResponse {
  address: string
  buyFee: number
  buyGas: number
  sellFee: number
  sellGas: number
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

  async check(address: string, onSuccess: FeeCheckerCallback, onFail: FeeCheckerCallback, timeout: number) {
    const startTime = Date.now()

    while (true) {
      logger.info(`Checking ${address}`)

      const response: FeeResponse = await this.feeProvider.check(address)

      const result: FeeCheckerResult = {
        address,
        buyFee: response.buyFee,
        buyGas: response.buyGas,
        sellFee: response.sellFee,
        sellGas: response.sellGas,
      }

      if (response.isHoneypot) {
        onFail({
          ...result,
          error: new Error('Honeypot!'),
        })
        return
      }

      if (response.error === undefined) {
        onSuccess(result)
        return
      }

      if (Date.now() - startTime >= timeout) {
        onFail({
          ...result,
          error: new Error('Timeout'),
        })
        return
      }

      await delay(1000)
    }
  }
}
