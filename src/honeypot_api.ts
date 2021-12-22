import createLogger from 'logging'
const axios = require('axios').default

import Config from './config'

const logger = createLogger('honeypot_api')

export interface IHoneypotReport {
  BuyGas: number
  BuyTax: number
  IsHoneypot: false
  SellGas: number
  SellTax: number
  status: boolean
}

class HoneypotApi {
  private static _instance: HoneypotApi

  private constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  async report(address: string): Promise<IHoneypotReport> {
    const response = await axios.get(
    'https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot', {
      params: {
        chain: 'bsc2',
        token: address
      }
    })

    const data = response.data
    const result: IHoneypotReport = {
      BuyGas: data['BuyGas'],
      BuyTax: data['BuyTax'],
      IsHoneypot: data['IsHoneypot'],
      SellGas: data['SellGas'],
      SellTax: data['SellTax'],
      status: true,
    }

    logger.info(data)

    if (data['IsHoneypot']) {
      logger.error(`HoneyPot!`)
      result.status = false
    }
    if (data['BuyTax'] > Config.instance.maxBuyFee()) {
      logger.error(`BuyTax too high: ${data['BuyTax']}`)
      result.status = false
    }
    if (data['SellTax'] > Config.instance.maxSellFee()) {
      logger.error(`SellTax too high: ${data['SellTax']}`)
      result.status = false
    }
    if (data['BuyGas'] >= 2000000) {
      logger.error(`BuyGas too high: ${data['BuyGas']}`)
      result.status = false
    }
    if (data['SellGas'] >= 2000000) {
      logger.error(`SellGas too high: ${data['SellGas']}`)
      result.status = false
    }

    return result
  }
}

export default HoneypotApi
