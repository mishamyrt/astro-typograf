import type Typograf from 'typograf'
import { type Plugin } from 'unified'
import { readFile, writeFile } from 'fs/promises'
import { load } from 'cheerio'
import { visit } from 'unist-util-visit'

/**
 * Creates typographer remark plugin.
 */
export function createPlugin (tp: Typograf): Plugin {
  return function () {
    return function (tree: any) {
      visit(tree, 'text', (node) => {
        node.value = tp.execute(node.value)
      })
    }
  }
}

/**
 * Improves the typography in the file on the specified path.
 */
export async function fixHtmlTypography (
  path: string,
  tp: Typograf,
  selector: string
): Promise<void> {
  const content = await readFile(path)
  const $ = load(content)
  $(selector).each((i, node) => {
    const el = $(node)
    const html = el.html()
    if (!html) return
    el.html(
      tp.execute(html)
    )
  })
  await writeFile(path, $.html())
}
