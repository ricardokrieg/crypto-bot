import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import {Contract} from 'web3-eth-contract'

import EnhancedContract, {IEnhancedContract} from './EnhancedContract'

export interface IEnhancedContractBuilder {
  build: (address: string) => Promise<IEnhancedContract>
}

export interface IAbiFetcher {
  fetchAbi: (address: string) => Promise<AbiItem>
}

export interface IDecimalsFetcher {
  fetchDecimals: (contract: Contract) => Promise<number>
}

export default class EnhancedContractBuilder implements IEnhancedContractBuilder {
  private readonly web3: Web3
  private readonly abiFetcher: IAbiFetcher
  private readonly decimalsFetcher: IDecimalsFetcher

  constructor(web3: Web3, abiFetcher: IAbiFetcher, decimalsFetcher: IDecimalsFetcher) {
    this.web3 = web3
    this.abiFetcher = abiFetcher
    this.decimalsFetcher = decimalsFetcher
  }

  async build(address: string): Promise<IEnhancedContract> {
    const abi: AbiItem = await this.abiFetcher.fetchAbi(address)
    const contract: Contract = new this.web3.eth.Contract(abi, address)
    const decimals: number = await this.decimalsFetcher.fetchDecimals(contract)

    return Promise.resolve(new EnhancedContract(contract, decimals))
  }
}
