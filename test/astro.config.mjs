import { defineConfig } from "astro/config"
import typograf from "../lib/index"

// https://astro.build/config
export default defineConfig({
  integrations: [typograf()],
})
