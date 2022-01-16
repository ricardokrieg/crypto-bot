export interface IExchanger {
  trade(address: string): Promise<void>
}
