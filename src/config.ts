require('dotenv').config({ path: '.env' })

import * as util from 'util'
import createLogger from 'logging'

const logger = createLogger('config')

class Config {
  private static _instance: Config

  private readonly envVars: Record<string, string>

  private constructor() {
    const keys = [
      'MAINNET_RPC_URL',
      'TESTNET_RPC_URL',
      'BSC_SCAN_API_KEY',
      'BSC_SCAN_API_URL',
      'WALLET_ADDRESS',
      'PRIVATE_KEY',
      'TOKEN_ADDRESS',
      'PANCAKE_FACTORY_ADDRESS',
      'PANCAKE_ROUTER_ADDRESS',
      'WBNB_ADDRESS',
      'MAX_BUY_FEE',
      'MAX_SELL_FEE',
      'SLIPPAGE',
      'MAX_PRICE',
      'TAKE_PROFIT',
      'STOP_LOSS',
      'AMOUNT_IN_BNB',
    ]

    this.envVars = {}

    for (let key of keys) {
      this.envVars[key] = process.env[key] || ''
    }

    logger.info(util.inspect(this.envVars, false, null, true))
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  get = (key: string) => {
    return this.envVars[key] || ''
  }

  isTestnet = () => {
    return false;
  }

  mainnetRpcUrl = () => {
    return this.get('MAINNET_RPC_URL')
  }

  testnetRpcUrl = () => {
    return this.get('MAINNET_RPC_URL')
  }

  bscScanApiKey = () => {
    return this.get('BSC_SCAN_API_KEY')
  }

  bscScanApiUrl = () => {
    return this.get('BSC_SCAN_API_URL')
  }

  walletAddress = () => {
    return this.get('WALLET_ADDRESS')
  }

  privateKey = () => {
    return this.get('PRIVATE_KEY')
  }

  tokenAddress = () => {
    return this.get('TOKEN_ADDRESS')
  }

  pancakeFactoryAddress = () => {
    return this.get('PANCAKE_FACTORY_ADDRESS')
  }

  pancakeRouterAddress = () => {
    return this.get('PANCAKE_ROUTER_ADDRESS')
  }

  wbnbAddress = () => {
    return this.get('WBNB_ADDRESS')
  }

  maxBuyFee() {
    return this.get('MAX_BUY_FEE')
  }

  maxSellFee() {
    return this.get('MAX_SELL_FEE')
  }

  slippage() {
    return this.get('SLIPPAGE')
  }

  maxPrice() {
    return this.get('MAX_PRICE')
  }

  takeProfit() {
    return this.get('TAKE_PROFIT')
  }

  stopLoss() {
    return this.get('STOP_LOSS')
  }

  amountInBNB() {
    return this.get('AMOUNT_IN_BNB')
  }
}

export default Config
