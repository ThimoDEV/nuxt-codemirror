import { defineNuxtModule, addComponent, createResolver, addImports } from '@nuxt/kit'

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
      name: 'NuxtCodemirror',
      filePath: resolve('./runtime/components/NuxtCodemirror.vue'),
      mode: 'client',
    })

    addComponent({
      name: 'NuxtCodemirrorTest',
      filePath: resolve('./runtime/components/NuxtCodemirrorTest.vue'),
      mode: 'client',
    })

    addImports({
      name: 'useNuxtCodeMirror',
      as: 'useNuxtCodeMirror',
      from: resolve('./runtime/composables/useNuxtCodeMirror.ts'),
    })
  },
})
