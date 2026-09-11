import { readFile } from "fs/promises"
import { load } from "cheerio"
import { bgGreen, bgRed, black } from "kleur/colors"
import assert from "node:assert/strict"

const langs = ["ru", "en"]

function reportError(lang) {
  console.error(bgRed(black(`Non breaking space not found in "${lang}"`)))
}

function reportSuccess() {
  console.log(bgGreen(black("The integration worked as intended")))
}

async function checkResults() {
  console.log("")
  console.log("Checking results")
  const html = await readFile("./dist/index.html")
  const $ = load(html)
  for (const lang of langs) {
    const content = $(`p[lang=${lang}]`).html()
    if (!content || !content.includes("&nbsp;")) {
      reportError(lang)
      process.exit(1)
    }
  }
  const markdown = load(await readFile("./dist/markdown/index.html"))
  // List items are outside the HTML selector, so only the Markdown plugin can fix them.
  assert.match(markdown("li").eq(0).text(), /на\u00a0русском/)
  assert.match(markdown("li").eq(1).text(), /in\u00a0English/)
  assert.equal(markdown("strong").text(), "выделением")
  assert.equal(markdown("a").attr("href"), "https://example.com")
  assert.equal(markdown("li code").text(), "Текст на русском")
  assert.equal(markdown("pre code").text().trim(), "Текст на русском")
  reportSuccess()
}

checkResults()
