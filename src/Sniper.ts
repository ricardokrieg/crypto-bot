import {default as createLogger} from 'logging'

const logger = createLogger('Sniper')

export interface Release {
}

export interface IReleaseListener {
  onRelease: (release: Release) => void
}

export default class Sniper implements IReleaseListener {
  onRelease(release: Release): void {
    logger.info(release)
  }
}
