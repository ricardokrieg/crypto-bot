import { TransactionReceipt } from 'web3-core'
import BigNumber from 'bignumber.js'

import Web3Builder from './web3_builder'

class Utils {
  static amountOutFromLogData(transaction: TransactionReceipt): BigNumber {
    for (let log of transaction.logs) {
      if (log.topics[0] === '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822') {
        const data = log.data
        const amountOutStr = Web3Builder.instance.web3.utils.hexToNumberString('0x' + data.slice(2 + 64 + 64, 2 + 64 + 64 + 64))
        return new BigNumber(amountOutStr)
      }
    }

    throw new Error('Could not fetch amountOut')
  }

  static amountFromGweiToCoin(amount: BigNumber, decimals: number): BigNumber {
    return amount.div(new BigNumber(10).pow(decimals))
  }

  static amountFromCoinToGwei(amount: BigNumber, decimals: number): BigNumber {
    return amount.multipliedBy(new BigNumber(10).pow(decimals))
  }
}

export default Utils
