# Astro Typograf Integration

A small library that adds typography fixes using the [typograf](https://www.npmjs.com/package/typograf) library to your [Astro](https://www.npmjs.com/package/astro) project.

Works with Astro v5 (tested on 5.13.5).

## Setup

### Using Astro CLI

```sh
npx astro add astro-typograf
```

### Manual

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

Additional options:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import typograf from 'astro-typograf'

export default defineConfig({
  integrations: [
    typograf({
      selector: 'p, h1, h2, h3', // CSS selectors to apply Typograf
      typografOptions: { // Typograf options
        locale: ['ru', 'en-US']
      }
    })
  ],
})
```

## Compatibility

- Astro: v5.x (tested on 5.13.5)
- Node: 18+

If you need support for older Astro versions, use a 2.x release of this package.
