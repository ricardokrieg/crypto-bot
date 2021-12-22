import createLogger from 'logging'
import * as util from 'util'
import { pick } from 'lodash'
import { Transaction as Tx } from 'ethereumjs-tx'
import { TransactionReceipt } from 'web3-core'
const axios = require('axios').default
import BigNumber from 'bignumber.js'

import Web3Builder from './web3_builder'
import Contract from './contract'
import Utils from './utils'

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

  bnb_price: BigNumber

  constructor(config: IExchangeConfig) {
    this.address = config.address
    this.privateKey = Buffer.from(config.privateKey, 'hex')
    this.pancakeFactoryAddress = config.pancakeFactoryAddress
    this.pancakeRouterAddress = config.pancakeRouterAddress
    this.wbnbAddress = config.wbnbAddress

    this._pancakeFactoryContract = new Contract(this.pancakeFactoryAddress, false)
    this._pancakeRouterContract = new Contract(this.pancakeRouterAddress, false)
    this._wbnbContract = new Contract(this.wbnbAddress)

    this.bnb_price = new BigNumber(0)

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

  async fetchBNBPrice(skipCache: boolean = false): Promise<BigNumber> {
    if (!skipCache && !this.bnb_price.isZero()) return this.bnb_price

    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
    logger.info(response.data)

    this.bnb_price = new BigNumber(response.data['price'])
    logger.info(`BNB = $${this.bnb_price.toString(10)}`)

    return this.bnb_price
  }

  async transactionCount(): Promise<number> {
    const count = await Web3Builder.instance.web3.eth.getTransactionCount(this.address)

    logger.info(`Transaction Count: ${count}`)

    return count
  }

  async bnbBalance(): Promise<BigNumber> {
    const balance = new BigNumber(await Web3Builder.instance.web3.eth.getBalance(this.address))

    logger.info(`BNB Balance: ${balance} (${Utils.amountFromGweiToCoin(balance, 18).toString(10)} BNB)`)

    return balance
  }

  async tokenBalance(contract: Contract, address?: string, skipLogs: boolean = false): Promise<BigNumber> {
    const balance = await contract.balance(address || this.address)

    if (!skipLogs) {
      logger.info(`${contract.name} Balance: ${balance.toString(10)} (${Utils.amountFromGweiToCoin(balance, contract.decimals).toString(10)} ${contract.symbol})`)
    }
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

  async getRate(contract: Contract, pairAddress?: string, skipLogs: boolean = false): Promise<BigNumber> {
    if (pairAddress === undefined) pairAddress = await this.getPair(contract)

    const tokenBalance = await this.tokenBalance(contract, pairAddress, skipLogs)

    if (tokenBalance.isZero()) {
      throw new Error(`Contract ${contract.symbol} does not have liquidity`)
    }

    const wbnbBalance = await this.tokenBalance(this._wbnbContract, pairAddress, skipLogs)

    if (wbnbBalance.isZero()) {
      throw new Error(`Contract ${contract.symbol} does not have liquidity`)
    }

    const rate = Utils.amountFromGweiToCoin(wbnbBalance, 18).div(Utils.amountFromGweiToCoin(tokenBalance, contract.decimals))

    if (!skipLogs) {
      logger.info(`Rate: ${rate.toString(10)}`)
      const price = this.getPrice(rate)
      logger.info(`${contract.symbol} = $${price.toString(10)}`)
    }

    return rate
  }

  getPrice(rate: BigNumber): BigNumber {
    return rate.multipliedBy(this.bnb_price)
  }

  async buy(contract: Contract, amountInGwei: BigNumber, rate: BigNumber, slippage: number, maxPrice: number): Promise<TransactionReceipt> {
    if (rate.multipliedBy(this.bnb_price).toNumber() > maxPrice) {
      throw new Error(`Max Price exceeded: $${rate.multipliedBy(this.bnb_price).toString(10)} > $${maxPrice}`)
    }

    const amountInCoin = Utils.amountFromGweiToCoin(amountInGwei, 18)
    const amountOut = amountInGwei.div(rate).decimalPlaces(0)
    const amountOutMin = amountOut.multipliedBy(1 / ( 1 + ( slippage / 100 ) )).decimalPlaces(0)
    const amountOutInCoin = Utils.amountFromGweiToCoin(amountOut, contract.decimals)
    const amountOutMinInCoin = Utils.amountFromGweiToCoin(amountOutMin, contract.decimals)

    logger.info(`Buy Details:`)
    logger.info(`BNB: ${amountInGwei.toString(10)} (${amountInCoin.toString(10)} BNB)`)
    logger.info(`${contract.name}: ${amountOut.toString(10)} (${amountOutInCoin.toString(10)} ${contract.symbol})`)
    logger.info(`Minimum ${amountOutMin} (${amountOutMinInCoin} ${contract.symbol})`)
    logger.info(`Slippage: ${slippage}%`)

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
      'value': Web3Builder.instance.web3.utils.toHex(amountInGwei.toString(10)),
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

  async sell(contract: Contract, amountInGwei: BigNumber): Promise<TransactionReceipt> {
    const amountInCoin = Utils.amountFromGweiToCoin(amountInGwei, contract.decimals)
    const amountOutMin = new BigNumber(1)
    const amountOutMinInCoin = Utils.amountFromGweiToCoin(amountOutMin, 18)

    logger.info(`Sell Details:`)
    logger.info(`${contract.name}: ${amountInGwei.toString(10)} (${amountInCoin.toString(10)} ${contract.symbol})`)
    logger.info(`Minimum ${amountOutMin.toString(10)} (${amountOutMinInCoin.toString(10)} BNB)`)

    const data = await this._pancakeRouterContract.swapExactTokensForETH(
      amountInGwei,
      amountOutMin,
      [ contract.address, this.wbnbAddress ],
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
      'value': Web3Builder.instance.web3.utils.toHex(0),
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

  async approve(contract: Contract, amountInGwei: BigNumber) {
    logger.info(`Approving ${contract.symbol} to spend ${amountInGwei} (${Utils.amountFromGweiToCoin(amountInGwei, 18).toString(10)} BNB)`)

    const data = await contract.approve(this.pancakeRouterAddress, amountInGwei)
    const count = await this.transactionCount()

    const rawTransaction = {
      'from': this.address,
      // TODO correct set gas price (in GWEI)
      'gasPrice': Web3Builder.instance.web3.utils.toHex(5000000000),
      // TODO correct set gas limit (based on current estimate)
      'gasLimit': Web3Builder.instance.web3.utils.toHex(210000),
      'to': contract.address,
      'value': '0x0',
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
