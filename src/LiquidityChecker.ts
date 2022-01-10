import {default as createLogger} from 'logging'
import BigNumber from 'bignumber.js'

import {IChecker} from './ContractChecker'
import delay from './utils/Delay'

const logger = createLogger('LiquidityChecker')

export interface ILiquidityProvider {
  check: (address: string) => Promise<BigNumber>
}

export default class LiquidityChecker implements IChecker {
  private readonly liquidityProvider: ILiquidityProvider

  constructor(liquidityProvider: ILiquidityProvider) {
    this.liquidityProvider = liquidityProvider
  }

  async check(address: string, timeout: number): Promise<boolean> {
    const startTime = Date.now()

    while (true) {
      logger.info(`Checking ${address}`)

      const rate: BigNumber = await this.liquidityProvider.check(address)

      if (!rate.isZero()) {
        return Promise.resolve(true)
      }

      if (Date.now() - startTime >= timeout) {
        return Promise.resolve(false)
      }

      await delay(1000)
    }
  }
}
