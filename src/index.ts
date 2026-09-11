import Typograf from "typograf"
import type { AstroIntegration } from "astro"
import { isSatteriProcessor } from "@astrojs/markdown-satteri"
import { type IntegrationOptions, resolveOptions } from "./options"
import { createSatteriPlugin, fixHtmlTypography } from "./typograf"
import { bgBlue, black } from "kleur/colors"
import { reportResults } from "./report"
import { fileURLToPath } from "node:url"
import { readdir } from "node:fs/promises"
import { join } from "node:path"

export default function createIntegration(
  options: Partial<IntegrationOptions> = {},
): AstroIntegration {
  const config: IntegrationOptions = resolveOptions(options)
  const tp = new Typograf(config.typografOptions)
  // Apply rule-specific settings supplied via config
  for (const rule of Object.keys(config.typografSettings)) {
    const settings = config.typografSettings[rule]
    if (!settings) {
      continue
    }
    for (const name of Object.keys(settings)) {
      tp.setSetting(rule, name, settings[name])
    }
  }
  return {
    name: "typograf",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        console.log(bgBlue(black(" improving typography ")))

        const root = fileURLToPath(dir)
        let count = 0
        const start = performance.now()

        // Traverse built files without retaining all pages or processing them
        // concurrently, which keeps memory usage bounded for large sites.
        const stack: string[] = [root]
        while (stack.length > 0) {
          const current = stack.pop()
          if (current === undefined) continue
          const entries = await readdir(current, { withFileTypes: true })
          for (const entry of entries) {
            const full = join(current, entry.name)
            if (entry.isDirectory()) {
              stack.push(full)
            } else if (entry.isFile() && full.endsWith(".html")) {
              await fixHtmlTypography(full, tp, config.selector)
              count += 1
            }
          }
        }

        reportResults(count, start, performance.now())
      },
      "astro:config:done": ({ config }) => {
        const processor = config.markdown.processor
        if (!isSatteriProcessor(processor)) {
          throw new Error(
            "astro-typograf 4 requires the Sätteri Markdown processor. For remark/unified, use astro-typograf@3.",
          )
        }
        processor.options.mdastPlugins.push(createSatteriPlugin(tp))
      },
    },
  }
}
