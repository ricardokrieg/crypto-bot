import BigNumber from 'bignumber.js'

import Web3Builder from '../src/web3_builder'
import Utils from '../src/utils'

(async () => {
  const gasPriceInWei = await Web3Builder.instance.web3.eth.getGasPrice()
  console.log(gasPriceInWei)
  console.log(Utils.amountFromWeiToCoin(new BigNumber(gasPriceInWei), 18).toString(10))

  console.log(Utils.amountFromGweiToCoin(new BigNumber(5), 18).toString(10))
  console.log(Utils.amountFromGweiToWei(new BigNumber(5)).toString(10))
})()
