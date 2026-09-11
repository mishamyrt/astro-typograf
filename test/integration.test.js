import assert from "node:assert/strict"
import { test } from "node:test"
import { satteri } from "@astrojs/markdown-satteri"
import { load } from "cheerio"
import typograf from "../lib/index.js"

test("preserves Sätteri plugins and features while applying Typograf settings", async () => {
  const mdastPlugin = {
    name: "replace-marker",
    text(node, ctx) {
      if (node.value === "MARKER") {
        ctx.setProperty(node, "value", "Текст для проверки")
      }
    },
  }
  const hastPlugin = {
    name: "mark-paragraphs",
    element: {
      filter: ["p"],
      visit(node, ctx) {
        ctx.setProperty(node, "className", "kept")
      },
    },
  }
  const processor = satteri({
    features: { gfm: false, smartPunctuation: false },
    mdastPlugins: [mdastPlugin],
    hastPlugins: [hastPlugin],
  })
  const integration = typograf({
    typografOptions: { disableRule: ["common/punctuation/quote"] },
    typografSettings: {
      "common/nbsp/afterShortWord": { lengthShortWord: 3 },
    },
  })
  integration.hooks["astro:config:done"]({ config: { markdown: { processor } } })

  const renderer = await processor.createRenderer({ syntaxHighlight: false })
  const { code } = await renderer.render('MARKER\n\n~~strike~~ "quote"')
  const $ = load(code)
  assert.equal($("p").eq(0).text(), "Текст для\u00a0проверки")
  assert.equal($("p").eq(1).text(), '~~strike~~ "quote"')
  assert.equal($("p.kept").length, 2)
})

test("explains the version to use with remark/unified", () => {
  const integration = typograf()
  assert.throws(
    () =>
      integration.hooks["astro:config:done"]({
        config: { markdown: { processor: { name: "unified", options: {} } } },
      }),
    /Sätteri.*astro-typograf@3/,
  )
})
