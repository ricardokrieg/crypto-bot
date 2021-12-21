import createLogger from 'logging'
import * as util from 'util'
import { pick } from 'lodash'
import { Transaction as Tx } from 'ethereumjs-tx'
import { TransactionReceipt } from 'web3-core'
const axios = require('axios').default

import Web3Builder from './web3_builder'
import Contract from './contract'

const logger = createLogger('exchange')

export interface IExchangeConfig {
  address: string,
  privateKey: string,
  pancakeFactoryAddress: string,
  pancakeRouterAddress: string,
  wbnbAddress: string,
}

class Exchange {
  readonly address: string
  readonly privateKey: Buffer
  readonly pancakeFactoryAddress: string
  readonly pancakeRouterAddress: string
  readonly wbnbAddress: string

  private readonly _pancakeFactoryContract: Contract
  private readonly _pancakeRouterContract: Contract
  private readonly _wbnbContract: Contract

  bnb_price: number

  constructor(config: IExchangeConfig) {
    this.address = config.address
    this.privateKey = Buffer.from(config.privateKey, 'hex')
    this.pancakeFactoryAddress = config.pancakeFactoryAddress
    this.pancakeRouterAddress = config.pancakeRouterAddress
    this.wbnbAddress = config.wbnbAddress

    this._pancakeFactoryContract = new Contract(this.pancakeFactoryAddress, false)
    this._pancakeRouterContract = new Contract(this.pancakeRouterAddress, false)
    this._wbnbContract = new Contract(this.wbnbAddress)

    this.bnb_price = 0

    logger.info(util.inspect(
      pick(this, ['address', 'pancakeFactoryAddress', 'pancakeRouterAddress', 'wbnbAddress']),
      false, null, true
    ))
  }

  async fetchContracts(): Promise<void> {
    await this._pancakeFactoryContract.fetchInfo()
    await this._pancakeRouterContract.fetchInfo()
    await this._wbnbContract.fetchInfo()
  }

  async fetchBNBPrice(skipCache: boolean = false): Promise<number> {
    if (!skipCache && this.bnb_price !== 0) return this.bnb_price

    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
    logger.info(response.data)

    this.bnb_price = parseFloat(response.data['price'])
    logger.info(`BNB = $${this.bnb_price}`)

    return this.bnb_price
  }

  async transactionCount(): Promise<number> {
    const count = await Web3Builder.instance.web3.eth.getTransactionCount(this.address)

    logger.info(`Transaction Count: ${count}`)

    return count
  }

  async bnbBalance(): Promise<number> {
    let balance = parseFloat(await Web3Builder.instance.web3.eth.getBalance(this.address))
    balance = balance / Math.pow(10, 18)

    logger.info(`BNB Balance: ${balance}`)

    return balance
  }

  async tokenBalance(contract: Contract, address?: string): Promise<number> {
    const intBalance = await contract.balance(address || this.address)
    const balance = intBalance / Math.pow(10, contract.decimals)

    logger.info(`${contract.symbol} Balance: ${balance}`)

    return balance
  }

  async getPair(contract: Contract): Promise<string> {
    logger.info(`Fetching Pair Address for ${contract.symbol} x ${this._wbnbContract.symbol}`)

    const pairAddress = await this._pancakeFactoryContract.getPair(contract.address, this.wbnbAddress)

    logger.info(`Pair Address: ${pairAddress}`)

    if (/^0x0+$/.test(pairAddress)) {
      throw new Error(`Contract ${contract.symbol} not listed on PancakeSwap`)
    }

    return pairAddress
  }

  async getRate(contract: Contract, pairAddress?: string): Promise<number> {
    if (pairAddress === undefined) pairAddress = await this.getPair(contract)

    const tokenBalance = await this.tokenBalance(contract, pairAddress)

    if (tokenBalance === 0) {
      throw new Error(`Contract ${contract.symbol} does not have liquidity`)
    }

    const wbnbBalance = await this.tokenBalance(this._wbnbContract, pairAddress)

    if (wbnbBalance === 0) {
      throw new Error(`Contract ${contract.symbol} does not have liquidity`)
    }

    const rate = wbnbBalance / tokenBalance
    logger.info(`Rate: ${rate}`)
    logger.info(`${contract.symbol} = $${rate * this.bnb_price}`)

    return rate
  }

  async buy(contract: Contract, amount: number, rate: number, slippage: number, maxPrice: number): Promise<TransactionReceipt> {
    if (rate * this.bnb_price > maxPrice) {
      throw new Error(`Max Price exceeded: $${(rate * this.bnb_price)} > $${maxPrice}`)
    }

    const originalAmount = amount
    amount = amount * Math.pow(10, this._wbnbContract.decimals)

    const amountOut = originalAmount / rate
    const amountOutMin = ( amountOut * Math.pow(10, contract.decimals) ) * ( 1 / ( 1 + ( slippage / 100 ) ) )

    logger.info(`Spending ${originalAmount} (${amount}) BNB to buy ${amountOut} ${contract.symbol} (min: ${amountOutMin}) (slippage: ${slippage}%)`)

    const data = await this._pancakeRouterContract.swapExactETHForTokens(
      amountOutMin,
      [ this.wbnbAddress, contract.address ],
      this.address
    )

    const count = await this.transactionCount()
    const rawTransaction = {
      'from': this.address,
      // TODO correct set gas price (in GWEI)
      'gasPrice': Web3Builder.instance.web3.utils.toHex(5000000000),
      // TODO correct set gas limit (based on current estimate)
      'gasLimit': Web3Builder.instance.web3.utils.toHex(500000),
      'to': this.pancakeRouterAddress,
      'value': Web3Builder.instance.web3.utils.toHex(amount),
      'data': data.encodeABI(),
      'nonce': Web3Builder.instance.web3.utils.toHex(count)
    }

    logger.info(rawTransaction)

    const transaction = new Tx(rawTransaction, { 'common': Web3Builder.instance.bscFork })
    transaction.sign(this.privateKey)

    const result = await Web3Builder.instance.web3.eth.sendSignedTransaction(
      '0x' + transaction.serialize().toString('hex')
    )
    logger.info(`Transaction`)
    logger.info(result)

    return result
  }
}

export default Exchange
