import BigNumber from 'bignumber.js'

import Exchange from '../src/exchange'
import Config from '../src/config'
import Contract from '../src/contract'
import Utils from '../src/utils'

(async () => {
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

  await exchange.transactionCount()
  await exchange.bnbBalance()
  await exchange.tokenBalance(contract)

  const rate = await exchange.getRate(contract)

  // await exchange.approve(contract, Utils.amountFromCoinToGwei(new BigNumber('0.01'), 18))

  const transaction = await exchange.buy(
    contract,
    Utils.amountFromCoinToGwei(new BigNumber('0.001'), 18),
    rate,
    parseInt(Config.instance.slippage()),
    parseFloat(Config.instance.maxPrice())
  )
  console.log(transaction.transactionHash)
})()
