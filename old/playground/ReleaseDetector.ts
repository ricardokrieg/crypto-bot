import {Log} from 'web3-core'

import ApproveDetector, {IApproveListener, Approval} from '../src/ApproveDetector'

class DumbListener implements IApproveListener {
  onApprove(approval: Approval) {
    console.log(`APPROVE on ${approval.address} (${approval.blockNumber})`)
  }
}

(async () => {
  const listener = new DumbListener()
  const approveDetector = new ApproveDetector()

  approveDetector.add(listener)

  const log: Log = {
    address: '0xe7d76aa271041b2a1ff5FdEf42730d9Ab08F6163',
    topics: [
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      '0x0000000000000000000000000e1737103bd4c719ef27cce594b239ba96daef41',
      '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e'
    ],
    data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    blockNumber: 13855575,
    transactionHash: '0xa502b2552acb87b312a3c413a7411e7519213ec53d9b4b20d6371638eaa0800c',
    transactionIndex: 91,
    blockHash: '0x6abde08b1fdca9c470fd91942076e0c036bccb2ada821e19a7984c3d730e520c',
    logIndex: 318,
  }
  const otherLog: Log = {
    address: '0xA46346bC9d110907b5ACE36B53263320baf1cD21',
    topics: [
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      '0x000000000000000000000000b1d392eceb61c8cf5bd38dcdfad4337d3a6ec32d',
      '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e'
    ],
    data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    blockNumber: 13855575,
    transactionHash: '0xa749c87fbe5bf1f8ae11a182b0477e21a45c0030d30520c9ac3a778eb6787322',
    transactionIndex: 98,
    blockHash: '0x6abde08b1fdca9c470fd91942076e0c036bccb2ada821e19a7984c3d730e520c',
    logIndex: 340
  }

  const blockNumbers = [13855575, 13855577, 13855590, 13855590, 13855590, 13855590, 13855590]

  for (let blockNumber of blockNumbers) {
    approveDetector.onLog({
      ...log,
      blockNumber
    })
  }

  approveDetector.onLog(otherLog)
})()
