import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

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
  },
})
