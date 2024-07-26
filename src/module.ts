import { defineNuxtModule, addComponent, createResolver, addImports, addTypeTemplate } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-codemirror',
    configKey: 'nuxtCodemirror',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
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

    _nuxt.hook('vite:extendConfig', (config) => {
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}

      // @ts-expect-error - Add alias for @codemirror/view
      config.resolve.alias['@codemirror/state'] = resolve(_nuxt.options.rootDir, 'node_modules/@codemirror/state')
    })
  },
})
