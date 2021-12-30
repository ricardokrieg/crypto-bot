import FeeChecker, {FeeCheckRequest} from '../src/Checker/FeeChecker'

(async () => {
  const request: FeeCheckRequest = {
    address: '0x1b4d8c89a2120ce3d70a9d1e0e054fbf50d3143b',
    blockLimit: 13870580,
    minBuyFee: 10,
    minSellFee: 10,
  }
  const feeChecker = new FeeChecker(request)

  const result = await feeChecker.check()

  console.log(result)
})()
