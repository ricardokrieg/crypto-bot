import {default as createLogger} from 'logging'

import Checker, {CheckRequest, CheckResult} from './Checker'
import Contract from "../old/contract";
import BigNumber from "bignumber.js";
import Utils from "../old/utils";

const logger = createLogger('LiquidityChecker')

export interface LiquidityCheckRequest extends CheckRequest {}

export default class LiquidityChecker extends Checker {
  private tokenContract?: Contract
  private wbnbContract?: Contract
  private pancakeContract?: Contract

  constructor(request: CheckRequest) {
    super(request)
  }

  async doCheck(request: LiquidityCheckRequest, blockNumber: number): Promise<CheckResult> {
    logger.info(`Block: ${blockNumber} / ${request.blockLimit}`)

    if (this.pairAddress === undefined) {
      await this.getPair(request.address)
    }

    return CheckResult.WAIT
  }

  private async getPair(address: string) {
    logger.info(`Fetching Pair Address for ${address} x WBNB`)

    const pairAddress = await this._pancakeFactoryContract.getPair(contract.address, this.wbnbAddress)

    logger.info(`Pair Address: ${pairAddress}`)

    if (/^0x0+$/.test(pairAddress)) {
      throw new Error(`Contract ${contract.symbol} not listed on PancakeSwap`)
    }

    return pairAddress
  }
}


async getRate(contract: Contract, pairAddress?: string, skipLogs: boolean = false): Promise<BigNumber> {
const tokenBalance = await this.tokenBalance(contract, pairAddress, skipLogs)

if (tokenBalance.isZero()) {
  throw new Error(`Contract ${contract.symbol} does not have liquidity`)
}

const wbnbBalance = await this.tokenBalance(this._wbnbContract, pairAddress, skipLogs)

if (wbnbBalance.isZero()) {
  throw new Error(`Contract ${contract.symbol} does not have liquidity`)
}

const rate = Utils.amountFromWeiToCoin(wbnbBalance, 18).div(Utils.amountFromWeiToCoin(tokenBalance, contract.decimals))

  logger.info(`Rate: ${rate.toString(10)}`)
  const price = this.getPrice(rate)
  logger.info(`${contract.symbol} = $${price.toString(10)}`)
