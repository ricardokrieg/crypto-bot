import {AbiItem} from 'web3-utils'
import {contract} from 'bsc-scan'

import BscScanAPI from '../../src/BscScanAPI'

const contractAddress = '0x1'
const bscScanAPI = new BscScanAPI('key', 'http://example.com')

test('Returns the contract abi', async () => {
  // @ts-ignore
  jest.spyOn(contract, 'getContractAbi').mockImplementation((_address: string) => {
    return Promise.resolve('{}')
  })

  const abi: AbiItem = await bscScanAPI.fetchAbi(contractAddress)

  expect(abi).toEqual(JSON.parse('{}') as AbiItem)
})

test('Throws an error if BscScan returns an invalid Abi', async () => {
  // @ts-ignore
  jest.spyOn(contract, 'getContractAbi').mockImplementation((_address: string) => {
    return Promise.resolve(new Error('Contract source code not verified'))
  })

  let thrown = false
  try {
    await bscScanAPI.fetchAbi(contractAddress)
  } catch (e: any) {
    thrown = true
  }

  expect(thrown).toBeTruthy()
})
