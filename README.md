# Nuxt CodeMirror

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Codemirror as a Nuxt module. Demo preview: Coming soon


- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/edit/nuxt-starter-ev2hgm?file=app.vue)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- 🚀 Easily configure codemirror to your own needs using almost every API
- 🚠 Built with Typescript
- 🌲 Custom useNuxtCodeMirror composable for creating your own editor
- Built for CodeMirror 6 and above

## Documentation

This module consists of one Component, one Composable and a few types for you to use. 
Read the CodeMirror Reference guide for more in depth information: [CodeMirror docs](https://codemirror.net/docs/ref/)

### NuxtCodeMirror.vue
This component is auto imported and is the CodeMirror wrapper.

Component props:

```ts
interface NuxtCodeMirrorProps
  extends Omit<EditorStateConfig, 'doc' | 'extensions'> {
  /** value of the auto created model in the editor. Works as underlying logic of a V-Model */
  modelValue?: string
  /** The height value of the editor. */
  height?: string
  /** The minimum height value of the editor. */
  minHeight?: string
  /** The maximum height value of the editor. */
  maxHeight?: string
  /** The width value of the editor. */
  width?: string
  /** The minimum width value of the editor. */
  minWidth?: string
  /** The maximum width value of the editor. */
  maxWidth?: string
  /** focus on the editor. */
  autoFocus?: boolean
  /** Enables a placeholder—a piece of example content to show when the editor is empty. */
  placeholder?: string | HTMLElement
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: 'light' | 'dark' | 'none' | Extension
  /**
   * Whether to optional basicSetup by default
   * @default true
   */
  basicSetup?: boolean | BasicSetupOptions
  /**
   * This disables editing of the editor content by the user.
   * @default true
   */
  editable?: boolean
  /**
   * This disables editing of the editor content by the user.
   * @default false
   */
  readOnly?: boolean
  /**
   * Controls whether pressing the `Tab` key inserts a tab character and indents the text (`true`)
   * or behaves according to the browser's default behavior (`false`).
   * @default true
   */
  indentWithTab?: boolean
  /** Fired whenever a change occurs to the document. */
  onChange?(value: string, viewUpdate: ViewUpdate): void
  /** Some data on the statistics editor. */
  onStatistics?(data: Statistics): void
  /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
  onUpdate?(viewUpdate: ViewUpdate): void
  /** The first time the editor executes the event. */
  onCreateEditor?(view: EditorView, state: EditorState): void
  /** Fired whenever the editor is focused. */
  onFocus?(view: ViewUpdate): void
  /** Fired whenever the editor is blurred. */
  onBlur?(view: ViewUpdate): void
  /**
   * Extension values can be [provided](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions) when creating a state to attach various kinds of configuration and behavior information.
   * They can either be built-in extension-providing objects,
   * such as [state fields](https://codemirror.net/6/docs/ref/#state.StateField) or [facet providers](https://codemirror.net/6/docs/ref/#state.Facet.of),
   * or objects with an extension in its `extension` property. Extensions can be nested in arrays arbitrarily deep—they will be flattened when processed.
   */
  extensions?: Extension[]
  /**
   * If the view is going to be mounted in a shadow root or document other than the one held by the global variable document (the default), you should pass it here.
   * Originally from the [config of EditorView](https://codemirror.net/6/docs/ref/#view.EditorView.constructor%5Econfig.root)
   */
  root?: ShadowRoot | Document
  /**
   * Create a state from its JSON representation serialized with [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) function
   */
  initialState?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields?: Record<string, StateField<any>>
  }
}
```

The NuxtCodeMirror component accepts a Template ref and exposes The CodeMirror div element, the Editor view and the Editor State

```ts
interface CodeMirrorRef {
  /** Container element of the CodeMirror instance */
  container: HTMLDivElement | null
  /** The EditorView of the CodeMirror instance */
  view: EditorView | undefined
  /** The EditorState of the CodeMirror instance */
  state: EditorState | undefined
  /** Editor element of the CodeMirror instance */
  editor: HTMLDivElement | null
}
```

If you need access to the underlying CodeMirror instance You can do so by adding a ref with the same name as your Template ref. 
An example on how to do this can be found here: [🏀 Online playground](https://stackblitz.com/edit/nuxt-starter-ev2hgm?file=app.vue)


If for some reason you want to write your own CodeMirror component then you can do that too :)

### UseNuxtCodeMirror.ts

This composable is the underlying magic of the NuxtCodeMirror component and is also auto imported.

It requires minimum 3 Refs, one for the div element CodeMirror will connect to, one for the CodeMirror view, and one for the CodeMirror state

Make sure you execute the composable in `onMounted` otherwise you will get an eror because codemirror can't be linked to the DOM.

```ts
const editor = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const view = ref<EditorView>()
const state = ref<EditorState>()

onMounted(() => {
  useNuxtCodeMirror({
    ...props,
    container: editor.value,
    viewRef: view,
    stateRef: state,
    containerRef: container,
  })
})
```

For more information on how this is implemented see the [source](https://github.com/ThimoDEV/nuxt-codemirror/blob/master/src/runtime/components/NuxtCodeMirror.vue), to get inspiration for your own version

## Credits

This Nuxt module wouldn't be possible without:

- @uiw/react-codemirror: https://github.com/uiwjs/react-codemirror
- @surmon-china/vue-codemirror: https://github.com/surmon-china/vue-codemirror

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-codemirror
```

That's it! You can now use Nuxt-codemirror in your Nuxt app ✨

### Tested extensions

Below is a list of tested extensions you can use as of @codemirror/view version 6.29.1 and @codemirror/state verion 6.4.1

- [LineNumbersRelative](https://www.npmjs.com/package/@uiw/codemirror-extensions-line-numbers-relative)
- [lang-javascript](https://www.npmjs.com/package/@codemirror/lang-javascript)
- [IndentationMarkers](https://github.com/replit/codemirror-indentation-markers)
- [interact](https://github.com/replit/codemirror-interact)
- [Themes -- like](https://www.npmjs.com/package/@uiw/codemirror-theme-okaidia)
- [Zebra Stripes](https://www.npmjs.com/package/@uiw/codemirror-extensions-zebra-stripes)

and many more...

## Contribution

If you have ideas or bugs feel free to start by opening an issue. For ideas please start a Discussion.

I welcome any kind of contribution Thank you in advance!!

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

Issue
- I get errors when starting the dev server with your module: `Pre-transform error: Failed to resolve import "@codemirror/view"`, `Pre-transform error: Failed to resolve import "@codemirror/state"`.

Solution
- Assuming you use pnpm with `shamefully-hoist=false` install `@codemirror/state` and `@codemirror/view` and these errors should disappear
