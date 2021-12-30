import {default as createLogger, Logger} from 'logging'
import {BlockHeader, BlockTransactionObject, Transaction} from 'web3-eth'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

import Web3Builder from './web3_builder'

let logger: Logger
let web3: Web3

let globalTransaction: Transaction

const onBlockHeader = (error: Error, blockHeader: BlockHeader) => {
  if (error) {
    logger.error(`onBlockHeader`)
    logger.error(error)
    return
  }

  logger.info(`New Block: ${blockHeader.number}`)

  web3.eth.getBlock(blockHeader.number, false, onBlock)
}

const onBlock = (error: Error, block: BlockTransactionObject) => {
  if (error) {
    logger.error(`onBlock`)
    logger.error(error)
    return
  }

  logger.info(`Block ${block.number} has ${block.transactions.length} transactions`)

  // for (let txHash of block.transactions) {
  //   // @ts-ignore
  //   web3.eth.getTransaction(txHash, onTransaction)
  // }
}

const onTransaction = (error: Error, transaction: Transaction) => {
  if (error) {
    logger.error(`onTransaction`)
    logger.error(error)
    return
  }

  // logger.info('Transaction:')
  // logger.info(transaction)

  if (transaction === null) return

  if (globalTransaction === null || globalTransaction === undefined) {
    logger.info(`Setting Global Transaction`)
    globalTransaction = transaction
    logger.info(globalTransaction)
  }

  return

  if (transaction.input.startsWith('0x095ea7b3')) {
    // logger.info('Transaction:')
    // logger.info(transaction)

    const spender: string = '0x' + transaction.input.slice(10, 10 + 64)
    const amount: BigNumber = new BigNumber(web3.utils.hexToNumberString('0x' + transaction.input.slice(10 + 64)))

    if (spender === '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e') {
      logger.info(`${transaction.from} approved ${transaction.to} for trade on PancakeSwap: Router v2 (${amount.toString(10)})`)
    }
  }
}

const onPendingTransaction = (error: Error, txHash: string) => {
  if (error) {
    logger.error(`onPendingTransaction`)
    logger.error(error)
    return
  }

  web3.eth.getTransaction(txHash, onTransaction)
}

(async () => {
  logger = createLogger('Sniper')

  web3 = Web3Builder.buildWs()

  web3.eth.subscribe(
    'newBlockHeaders',
    onBlockHeader
  )

  web3.eth.subscribe(
    'pendingTransactions',
    onPendingTransaction
  )
})()
