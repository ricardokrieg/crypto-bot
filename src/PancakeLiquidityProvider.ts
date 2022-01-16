import {default as createLogger} from 'logging'
import BigNumber from 'bignumber.js'

import {ILiquidityProvider} from './LiquidityChecker'
import {IEnhancedContract} from './EnhancedContract'
import {IEnhancedContractBuilder} from './EnhancedContractBuilder'

const logger = createLogger('LiquidityProvider')

const zero = new BigNumber(0)

export default class PancakeLiquidityProvider implements ILiquidityProvider {
  private readonly pancakeSwapContract: IEnhancedContract
  private readonly wbnbContract: IEnhancedContract
  private readonly enhancedContractBuilder: IEnhancedContractBuilder

  constructor(pancakeSwapContract: IEnhancedContract, wbnbContract: IEnhancedContract, enhancedContractBuilder: IEnhancedContractBuilder) {
    this.pancakeSwapContract = pancakeSwapContract
    this.wbnbContract = wbnbContract
    this.enhancedContractBuilder = enhancedContractBuilder
  }

  async check(address: string): Promise<BigNumber> {
    logger.info(`Checking ${address}`)

    const contract: IEnhancedContract = await this.enhancedContractBuilder.build(address)

    const pairAddress = await this.pancakeSwapContract.getPair(
      contract.address,
      this.wbnbContract.address
    )
    logger.info(`Pair Address: ${pairAddress}`)

    if (/^0x0+$/.test(pairAddress)) {
      logger.warn(`Contract does not exist on PancakeSwap`)

      return Promise.resolve(zero)
    }

    const wbnbBalance = await this.wbnbContract.balanceOf(pairAddress)
    const wbnbnCoinBalance = wbnbBalance.div(new BigNumber(10).pow(this.wbnbContract.decimals))
    logger.info(`WBNB Balance: ${wbnbBalance.toString(10)} (${wbnbnCoinBalance.toString(10)})`)

    if (wbnbBalance.isZero()) {
      return Promise.resolve(zero)
    }

    const balance = await contract.balanceOf(pairAddress)
    const coinBalance = balance.div(new BigNumber(10).pow(contract.decimals))
    logger.info(`Balance: ${balance.toString(10)} (${coinBalance.toString(10)})`)

    if (balance.isZero()) {
      return Promise.resolve(zero)
    }

    const rate = wbnbnCoinBalance.div(coinBalance)
    logger.info(`Rate: ${rate.toString(10)}`)

    return rate
  }
}
