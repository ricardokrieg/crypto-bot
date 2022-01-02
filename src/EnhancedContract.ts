import {Contract} from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

export default class EnhancedContract {
  private readonly _contract: Contract
  public readonly address: string
  public readonly decimals: number

  constructor(contract: Contract, decimals: number) {
    this._contract = contract
    this.address = contract.options.address
    this.decimals = decimals
  }

  async getPair(address1: string, address2: string): Promise<string> {
    return this._contract.methods.getPair(address1, address2).call()
  }

  async balanceOf(address: string): Promise<BigNumber> {
    const balanceStr = await this._contract.methods.balanceOf(address).call()

    return new BigNumber(balanceStr)
  }
}
