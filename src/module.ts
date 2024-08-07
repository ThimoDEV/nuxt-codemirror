import { defineNuxtModule, addComponent, createResolver, addImports, extendViteConfig, addTypeTemplate } from '@nuxt/kit'

// Module options TypeScript interface definition
// export interface ModuleOptions {}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-codemirror',
    configKey: 'nuxtCodemirror',
  },
  // Default configuration options of the Nuxt module
  // defaults: {},
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'NuxtCodeMirror',
      filePath: resolve('./runtime/components/NuxtCodeMirror.vue'),
    })

    addImports({
      name: 'useNuxtCodeMirror',
      as: 'useNuxtCodeMirror',
      from: resolve('./runtime/composables/useNuxtCodeMirror.ts'),
    })

    addTypeTemplate({
      filename: 'nuxt-codemirror.d.ts',
      src: resolve('./runtime/types/nuxt-codemirror.d.ts'),
    })

    extendViteConfig((config) => {
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}

      // @ts-expect-error - Add alias for @codemirror/state
      config.resolve.alias['@codemirror/state'] = resolve(_nuxt.options.rootDir, 'node_modules/@codemirror/state')
      // @ts-expect-error - Add alias for @codemirror/view
      config.resolve.alias['@codemirror/view'] = resolve(_nuxt.options.rootDir, 'node_modules/@codemirror/view')
    })
  },
})
