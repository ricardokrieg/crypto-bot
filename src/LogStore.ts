import {Log} from 'web3-core'

export interface ILogReceiver {
  onLog: (log: Log) => void
}

export default class LogStore implements ILogReceiver {
  readonly logs: Log[]

  constructor() {
    this.logs = []
  }

  onLog(log: Log) {
    this.logs.push(log)
  }
}
