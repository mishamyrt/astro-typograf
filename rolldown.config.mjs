import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"

export default defineConfig({
  input: "src/index.ts",
  plugins: [dts()],
  external: [
    "node:url",
    "node:fs/promises",
    "node:path",
    "node:fs/promises",
    "@astrojs/markdown-satteri",
    "astro",
    "cheerio",
    "deepmerge",
    "kleur/colors",
    "typograf",
  ],
  output: {
    dir: "lib",
    format: "esm",
    sourcemap: true,
  },
})
