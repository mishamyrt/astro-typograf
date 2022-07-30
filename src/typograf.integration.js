// @ts-check
import * as cheerio from 'cheerio'
import { readFile, writeFile } from 'fs/promises'
import Typograf from 'typograf'
import { CSS_SELECTOR, DEFAULT_OPTIONS } from './typograf.constants'

/**
 * Applies typography transformation
 * @param {string} path - HTML file location
 * @param {typograf.Typograf} tp - Typograf instance
 */
async function fixHtmlTypography (path, tp) {
  const content = await readFile(path)
  const $ = cheerio.load(content)
  $(CSS_SELECTOR).each((i, node) => {
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
 * Typograf Astro integration constructor
 * @param {typograf.Options} options - Typograf options
 * @returns {import("astro").AstroIntegration}
 */
export default function (options = DEFAULT_OPTIONS) {
  const tp = new Typograf(options)
  return {
    name: 'typograf',
    hooks: {
      'astro:build:done': async ({ routes }) => {
        await Promise.all(
          extractPaths(routes)
            .map(path => fixHtmlTypography(path, tp))
        )
      }
    }
  }
}
