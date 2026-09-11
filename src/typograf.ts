import type Typograf from "typograf"
import type { MdastPluginDefinition } from "satteri"
import { readFile, writeFile } from "node:fs/promises"
import { load } from "cheerio"

/**
 * Creates a Sätteri plugin that improves Markdown text typography.
 */
export function createSatteriPlugin(tp: Typograf): MdastPluginDefinition {
  return {
    name: "typograf",
    text(node, ctx) {
      ctx.setProperty(node, "value", tp.execute(node.value))
    },
  }
}

/**
 * Improves the typography in the file on the specified path.
 */
export async function fixHtmlTypography(
  path: string,
  tp: Typograf,
  selector: string,
): Promise<void> {
  const content = await readFile(path)
  const $ = load(content, {
    xml: {
      xmlMode: false,
      decodeEntities: false,
    },
  })

  $(selector).each((i, node) => {
    const el = $(node)
    const html = el.html()
    if (!html) return
    el.html(tp.execute(html))
  })
  await writeFile(path, $.html())
}
