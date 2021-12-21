import HoneypotApi from '../src/honeypot_api'
import Config from '../src/config'

(async () => {
  const result = await HoneypotApi.instance.report(Config.instance.tokenAddress())

  if (!result) {
    throw new Error('HoneyPot!')
  }
})()
