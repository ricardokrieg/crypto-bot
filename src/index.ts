require('dotenv').config({ path: '.env' })

import Web3 from 'web3'
import {AbiItem} from 'web3-utils'

import {generateSimulatedLogs} from '../tests/support/Log'
import LogMonitor, {ILogEmitter} from './LogMonitor'
import InMemoryLogStore from './InMemoryLogStore'
import ReleaseDetector from './ReleaseDetector'
import Sniper from './Sniper'
import Web3LogSubscriber from './Web3LogSubscriber'
import ContractChecker from './ContractChecker'
import FeeChecker from './FeeChecker'
import LiquidityChecker from './LiquidityChecker'
import HoneypotAPI from './HoneypotAPI'
import PancakeLiquidityProvider from './PancakeLiquidityProvider'
import EnhancedContract from './EnhancedContract'
import EnhancedContractBuilder from './EnhancedContractBuilder'
import BscScanAPI from './BscScanAPI'
import Web3DecimalsFetcher from './Web3DecimalsFetcher'
import SimulatedLogEmitter from './SimulatedLogEmitter'

const buildPancakeContract = (web3: Web3) => {
  const pancakeContractAbi = '[{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
  const pancakeContract = new web3.eth.Contract(
    JSON.parse(pancakeContractAbi) as AbiItem[],
    '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
  )
  const pancakeEnhancedContract = new EnhancedContract(pancakeContract, 18)

  return { pancakeContract, pancakeEnhancedContract}
}

const buildWbnbContract = (web3: Web3) => {
  const wbnbContractAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]'
  const wbnbContract = new web3.eth.Contract(
    JSON.parse(wbnbContractAbi) as AbiItem[],
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  )
  const wbnbEnhancedContract = new EnhancedContract(wbnbContract, 18)

  return { wbnbContract, wbnbEnhancedContract }
}

const buildLogEmitter = (web3: Web3): ILogEmitter => {
  if (process.env['SIMULATED']) {
    return new SimulatedLogEmitter(generateSimulatedLogs())
  } else {
    return new Web3LogSubscriber(web3)
  }
}

(async () => {
  const web3WsUrl = process.env['WEB3_WS_URL'] || ''
  const web3 = new Web3(new Web3.providers.WebsocketProvider(web3WsUrl))

  const { pancakeEnhancedContract} = buildPancakeContract(web3)
  const { wbnbEnhancedContract } = buildWbnbContract(web3)

  const honeypotApi = new HoneypotAPI(process.env['HONEYPOT_API_URl'] || '')
  const bscScanApi = new BscScanAPI(
    process.env['BSC_SCAN_API_KEY'] || '',
    process.env['BSC_SCAN_API_URL'] || ''
  )

  const feeChecker = new FeeChecker(honeypotApi)

  const web3DecimalsFetcher = new Web3DecimalsFetcher()

  const enhancedContractBuilder = new EnhancedContractBuilder(
    web3,
    bscScanApi,
    web3DecimalsFetcher
  )

  const pancakeLiquidityProvider = new PancakeLiquidityProvider(
    pancakeEnhancedContract,
    wbnbEnhancedContract,
    enhancedContractBuilder
  )
  const liquidityChecker = new LiquidityChecker(pancakeLiquidityProvider)

  const contractChecker = new ContractChecker(feeChecker, liquidityChecker)

  const sniper = new Sniper(contractChecker)

  const logStore = new InMemoryLogStore()
  const releaseDetector = new ReleaseDetector(logStore, sniper)

  const logEmitter = buildLogEmitter(web3)

  const logMonitor = new LogMonitor(logEmitter, releaseDetector)
  await logMonitor.start()
})()
