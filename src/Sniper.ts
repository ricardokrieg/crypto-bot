import {default as createLogger} from 'logging'

const logger = createLogger('Sniper')

export interface Release {
  address: string
}

export interface IReleaseListener {
  onRelease: (release: Release) => void
}

export interface IContractChecker {
  check: (address: string, onSuccess: (address: string) => void, onFail: (address: string) => void) => void
}

export default class Sniper implements IReleaseListener {
  private readonly contractChecker: IContractChecker

  constructor(contractChecker: IContractChecker) {
    this.contractChecker = contractChecker
  }

  onRelease(release: Release) {
    logger.info(release)

    this.contractChecker.check(release.address, this.onContractCheckSuccess, this.onContractCheckFail)
  }

  onContractCheckSuccess(address: string) {

  }

  onContractCheckFail(address: string) {

  }
}
