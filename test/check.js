import { readFile } from 'fs/promises'
import { load } from 'cheerio'
import { bgGreen, bgRed, black } from 'kleur/colors'

const langs = ['ru', 'en']

function reportError (lang) {
  console.error(
    bgRed(
      black(`Non breaking space not found in "${lang}"`)
    )
  )
}

function reportSuccess () {
  console.log(
    bgGreen(
      black('The integration worked as intended')
    )
  )
}

async function checkResults () {
  console.log('')
  console.log('Checking results')
  const html = await readFile('./dist/index.html')
  const $ = load(html)
  for (const lang of langs) {
    const content = $(`p[lang=${lang}]`).html()
    if (!content || !content.includes('&nbsp;')) {
      reportError(lang)
      process.exit(1)
    }
  }
  reportSuccess()
}

checkResults()
