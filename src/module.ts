import { dirname } from 'node:path'
import { createRequire } from 'node:module'
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
    const codemirrorSingletonPackages = ['@codemirror/state', '@codemirror/view', '@codemirror/language', '@lezer/highlight'] as const
    const require = createRequire(import.meta.url)
    const resolvePackageRoot = (packageName: string): string | null => {
      try {
        return dirname(require.resolve(`${packageName}/package.json`))
      }
      catch {
        // In pnpm layouts, @lezer/highlight may only be resolvable from @codemirror/language context.
        if (packageName === '@lezer/highlight') {
          try {
            const languagePackagePath = require.resolve('@codemirror/language/package.json')
            const languageRequire = createRequire(languagePackagePath)
            return dirname(languageRequire.resolve('@lezer/highlight/package.json'))
          }
          catch {
            return null
          }
        }
        return null
      }
    }
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
      config.resolve.dedupe = Array.from(new Set([...(config.resolve.dedupe || []), ...codemirrorSingletonPackages]))

      for (const packageName of codemirrorSingletonPackages) {
        const packageRoot = resolvePackageRoot(packageName)
        if (packageRoot) {
          // Force all app/module imports to the same package instance.
          // @ts-expect-error - Vite alias map accepts string keys.
          config.resolve.alias[packageName] = packageRoot
        }
      }
    })
  },
})
