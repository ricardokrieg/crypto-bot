import {default as createLogger} from 'logging'
import BigNumber from 'bignumber.js'

import {ILiquidityProvider, LiquidityResponse} from './LiquidityChecker'
import EnhancedContract from './EnhancedContract'

const logger = createLogger('LiquidityProvider')

export default class LiquidityProvider implements ILiquidityProvider {
  private readonly pancakeSwapContract: EnhancedContract
  private readonly wbnbContract: EnhancedContract

  constructor(pancakeSwapContract: EnhancedContract, wbnbContract: EnhancedContract) {
    this.pancakeSwapContract = pancakeSwapContract
    this.wbnbContract = wbnbContract
  }

  async check(contract: EnhancedContract): Promise<LiquidityResponse> {
    logger.info(`Checking ${contract.address}`)

    const response: LiquidityResponse = {
      address: contract.address,
      rate: new BigNumber(0)
    }

    const pairAddress = await this.pancakeSwapContract.getPair(
      contract.address,
      this.wbnbContract.address
    )
    logger.info(`Pair Address: ${pairAddress}`)

    if (/^0x0+$/.test(pairAddress)) {
      return {
        ...response,
        error: new Error(`Contract does not exist on PancakeSwap`)
      }
    }

    const wbnbBalance = await this.wbnbContract.balanceOf(pairAddress)
    const wbnbnCoinBalance = wbnbBalance.div(new BigNumber(10).pow(this.wbnbContract.decimals))
    logger.info(`WBNB Balance: ${wbnbBalance.toString()} (${wbnbnCoinBalance.toString()})`)

    if (wbnbBalance.isZero()) {
      return {
        ...response,
        error: new Error(`Contract does not have liquidity`)
      }
    }

    const balance = await contract.balanceOf(pairAddress)
    const coinBalance = balance.div(new BigNumber(10).pow(contract.decimals))
    logger.info(`Balance: ${balance.toString()} (${coinBalance.toString()})`)

    if (balance.isZero()) {
      return {
        ...response,
        error: new Error(`Contract does not have liquidity`)
      }
    }

    const rate = wbnbnCoinBalance.div(coinBalance)
    logger.info(`Rate: ${rate.toString()}`)

    return {
      ...response,
      rate,
    }
  }
}
