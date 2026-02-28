export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  devServer: {
    port: 4000,
  },
  compatibilityDate: 'latest',
  nuxtCodemirror: {
    devtools: true,
  },
},
)
