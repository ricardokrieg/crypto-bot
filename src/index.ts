import { default as createLogger } from 'logging'

import Exchange from '../src/exchange'
import Config from '../src/config'
import Contract from '../src/contract'
import HoneypotApi from './honeypot_api'
import Web3Builder from './web3_builder'
import Utils from './utils'
import BigNumber from "bignumber.js";


(async () => {
  const logger = createLogger('BOT')

  const exchange = new Exchange({
    address: Config.instance.walletAddress(),
    privateKey: Config.instance.privateKey(),
    pancakeFactoryAddress: Config.instance.pancakeFactoryAddress(),
    pancakeRouterAddress: Config.instance.pancakeRouterAddress(),
    wbnbAddress: Config.instance.wbnbAddress(),
  })

  await exchange.fetchBNBPrice()
  await exchange.fetchContracts()

  const contract = new Contract(Config.instance.tokenAddress())
  await contract.fetchInfo()

  let pairAddress = undefined
  let lastBlockNumber = -1
  let rate = new BigNumber(0)

  while (true) {
    const blockNumber = await Web3Builder.instance.web3.eth.getBlockNumber()
    logger.info(`Block Number: ${blockNumber}`)

    if (blockNumber !== lastBlockNumber) {
      lastBlockNumber = blockNumber

      logger.info(`Checking if Pair exists`)
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

      logger.info(`Checking Liquidity`)
      try {
        rate = await exchange.getRate(contract, pairAddress)
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        } else {
          logger.error(e)
        }

        continue
      }

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

  const amountInCoin = new BigNumber(Config.instance.amountInBNB())
  const amountInGwei = Utils.amountFromCoinToGwei(amountInCoin, 18)
  const transaction = await exchange.buy(
    contract,
    amountInGwei,
    rate,
    parseInt(Config.instance.slippage()),
    parseFloat(Config.instance.maxPrice())
  )
  logger.info(transaction.transactionHash)

  if (!transaction.status) {
    logger.error('Transaction Failed')
    process.exit(1)
  }

  let amountOut = new BigNumber(0)
  try {
    amountOut = Utils.amountOutFromLogData(transaction);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
    } else {
      logger.error(e)
    }

    process.exit(1)
  }

  const effectiveRate = amountInGwei.div(amountOut)

  // TODO check if has allowance before approving
  await exchange.approve(contract, amountOut)

  const takeProfit = parseFloat(Config.instance.takeProfit())
  const stopLoss = parseFloat(Config.instance.takeProfit()) * -1

  while (true) {
    const blockNumber = await Web3Builder.instance.web3.eth.getBlockNumber()

    if (blockNumber !== lastBlockNumber) {
      lastBlockNumber = blockNumber

      rate = await exchange.getRate(contract, pairAddress, true)
      logger.info(`Amount Out: ${amountOut.toString(10)} (${Utils.amountFromGweiToCoin(amountOut, contract.decimals)} ${contract.symbol})`)
      logger.info(`Rate: ${rate.toString(10)}`)
      logger.info(`Effective Rate: ${effectiveRate.toString(10)}`)

      const buyPrice = exchange.getPrice(effectiveRate)
      const price = exchange.getPrice(rate)

      logger.info(`Buy Price    : ${buyPrice.toString(10)}`)
      logger.info(`Current Price: ${price.toString(10)}`)

      const diff = price.minus(buyPrice)
      const pl = diff.multipliedBy(Utils.amountFromGweiToCoin(amountOut, contract.decimals))

      const percentage = rate.div(effectiveRate).minus(1).multipliedBy(100)

      logger.info(`Percentage: ${percentage.toString(10)}%`)
      if (price > buyPrice) {
        logger.info(`Profit: $${pl.toString(10)}`)
      } else {
        logger.info(`Loss: $${pl.toString(10)}`)
      }

      logger.info(`Take Profit:  ${takeProfit}%`)
      logger.info(`Stop Loss  : ${stopLoss}%`)

      let exit = false
      if (percentage.gte(takeProfit)) {
        logger.info(`Exiting with Profit!`)
        exit = true
      } else if (percentage.lte(stopLoss)) {
        logger.info(`Exiting with Loss!`)
        exit = true
      }

      if (exit) {
        const transaction = await exchange.sell(
          contract,
          amountOut
        )
        logger.info(transaction.transactionHash)

        break
      }
    }
  }
})()
