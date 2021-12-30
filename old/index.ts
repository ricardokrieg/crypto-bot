import {default as createLogger} from 'logging'
import TransactionMonitor from './TransactionMonitor'
import Sniper from './Sniper'

(async () => {
  const logger = createLogger('index')

  logger.info('Start')

  const sniper = new Sniper()

  TransactionMonitor.instance.add(sniper)
  TransactionMonitor.instance.start()

  // Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 60 * 1000);
  logger.info('End')
})()
