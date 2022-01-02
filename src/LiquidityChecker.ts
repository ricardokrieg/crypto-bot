import {default as createLogger} from 'logging'
import BigNumber from 'bignumber.js'

import {LiquidityCheckerResult, ILiquidityChecker} from './ContractChecker'
import delay from './utils/Delay'
import EnhancedContract from './EnhancedContract'

const logger = createLogger('LiquidityChecker')

export interface LiquidityResponse {
  address: string
  rate: BigNumber
  error?: Error
}

export interface ILiquidityProvider {
  check: (contract: EnhancedContract) => Promise<LiquidityResponse>
}

export default class LiquidityChecker implements ILiquidityChecker {
  private readonly liquidityProvider: ILiquidityProvider

  constructor(liquidityProvider: ILiquidityProvider) {
    this.liquidityProvider = liquidityProvider
  }

  async check(enhancedContract: EnhancedContract, timeout: number): Promise<LiquidityCheckerResult> {
    const startTime = Date.now()

    while (true) {
      logger.info(`Checking ${enhancedContract.address}`)

      const response: LiquidityResponse = await this.liquidityProvider.check(enhancedContract!)
      const result: LiquidityCheckerResult = response

      if (response.error === undefined) {
        return Promise.resolve(result)
      } else {
        logger.warn(response.error.message)
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
