export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: false },
  devServer: {
    port: 4000,
  },
  compatibilityDate: '2024-07-24',
  nuxtCodemirror: {},
},
)
