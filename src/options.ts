import { type TypografPrefs } from 'typograf/dist/main'

export interface IntegrationOptions {
  /**
   * Locales for typography.
   * The first locale is the main one, it is used to select which rules and type of quotes will be executed.
   *
   * Possible values are available here: https://github.com/typograf/typograf/blob/dev/docs/LOCALES.en-US.md
   */
  typografOptions: TypografPrefs
  /**
   * Selector by which fields will be selected to improve typography.
   *
   * Comma-separated list of html tags.
   */
  selector: string
}

export const defaultOptions: IntegrationOptions = {
  typografOptions: {
    locale: ['ru', 'en-US']
  },
  selector: 'p, h1, h2, h3'
}
