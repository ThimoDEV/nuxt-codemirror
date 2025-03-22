import { resolve } from 'pathe'

export default defineNuxtConfig({

  modules: [
    '@nuxt/devtools-ui-kit',
    '@nuxt/icon',
    '@nuxt/ui',
  ],
  ssr: false,

  app: {
    baseURL: '/__codemirror_nuxt_devtools',
  },

  compatibilityDate: '2025-03-16',

  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },

  icon: {
    size: '24px', // default <Icon> size applied
    class: 'icon', // default <Icon> class applied
    aliases: {
      mesh: 'carbon:code',
    },
  },
})
