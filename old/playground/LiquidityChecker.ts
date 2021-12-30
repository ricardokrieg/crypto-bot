import LiquidityChecker, {LiquidityCheckRequest} from '../src/Checker/LiquidityChecker'

(async () => {
  const liquidityChecker = new LiquidityChecker()
  const request: LiquidityCheckRequest = {
    address: '0x1b4d8c89a2120ce3d70a9d1e0e054fbf50d3143b',
    blockLimit: 13870580,
  }

  const result = await liquidityChecker.check(request)

  console.log(result)
})()
