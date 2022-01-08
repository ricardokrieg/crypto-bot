import {default as createLogger} from 'logging'
import EnhancedContract from './EnhancedContract'

const logger = createLogger('Sniper')

export interface Release {
  address: string
}

export interface IReleaseListener {
  onRelease: (release: Release) => void
}

export interface IContractChecker {
  check: (enhancedContract: EnhancedContract) => Promise<boolean>
}

export interface IEnhancedContractBuilder {
  build: (address: string) => Promise<EnhancedContract>
}

export default class Sniper implements IReleaseListener {
  private readonly contractChecker: IContractChecker
  private readonly enhancedContractBuilder: IEnhancedContractBuilder

  constructor(contractChecker: IContractChecker, enhancedContractBuilder: IEnhancedContractBuilder) {
    this.contractChecker = contractChecker
    this.enhancedContractBuilder = enhancedContractBuilder
  }

  onRelease(release: Release) {
    logger.info(release)

    this.enhancedContractBuilder.build(release.address)
      .then(async (enhancedContract: EnhancedContract) => {
        const success = await this.contractChecker.check(enhancedContract)

        if (success) {
          logger.info(`Contract ${release.address} is ready!`)
        } else {
          logger.warn(`Contract ${release.address} failed the check`)
        }
      })
  }
}
