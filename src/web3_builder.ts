import Web3 from 'web3'
import { default as Common } from 'ethereumjs-common'
import createLogger from 'logging'

import Config from './config'

const logger = createLogger('web3_builder')

class Web3Builder {
  private static _instance: Web3Builder

  public readonly web3: Web3
  public readonly bscFork: Common

  private constructor() {
    if (Config.instance.isTestnet()) {
      this.web3 = this.build(true, Config.instance.testnetRpcUrl())
    } else {
      this.web3 = this.build(false, Config.instance.mainnetRpcUrl())
    }

    // TODO, does this need to change if I'm using testnet? (I don't think so, but better confirm)
    this.bscFork = Common.forCustomChain(
      'mainnet',
      {
        name: 'Binance Smart Chain Mainet',
        networkId: 56,
        chainId: 56,
        url: 'https://bsc-dataseed.binance.org/'
      },
      'istanbul',
    );
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  private build = (isTestnet: boolean, url: string) => {
    logger.info(`${isTestnet ? 'Testnet' : 'Mainnet'} (${url})`)

    return new Web3(new Web3.providers.HttpProvider(url))
  }

  buildWs(): Web3 {
    return new Web3(new Web3.providers.WebsocketProvider('wss://speedy-nodes-nyc.moralis.io/b93df11c78c36db2203d0a8f/bsc/mainnet/ws'))
  }
}

export default Web3Builder
