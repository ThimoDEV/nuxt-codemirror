import { defineNuxtModule, addComponent, createResolver, addImports, extendViteConfig, addTypeTemplate } from '@nuxt/kit'
// import { setupDevToolsUI } from './devtools'

export interface ModuleOptions {
  devtools?: boolean
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-codemirror',
    configKey: 'nuxtCodemirror',
  },
  defaults: {
    // devtools: false,
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    _nuxt.options.alias['#codemirror'] = resolver.resolve('./runtime')

    // if (_options.devtools) {
    //   setupDevToolsUI(_nuxt, resolver)
    // }

    addComponent({
      name: 'NuxtCodeMirror',
      filePath: resolver.resolve('./runtime/components/NuxtCodeMirror.vue'),
    })

    addImports({
      name: 'useNuxtCodeMirror',
      as: 'useNuxtCodeMirror',
      from: resolver.resolve('./runtime/composables/useNuxtCodeMirror.ts'),
    })

    addTypeTemplate({
      filename: 'nuxt-codemirror.d.ts',
      src: resolver.resolve('./runtime/types/nuxt-codemirror.d.ts'),
    })

    extendViteConfig((config) => {
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}

      // @ts-expect-error - Add alias for @codemirror/state
      config.resolve.alias['@codemirror/state'] = resolver.resolve(_nuxt.options.rootDir, 'node_modules/@codemirror/state')
      // @ts-expect-error - Add alias for @codemirror/view
      config.resolve.alias['@codemirror/view'] = resolver.resolve(_nuxt.options.rootDir, 'node_modules/@codemirror/view')
    })
  },
})
