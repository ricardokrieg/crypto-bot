import BscScanApi from '../src/bsc_scan_api'
import Config from '../src/config'


(async () => {
  // await BscScanApi.instance.contractAbi(Config.instance.tokenAddress())
  const transactions = await BscScanApi.instance.transactions(Config.instance.tokenAddress())

  for (let transaction of transactions) {
    if (transaction['from'] === '0x27d9cb0f644353c159ceebd64d3010508dfd541e' && transaction['input'].startsWith('0x0ac06d16') && parseInt(transaction['blockNumber']) > 13649046) {
      console.log(transaction)
    }
  }
})()
