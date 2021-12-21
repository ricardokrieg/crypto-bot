import Contract from '../src/contract'
import Config from '../src/config'


(async () => {
  const contract = new Contract(Config.instance.tokenAddress())

  await contract.fetchContract()
  await contract.fetchInfo()

  // console.log(await contract.balance(Config.instance.walletAddress()))
})()
