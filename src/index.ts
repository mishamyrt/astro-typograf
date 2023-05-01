import Typograf from 'typograf'
import merge from 'deepmerge'
import { type AstroIntegration } from 'astro'
import { type IntegrationOptions, defaultOptions } from './options'
import { extractPaths } from './path'
import { createPlugin, fixHtmlTypography } from './typograf'
import { bgBlue, black } from 'kleur/colors'
import { reportResults } from './report'

export default function createIntegration (
  options: Partial<IntegrationOptions> = {}
): AstroIntegration {
  const config: IntegrationOptions = merge(defaultOptions, options)
  const tp = new Typograf(config.typografOptions)
  return {
    name: 'typograf',
    hooks: {
      'astro:build:done': async ({ routes }) => {
        console.log(bgBlue(black(' improving typography ')))
        const paths = extractPaths(routes)
        const start = performance.now()
        await Promise.all(
          paths.map(path => fixHtmlTypography(path, tp, config.selector))
        )
        reportResults(paths.length, start, performance.now())
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
