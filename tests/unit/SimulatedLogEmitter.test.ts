import {Log} from 'web3-core'

import {generateLog} from '../support/Log'
import SimulatedLogEmitter from '../../src/SimulatedLogEmitter'

test('Forwards simulated logs', async () => {
  const logs = [
    generateLog(),
    generateLog(),
    generateLog()
  ]

  const onLog = jest.fn((_log: Log) => {})

  const simulatedLogEmitter = new SimulatedLogEmitter(logs)
  simulatedLogEmitter.subscribe(onLog)

  expect(onLog).toBeCalledTimes(3)
})
