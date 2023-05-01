import { type TypografPrefs } from 'typograf/dist/main'

export interface IntegrationOptions {
  /**
   * Typographer configuration
   *
   * Available properties here: https://github.com/typograf/typograf/blob/4f5d3704b13a0639e6a2b936e73f0edfd4b79bb7/src/main.ts#L22
   */
  typografOptions: TypografPrefs
  /**
   * Selector by which nodes will be queried to improve typography.
   *
   * Comma-separated list of html tags.
   */
  selector: string
}

export const defaultOptions: IntegrationOptions = {
  typografOptions: {
    locale: ['ru', 'en-US'],
    disableRule: [
      'common/space/trimRight'
    ]
  },
  selector: 'p, h1, h2, h3'
}
