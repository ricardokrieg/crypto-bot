import Exchange from '../src/exchange'
import Config from '../src/config'
import Contract from '../src/contract'

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

  const transaction = await exchange.buy(
    contract,
    0.001,
    rate,
    parseInt(Config.instance.slippage()),
    parseFloat(Config.instance.maxPrice())
  )
  console.log(transaction.transactionHash)
})()
