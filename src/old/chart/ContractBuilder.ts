import createLogger from 'logging'
import { Contract as Web3Contract } from 'web3-eth-contract'

import {Contract} from './data_structures'
import BscScanApi from '../bsc_scan_api'
import Web3Builder from '../web3_builder'
import {AbiItem} from "web3-utils";

const logger = createLogger('ContractFetcher')

export interface IContractBuilder {

}

export default class ContractBuilder {
  private readonly address: string

  constructor(address: string) {
    this.address = address
  }

  async fetch(): Promise<Contract> {
    logger.info(`Fetching info from contract ${this.address}`)

    const abi = await this.fetchAbi()
    const decimals = await this.fetchDecimals()
    const symbol = await this.fetchSymbol()
    const name = await this.fetchName()
  }

  private async fetchAbi(): Promise<string> {
    logger.info(`Fetching ABI...`)
    return BscScanApi.instance.contractAbi(this.address)
  }

  private async fetchDecimals(): Promise<number> {
    logger.info(`Fetching decimals...`)

    return contract.methods.decimals().call()
  }

  private contract(): Web3Contract {
    return new Web3Builder.instance.web3.eth.Contract(JSON.parse(abi) as AbiItem, this.address)
  }
}
