import BigNumber from 'bignumber.js'

import Contract from '../src/contract'
import Config from '../src/config'
import Utils from '../src/utils'


(async () => {
  const contract = new Contract(Config.instance.tokenAddress())
  const pancakeRouterContract = new Contract(Config.instance.pancakeRouterAddress())

  await contract.fetchContract()
  await contract.fetchInfo()

  await pancakeRouterContract.fetchContract()

  // const amount = new BigNumber('10').pow(18)
  // const data = await contract.approve(Config.instance.pancakeFactoryAddress(), amount)
  // console.log(data)

  // const balance = await contract.balance(Config.instance.walletAddress())
  // console.log(Utils.amountFromGweiToDecimal(balance, contract.decimals).toString(10))

  const minAmount = new BigNumber('123456789')
  const data = await pancakeRouterContract.swapExactETHForTokens(minAmount, [Config.instance.wbnbAddress(), Config.instance.tokenAddress()], Config.instance.walletAddress())
  console.log(data)
})()
