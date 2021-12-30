export interface Contract {
  address: string
  decimals: number
  symbol: string
  name: string
  abi: string
}

export interface ContractRelease {
  contract: Contract
  block: number
}

