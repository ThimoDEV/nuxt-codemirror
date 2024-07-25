

# Nuxt CodeMirror

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Codemirror as a Nuxt module. Demo preview: Coming soon


- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- 🚀 Easily configure codemirror to your own needs using almost every API
- 🚠 Built with Typescript
- 🌲 Custom useNuxtCodeMirror composable for creating your own editor
- Built for CodeMirror 6 and above

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add thimodev/nuxt-codemirror
```

That's it! You can now use Nuxt-codemirror in your Nuxt app ✨

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  pnpm i

  # Generate type stubs
  pnpm dev:prepare

  # Develop with the playground
  pnpm dev

  # Build the playground
  pnpm dev:build

  # Run ESLint
  pnpm lint

  # Run Vitest
  pnpm test
  pnpm test:watch

  # Release new version
  pnpm release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-codemirror/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-codemirror

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-codemirror.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-codemirror

[license-src]: https://img.shields.io/npm/l/nuxt-codemirror.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-codemirror

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com



## FAQ

- I get an extension duplicate error:  Fix Unrecognized extension value in extension set ([object Object]). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.

For now write shamefully-hoist=true in your .npmrc file to solve this. We are working on a better solution
