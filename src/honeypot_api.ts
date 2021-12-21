import createLogger from 'logging'
const axios = require('axios').default

import Config from './config'

const logger = createLogger('honeypot_api')

class HoneypotApi {
  private static _instance: HoneypotApi

  private constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  async report(address: string): Promise<boolean> {
    const response = await axios.get(
    'https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot', {
      params: {
        chain: 'bsc2',
        token: address
      }
    })

    const data = response.data

    logger.info(data)

    if (data['IsHoneypot']) {
      logger.error(`HoneyPot!`)
      return false
    }
    if (data['BuyTax'] > Config.instance.maxBuyFee()) {
      logger.error(`BuyTax too high: ${data['BuyTax']}`)
      return false
    }
    if (data['SellTax'] > Config.instance.maxSellFee()) {
      logger.error(`SellTax too high: ${data['SellTax']}`)
      return false
    }
    if (data['BuyGas'] >= 1000000) {
      logger.error(`BuyGas too high: ${data['BuyGas']}`)
      return false
    }
    if (data['SellGas'] >= 1000000) {
      logger.error(`SellGas too high: ${data['SellGas']}`)
      return false
    }

    return true
  }
}

export default HoneypotApi
