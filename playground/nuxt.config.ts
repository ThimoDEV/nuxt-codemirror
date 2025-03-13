export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2024-07-24',
  nuxtCodemirror: {},
  devServer: {
    port: 4000,
  },
})
