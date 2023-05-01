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
