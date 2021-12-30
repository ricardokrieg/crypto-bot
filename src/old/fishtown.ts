import {default as createLogger} from 'logging'
import BigNumber from 'bignumber.js'
Promise = require('bluebird')

import Web3Builder from './web3_builder'

// const onTransaction = (error: Error, transaction: Transaction) => {
//   if (error) {
//     logger.error(`onTransaction`)
//     logger.error(error)
//     return
//   }
//
//   if (transaction.input.startsWith('0x095ea7b3')) {
//     // logger.info('Transaction:')
//     // logger.info(transaction)
//
//     const spender: string = '0x' + transaction.input.slice(10, 10 + 64)
//     const amount: BigNumber = new BigNumber(web3.utils.hexToNumberString('0x' + transaction.input.slice(10 + 64)))
//
//     if (spender === '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e') {
//       logger.info(`${transaction.from} approved ${transaction.to} for trade on PancakeSwap: Router v2 (${amount.toString(10)})`)
//     }
//   }
// }

(async () => {
  const logger = createLogger('Sniper')

  let blockNumber = 13726327
  while (blockNumber <= 13726346) {
    logger.info(`Checking block ${blockNumber}`)

    const block = await Web3Builder.instance.web3.eth.getBlock(blockNumber)
    logger.info(`Block ${block.number} has ${block.transactions.length} transactions`)

    // @ts-ignore
    const transactions = await Promise.map(block.transactions, async (txHash) => {
      try {
        return await Web3Builder.instance.web3.eth.getTransaction(txHash)
      } catch (e) {
        logger.error(`Transaction ${txHash}`)
        return null
      }
    }, { concurrency: 5 })

    logger.info(`Pulled ${transactions.length} transactions`)

    for (let transaction of transactions) {
      if (transaction === null) continue
      if (transaction.to === null) continue

      if (transaction.to.toUpperCase() === '0x87be0b856960f57fb0104ef0922cd1dacbd37f64'.toUpperCase()) {
        logger.info(`Tx ${transaction.hash} is APPROVE`)
      } else if (transaction.to.toUpperCase() === '0x10ed43c718714eb63d5aa57b78b54704e256024e'.toUpperCase()) {
        if (transaction.input.toUpperCase().includes('87be0b856960f57fb0104ef0922cd1dacbd37f64'.toUpperCase())) {
          logger.info(`Tx ${transaction.hash} is BUY`)
          // process.exit(0)
        }
      }
    }

    const sleep = (transactions.length * 60) / 1500

    logger.info(`Sleep ${sleep}s`)
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, sleep * 1000);
    blockNumber++
  }
})()
