# Astro Typograf Integration

[![npm version](https://badge.fury.io/js/astro-typograf.svg)](https://badge.fury.io/js/astro-typograf) [![Quality assurance](https://github.com/mishamyrt/astro-typograf/actions/workflows/qa.yaml/badge.svg)](https://github.com/mishamyrt/astro-typograf/actions/workflows/qa.yaml)

A small library that adds typography fixes using the [typograf](https://www.npmjs.com/package/typograf) library to your [Astro](https://www.npmjs.com/package/astro) project.

Versions before **4.0.0** support remark/unified. Starting with **4.0.0**, this integration supports **Sätteri** and no longer supports remark/unified.

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
import { defineConfig } from "astro/config"
import typograf from "astro-typograf"

export default defineConfig({
  integrations: [typograf()],
})
```

Additional options:

```js
// astro.config.mjs
import { defineConfig } from "astro/config"
import typograf from "astro-typograf"

export default defineConfig({
  integrations: [
    typograf({
      selector: "p, h1, h2, h3", // CSS selectors to apply Typograf
      typografOptions: {
        // Typograf constructor options
        locale: ["ru", "en-US"],
        htmlEntity: { type: "name" },
      },
      // Rule-specific settings passed to Typograf#setSetting
      // Equivalent to: tp.setSetting('common/nbsp/afterShortWord', 'lengthShortWord', 3)
      typografSettings: {
        "common/nbsp/afterShortWord": { lengthShortWord: 3 },
      },
    }),
  ],
})
```

## Compatibility

- Astro: v7.x (tested on 7.3.2)
- Markdown processor: Sätteri (the default in Astro v7)
- Node: 22.12.0+

The integration adds a Sätteri text plugin to your configured processor, preserving existing MDAST/HAST plugins and feature options. It also applies typography fixes to statically generated HTML using the configured CSS selector.

If your project uses Astro v5/v6 or remark/unified, stay on the 3.x release:

```sh
npm install astro-typograf@3
```

For Astro versions older than v5, use a 2.x release of this package.
