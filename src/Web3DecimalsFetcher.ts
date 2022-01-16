import {Contract} from 'web3-eth-contract'
import {default as createLogger} from 'logging'

import {IDecimalsFetcher} from './EnhancedContractBuilder'

const logger = createLogger('Web3DecimalsFetcher')

export default class Web3DecimalsFetcher implements IDecimalsFetcher {
  async fetchDecimals(contract: Contract): Promise<number> {
    logger.info(`Fetching decimals for ${contract.options.address}`)

    const decimals = parseInt(await contract.methods.decimals().call())

    logger.info(`Decimals: ${decimals}`)

    return Promise.resolve(decimals)
  }
}
