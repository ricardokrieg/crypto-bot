import { default as createLogger } from 'logging'

import Exchange from '../src/exchange'
import Config from '../src/config'
import Contract from '../src/contract'
import HoneypotApi from "./honeypot_api";
import BscScanApi from "./bsc_scan_api";
import Web3Builder from "./web3_builder";


(async () => {
  const logger = createLogger('BOT')

  const exchange = new Exchange({
    address: Config.instance.walletAddress(),
    privateKey: Config.instance.privateKey(),
    pancakeFactoryAddress: Config.instance.pancakeFactoryAddress(),
    pancakeRouterAddress: Config.instance.pancakeRouterAddress(),
    wbnbAddress: Config.instance.wbnbAddress(),
  })
  await exchange.fetchContracts()

  const contract = new Contract(Config.instance.tokenAddress())
  await contract.fetchInfo()

  let pairAddress = undefined

  while (true) {
    if (pairAddress === undefined) {
      try {
        pairAddress = await exchange.getPair(contract)
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        } else {
          logger.error(e)
        }

        continue
      }
    }

    try {
      await exchange.getRate(contract, pairAddress)
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message)
      } else {
        logger.error(e)
      }

      continue
    }

    break
  }

  let lastBlockNumber = -1
  while (true) {
    const blockNumber = await Web3Builder.instance.web3.eth.getBlockNumber()
    logger.info(`Block Number: ${blockNumber}`)

    if (blockNumber !== lastBlockNumber) {
      lastBlockNumber = blockNumber
      logger.info(`Checking Fees`)

      try {
        const result = await HoneypotApi.instance.report(contract.address)
        if (!result) {
          throw new Error('HoneyPot!')
        }
      } catch (e) {
        continue
      }

      break
    }
  }

  // await exchange.bnbBalance()
  // await exchange.tokenBalance(contract)

  // const transaction = await exchange.buy(contract, 0.01)
  // console.log(transaction.transactionHash)
})()
