import Web3Proxy from '../Web3Builder'

export interface CheckRequest {
  address: string
  blockLimit: number
}

export enum CheckResult {
  WAIT = 0,
  TRUE,
  FALSE,
}

export default abstract class Checker {
  private readonly request: CheckRequest

  constructor(request: CheckRequest) {
    this.request = request
  }

  async check(): Promise<boolean> {
    let blockNumber: number

    do {
      blockNumber = await Web3Proxy.instance.web3.eth.getBlockNumber()

      const result = await this.doCheck(this.request, blockNumber)

      if (result === CheckResult.TRUE) return true
      if (result === CheckResult.FALSE) return false
    } while (blockNumber <= this.request.blockLimit)

    return false
  }

  abstract doCheck(request: CheckRequest, blockNumber: number): Promise<CheckResult>
}
