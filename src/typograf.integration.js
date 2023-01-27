import * as cheerio from 'cheerio'
import Typograf from 'typograf'
import { readFile, writeFile } from 'fs/promises'
import { visit } from 'unist-util-visit'

import { CSS_SELECTOR, DEFAULT_OPTIONS } from './typograf.constants.js'

/**
 * Applies typography transformation
 * @param {string} path - HTML file location
 * @param {typograf.Typograf} tp - Typograf instance
 */
async function fixHtmlTypography (path, tp, selectors) {
  const content = await readFile(path)
  const $ = cheerio.load(content)
  $(selectors).each((i, node) => {
    const el = $(node)
    const html = el.html()
    if (!html) {
      return
    }
    el.html(
      tp.execute(html)
    )
  })
  await writeFile(path, $.html())
}

/**
 * Extracts paths from Astro routes
 * @param {import('astro').RouteData[]} routes
 */
function extractPaths (routes) {
  return routes
    .map(r => r.distURL?.pathname || '')
    .filter(i => i.endsWith('.html'))
}

/**
 * Creates typographer plugin
 * @param {typograf.Typograf} tp - Typograf instance
 */
function createPlugin (tp) {
  return function () {
    return function (tree) {
      visit(tree, 'text', (node) => {
        node.value = tp.execute(node.value)
      })
    }
  }
}

/**
 * Typograf Astro integration constructor
 * @param {string} selectors - String of CSS selectors to apply Typograf
 * @param {typograf.Options} options - Typograf options
 * @returns {import("astro").AstroIntegration}
 */
export default function (selectors = CSS_SELECTOR, options = DEFAULT_OPTIONS) {
  const tp = new Typograf(options)
  tp.disableRule('common/space/trimRight')
  return {
    name: 'typograf',
    hooks: {
      'astro:build:done': async ({ routes }) => {
        await Promise.all(
          extractPaths(routes)
            .map(path => fixHtmlTypography(path, tp, selectors))
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
