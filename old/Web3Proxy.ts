import Web3 from 'web3'
import {Log, LogsOptions} from 'web3-core'
import { default as Common } from 'ethereumjs-common'
import createLogger from 'logging'

import Config from './config'

const logger = createLogger('web3_builder')

class Web3Proxy {
  private static _instance: Web3Proxy

  public readonly http: Web3
  public readonly ws: Web3
  public readonly bscFork: Common

  private constructor() {
    if (Config.instance.isTestnet()) {
      this.http = Web3Proxy.buildHttp(true, Config.instance.testnetRpcUrl())
      this.ws = Web3Proxy.buildWs(true, Config.instance.testnetWsUrl())
    } else {
      this.http = Web3Proxy.buildHttp(false, Config.instance.mainnetRpcUrl())
      this.ws = Web3Proxy.buildWs(false, Config.instance.mainnetWsUrl())
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

  static buildHttp = (isTestnet: boolean, url: string) => {
    logger.info(`${isTestnet ? 'Testnet' : 'Mainnet'} HTTP ${url}`)

    return new Web3(new Web3.providers.HttpProvider(url))
  }

  static buildWs = (isTestnet: boolean, url: string) => {
    logger.info(`${isTestnet ? 'Testnet' : 'Mainnet'} WebSocket ${url}`)

    return new Web3(new Web3.providers.WebsocketProvider(url))
  }

  subscribeToLogs(options: LogsOptions, callback: (error: Error, log: Log) => void) {
    this.ws.eth.subscribe(
      'logs',
      options,
      callback
    )
  }
}

export default Web3Proxy
