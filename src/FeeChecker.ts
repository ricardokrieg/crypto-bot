import {default as createLogger} from 'logging'

import {IChecker} from './ContractChecker'
import delay from './utils/Delay'

const logger = createLogger('FeeChecker')

export interface FeeResponse {
  buyFee: number
  buyGas: number
  sellFee: number
  sellGas: number
  isHoneypot: boolean
}

export interface IFeeProvider {
  check: (address: string) => Promise<FeeResponse>
}

export default class FeeChecker implements IChecker {
  private readonly feeProvider: IFeeProvider

  constructor(feeProvider: IFeeProvider) {
    this.feeProvider = feeProvider
  }

  async check(address: string, timeout: number): Promise<boolean> {
    const startTime = Date.now()

    while (true) {
      logger.info(`Checking ${address}`)

      try {
        const response: FeeResponse = await this.feeProvider.check(address)

        if (!response.isHoneypot &&
             response.buyFee <= 20 && response.sellFee <= 20 &&
             response.buyGas <= 2000000 && response.sellGas <= 2000000) {
          return Promise.resolve(true)
        }
      } catch (e: any) {
        return Promise.resolve(false)
      }

      if (Date.now() - startTime >= timeout) {
        return Promise.resolve(false)
      }

      await delay(1000)
    }
  }
}
