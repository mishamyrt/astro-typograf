import Typograf from 'typograf'
import merge from 'deepmerge'
import { type AstroIntegration } from 'astro'
import { type IntegrationOptions, defaultOptions } from './options'
import { extractPaths } from './path'
import { createPlugin, fixHtmlTypography } from './typograf'

export default function createIntegration (
  options: Partial<IntegrationOptions> = {}
): AstroIntegration {
  const config: IntegrationOptions = merge(defaultOptions, options)
  const tp = new Typograf(config.typografOptions)
  tp.disableRule('common/space/trimRight')
  return {
    name: 'typograf',
    hooks: {
      'astro:build:done': async ({ routes }) => {
        await Promise.all(
          extractPaths(routes)
            .map(path => fixHtmlTypography(path, tp, config.selector))
        )
      },
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [createPlugin(tp)]
          }
        })
      }
    }
  }
}

// /**
//  * Typograf Astro integration constructor
//  * @param {string} selectors - String of CSS selectors to apply Typograf
//  * @param {typograf.Options} options - Typograf options
//  * @returns {import("astro").AstroIntegration}
//  */
// export default function (selectors = CSS_SELECTOR, options = DEFAULT_OPTIONS) {

// }
