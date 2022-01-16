const axios = require('axios').default
import {default as createLogger} from 'logging'

import {IFeeProvider, FeeResponse} from './FeeChecker'

const logger = createLogger('HoneypotAPI')

export default class HoneypotAPI implements IFeeProvider {
  private readonly url: string

  constructor(url: string) {
    this.url = url
  }

  async check(address: string): Promise<FeeResponse> {
    logger.info(`Checking ${address}`)

    const params = { chain: 'bsc2', token: address }
    logger.info(`${this.url} ${JSON.stringify(params)}`)

    const response = await axios.get(this.url, { params })
    const data = response.data

    const buyFee = data['BuyTax']
    const buyGas = data['BuyGas']
    const sellFee = data['SellTax']
    const sellGas = data['SellGas']
    const isHoneypot = data['IsHoneypot']

    const result = {
      buyFee,
      buyGas,
      sellFee,
      sellGas,
      isHoneypot,
    }

    logger.info(result)

    return Promise.resolve(result)
  }
}
