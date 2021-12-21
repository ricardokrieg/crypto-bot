import createLogger from 'logging'
import bscscan, { account, contract } from 'bsc-scan'

import Config from './config'

const logger = createLogger('bsc_scan_api')

class BscScanApi {
  private static _instance: BscScanApi

  private readonly apiKey: string
  private readonly apiUrl: string

  private constructor() {
    this.apiKey = Config.instance.bscScanApiKey()
    this.apiUrl = Config.instance.bscScanApiUrl()

    bscscan.setApiKey(this.apiKey)
    bscscan.setUrl(this.apiUrl)
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  async contractAbi(address: string): Promise<string> {
    const abi: any = await contract.getContractAbi(address)

    if (typeof abi !== 'string') throw new Error(`Invalid BscScan API Response: ${abi.message}`)

    return Promise.resolve(abi as string)
  }

  async transactions(address: string): Promise<any> {
    return account.getTransactions(address)
  }
}

export default BscScanApi
