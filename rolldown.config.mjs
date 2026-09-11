import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"

export default defineConfig({
  input: "src/index.ts",
  plugins: [dts()],
  external: [
    "kleur/colors",
    "typograf",
    "deepmerge",
    "astro",
    "@astrojs/markdown-satteri",
    "cheerio",
  ],
  output: {
    dir: "lib",
    format: "esm",
    sourcemap: true,
  },
})
