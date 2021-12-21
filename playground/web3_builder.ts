import Web3Builder from '../src/web3_builder'
import BigNumber from 'bignumber.js'

(async () => {
  // console.log(Web3Builder.instance.web3.utils.toWei('0.00000001'))
  // console.log(await Web3Builder.instance.web3.eth.getTransaction('0xf64329f80a5fb4ca2fdc31524750f9854a2c003372d15b350cbb01342075f185'))

  // console.log('139582088799283131')
  // console.log(Web3Builder.instance.web3.utils.toBN('139582088799283131').toString())
  //
  // const divider = Web3Builder.instance.web3.utils.toBN(String(Math.pow(10, 18)))
  // console.log(Web3Builder.instance.web3.utils.toBN('139582088799283131').div(divider).toString(10, 18))

  // const data = '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000001efe52b93e367bb0000000000000000000000000000000000000000000000000000000000000000'
  // let amountOutStr = Web3Builder.instance.web3.utils.hexToNumberString('0x' + data.slice(2 + 64 + 64, 2 + 64 + 64 + 64))
  // const amountOut = parseInt(amountOutStr)
  // const bn = Web3Builder.instance.web3.utils.toBN(amountOutStr)

  // let amountOutStr = '13958208879928313100'
  // const decimals = 18
  // amountOutStr = Web3Builder.instance.web3.utils.leftPad(amountOutStr, decimals)
  //
  // if (amountOutStr.length > decimals) {
  //   const diff = amountOutStr.length - decimals
  //   amountOutStr = amountOutStr.slice(0, diff) + '.' + amountOutStr.slice(diff)
  // } else {
  //   amountOutStr = '0.' + amountOutStr
  // }

  // console.log(amountOutStr)
  // console.log(amountOut)
  // console.log(bn.toString(10))
  // console.log(bn.divideBy(Web3Builder.instance.web3.utils.toBN('100000000000000000')).toString(10, 18))

  const minAmount = new BigNumber('123456789')
  const hex = Web3Builder.instance.web3.utils.toHex(minAmount.toString(10))
  console.log(minAmount.toString(10))
  console.log(hex)
})()
