import {default as createLogger} from 'logging'

import {FeeCheckerResult, IFeeChecker} from './ContractChecker'
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

  async check(address: string, timeout: number): Promise<FeeCheckerResult> {
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
        return Promise.resolve({
          ...result,
          error: new Error('Honeypot!'),
        })
      }

      if (response.error === undefined) {
        return Promise.resolve(result)
      }

      if (Date.now() - startTime >= timeout) {
        return Promise.resolve({
          ...result,
          error: new Error('Timeout'),
        })
      }

      await delay(1000)
    }
  }
}
