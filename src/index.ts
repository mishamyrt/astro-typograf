import Typograf from 'typograf'
import merge from 'deepmerge'
import { type AstroIntegration } from 'astro'
import { type IntegrationOptions, type TypografSettings, defaultOptions } from './options'
import { createPlugin, fixHtmlTypography } from './typograf'
import { bgBlue, black } from 'kleur/colors'
import { reportResults } from './report'
import { fileURLToPath } from 'url'
import { readdir } from 'fs/promises'
import { join } from 'path'

export default function createIntegration (
  options: Partial<IntegrationOptions> = {}
): AstroIntegration {
  const config: IntegrationOptions = merge(defaultOptions, options)
  const tp = new Typograf(config.typografOptions)
  // Apply rule-specific settings supplied via config
  for (const rule of Object.keys(config.typografSettings || {})) {
    const settings = (config.typografSettings as TypografSettings)[rule]
    if (!settings) continue
    for (const name of Object.keys(settings)) {
      tp.setSetting(rule, name, settings[name])
    }
  }
  return {
    name: 'typograf',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        console.log(bgBlue(black(' improving typography ')))

        const root = fileURLToPath(dir)
        const paths: string[] = []

        // Recursively collect all built HTML files to avoid relying on
        // potentially changed `pages` shape across Astro versions.
        const stack: string[] = [root]
        while (stack.length > 0) {
          const current = stack.pop()!
          const entries = await readdir(current, { withFileTypes: true })
          for (const entry of entries) {
            const full = join(current, entry.name)
            if (entry.isDirectory()) {
              stack.push(full)
            } else if (entry.isFile() && full.endsWith('.html')) {
              paths.push(full)
            }
          }
        }

        const start = performance.now()
        await Promise.all(
          paths.map((path) => fixHtmlTypography(path, tp, config.selector))
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
