import { Contract as Web3Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import createLogger from 'logging'
import * as util from 'util'
import { pick } from 'lodash'
import BigNumber from 'bignumber.js'

import Web3Builder from './web3_builder'
import BscScanApi from './bsc_scan_api'
import Utils from './utils'

const logger = createLogger('contract')

class Contract {
  readonly address: string
  readonly isBEP20: boolean

  private _contract: Web3Contract | null
  private _decimals: number
  private _symbol: string
  private _name: string

  constructor(address: string, isBEP20: boolean = true) {
    this.address = address
    this.isBEP20 = isBEP20

    this._contract = null

    this._decimals = 18
    this._symbol = 'UNKNOWN'
    this._name = 'UNKNOWN'
  }

  async fetchContract(): Promise<void> {
    logger.info(`Fetching contract for ${this.address}`)

    const contractAbi = await BscScanApi.instance.contractAbi(this.address)
    this._contract = new Web3Builder.instance.web3.eth.Contract(JSON.parse(contractAbi) as AbiItem, this.address)
  }

  async allEvents(onData: (event: any) => void, onError: (e: any) => void) {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    this._contract.events.allEvents()
      .on('data', onData)
      .on('error', onError)
  }

  get decimals() {
    return this._decimals
  }

  get symbol() {
    return this._symbol
  }

  get name() {
    return this._name
  }

  async balance(address: string): Promise<BigNumber> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    const balanceStr = await this._contract.methods.balanceOf(address).call()

    return new BigNumber(balanceStr)
  }

  async getPair(address1: string, address2: string): Promise<string> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    return this._contract.methods.getPair(address1, address2).call()
  }

  async swapExactETHForTokens(minAmount: BigNumber, addresses: string[], fromAddress: string): Promise<any> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    return this._contract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
      Web3Builder.instance.web3.utils.toHex(minAmount.toString(10)),
      addresses,
      fromAddress,
      Web3Builder.instance.web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20),
    )
  }

  async swapExactTokensForETH(amountToSellInWei: BigNumber, minAmountInWei: BigNumber, addresses: string[], fromAddress: string): Promise<any> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    return this._contract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
      Web3Builder.instance.web3.utils.toHex(amountToSellInWei.toString(10)),
      Web3Builder.instance.web3.utils.toHex(minAmountInWei.toString(10)),
      addresses,
      fromAddress,
      Web3Builder.instance.web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20),
    )
  }

  async approve(address: string, amountInWei: BigNumber): Promise<any> {
    const coinAmount = Utils.amountFromWeiToCoin(amountInWei, 18)

    if (this._contract === null) await this.fetchContract()

    logger.info(`[${this._symbol}] Approving ${amountInWei.toString(10)} (${coinAmount.toString(10)} BNB) to ${address}`)

    // @ts-ignore
    return this._contract.methods.approve(address, amountInWei.toString(10));
  }

  async fetchInfo(): Promise<void> {
    if (this._contract === null) await this.fetchContract()

    if (!this.isBEP20) return

    logger.info(`Fetching info for ${this.address}`)

    // @ts-ignore
    this._decimals = await this._contract.methods.decimals().call()
    // @ts-ignore
    this._symbol = await this._contract.methods.symbol().call()
    // @ts-ignore
    this._name = await this._contract.methods.name().call()

    logger.info(util.inspect(
      pick(this, ['address', '_decimals', '_symbol', '_name']), false, null, true
    ))
  }
}

export default Contract
