import {Log} from 'web3-core'

export interface ILogReceiver {
  onLog: (log: Log) => void
}

export default class LogStore implements ILogReceiver {
  onLog(log: Log) {
  }
}
