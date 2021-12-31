const axios = require('axios').default
import {default as createLogger} from 'logging'

import {IFeeProvider, FeeResponse} from './FeeChecker'

const logger = createLogger('HoneypotAPI')

export default class HoneypotAPI implements IFeeProvider {
  async check(address: string): Promise<FeeResponse> {
    logger.info(`Checking ${address}`)

    const response = await axios.get(
    'https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot', {
      params: {
        chain: 'bsc2',
        token: address
      }
    })
    const data = response.data

    const buyFee = data['BuyTax']
    const sellFee = data['SellTax']
    const isHoneypot = data['IsHoneypot']

    const feeResponse: FeeResponse = {
      address,
      buyFee,
      sellFee,
      isHoneypot,
    }

    if (isHoneypot) {
      feeResponse.error = new Error(`Honeypot!`)
    } else if (buyFee > 20) {
      feeResponse.error = new Error(`Buy Fee is too high: ${buyFee}%`)
    } else if (sellFee > 20) {
      feeResponse.error = new Error(`Sell Fee is too high: ${sellFee}%`)
    }

    return feeResponse
  }
}
