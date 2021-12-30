import HoneypotAPI from '../src/HoneypotAPI'
import Config from '../src/config'

(async () => {
  const result = await HoneypotAPI.instance.report(Config.instance.tokenAddress())
  console.log(result)

  if (!result.status) {
    throw new Error('HoneyPot!')
  }
})()
