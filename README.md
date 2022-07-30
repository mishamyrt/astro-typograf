# Astro Typograf Integration

A small library that adds typography fixes using the [typograf](https://www.npmjs.com/package/typograf) library to your [Astro](https://www.npmjs.com/package/astro) project

## Setup

Before you start using it, install the library.

```sh
npm install astro-typograf --save
```

Then put the integration in the Astro configuration file.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import typograf from 'astro-typograf'

export default defineConfig({
  integrations: [
    typograf()
  ],
})
```

