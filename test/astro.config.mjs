import { defineConfig } from 'astro/config'
import typograf from '../lib/index.esm'

// https://astro.build/config
export default defineConfig({
  integrations: [
    typograf()
  ]
})
