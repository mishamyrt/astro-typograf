import Typograf from 'typograf'
import merge from 'deepmerge'
import { type AstroIntegration } from 'astro'
import { type IntegrationOptions, defaultOptions } from './options'
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
      'astro:build:done': async ({ pages, dir }) => {
        console.log(bgBlue(black(' improving typography ')))
        const paths = []
        for (const page of pages) {
          paths.push(dir.pathname + page.pathname + 'index.html')
        }
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
