import {AbiItem} from 'web3-utils'
import {default as createLogger} from 'logging'
import bscscan, {contract} from 'bsc-scan'

import {IAbiFetcher} from './EnhancedContractBuilder'

const logger = createLogger('BscScanAPI')

export default class BscScanAPI implements IAbiFetcher {
  constructor(apiKey: string, apiUrl: string) {
    bscscan.setApiKey(apiKey)
    bscscan.setUrl(apiUrl)

    logger.info(apiUrl)
  }

  async fetchAbi(address: string): Promise<AbiItem> {
    logger.debug(`fetching Abi for ${address}`)
    const abi: any = await contract.getContractAbi(address)
    logger.info(abi)

    if (typeof abi !== 'string') throw new Error(`Invalid BscScan API Response: ${abi.message}`)

    return Promise.resolve(JSON.parse(abi as string) as AbiItem)
  }
}
