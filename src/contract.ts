import { Contract as Web3Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import createLogger from 'logging'
import * as util from 'util'
import { pick } from 'lodash'

import Web3Builder from './web3_builder'
import BscScanApi from "./bsc_scan_api";

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

  async balance(address: string): Promise<number> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    return this._contract.methods.balanceOf(address).call()
  }

  async getPair(address1: string, address2: string): Promise<string> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    return this._contract.methods.getPair(address1, address2).call()
  }

  async swapExactETHForTokens(minAmount: number, addresses: string[], fromAddress: string): Promise<any> {
    if (this._contract === null) await this.fetchContract()

    // @ts-ignore
    return this._contract.methods.swapExactETHForTokens(
      Web3Builder.instance.web3.utils.toHex(minAmount),
      addresses,
      fromAddress,
      Web3Builder.instance.web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20),
    )
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
