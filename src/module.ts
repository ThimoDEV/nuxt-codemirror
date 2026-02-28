import { dirname, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
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
    const codemirrorSingletonPackages = [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/language',
      '@codemirror/autocomplete',
      '@codemirror/commands',
      '@codemirror/lint',
      '@codemirror/search',
      '@codemirror/theme-one-dark',
      '@codemirror/lang-javascript',
      '@lezer/common',
      '@lezer/highlight',
      '@lezer/lr',
      '@lezer/javascript',
    ] as const
    const moduleRequire = createRequire(import.meta.url)
    const appRequire = createRequire(resolve(_nuxt.options.rootDir, 'package.json'))
    const requireContexts = [appRequire, moduleRequire]
    const parentResolvePackages = ['@codemirror/language', '@codemirror/lang-javascript'] as const

    const resolvePackageEntry = (requireContext: NodeRequire, packageName: string): string | null => {
      try {
        return requireContext.resolve(packageName)
      }
      catch {
        return null
      }
    }

    const findPackageRootFromEntry = (entryPath: string, packageName: string): string | null => {
      let currentDir = dirname(entryPath)
      let previousDir = ''

      while (currentDir !== previousDir) {
        const packageJsonPath = resolve(currentDir, 'package.json')
        if (existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string }
            if (packageJson.name === packageName) {
              return currentDir
            }
          }
          catch {
            // Ignore parse errors and continue walking up.
          }
        }

        previousDir = currentDir
        currentDir = dirname(currentDir)
      }

      return null
    }

    const resolvePackageRoot = (packageName: string): string | null => {
      for (const requireContext of requireContexts) {
        const packageEntry = resolvePackageEntry(requireContext, packageName)
        if (!packageEntry) {
          continue
        }

        const packageRoot = findPackageRootFromEntry(packageEntry, packageName)
        if (packageRoot) {
          return packageRoot
        }
      }

      // In pnpm/npm layouts, some Lezer packages can be nested under parent CodeMirror packages.
      for (const requireContext of requireContexts) {
        for (const parentPackage of parentResolvePackages) {
          const parentPackageEntry = resolvePackageEntry(requireContext, parentPackage)
          if (!parentPackageEntry) {
            continue
          }

          const parentRequire = createRequire(parentPackageEntry)
          const packageEntry = resolvePackageEntry(parentRequire, packageName)
          if (!packageEntry) {
            continue
          }

          const packageRoot = findPackageRootFromEntry(packageEntry, packageName)
          if (packageRoot) {
            return packageRoot
          }
        }
      }

      return null
    }
    _nuxt.options.alias['#codemirror'] = resolver.resolve('./runtime')
    const resolvedSingletonRoots = new Map<string, string>()
    for (const packageName of codemirrorSingletonPackages) {
      const packageRoot = resolvePackageRoot(packageName)
      if (packageRoot) {
        resolvedSingletonRoots.set(packageName, packageRoot)
        // Keep Nuxt resolver aligned with Vite for SSR and type/runtime consistency.
        _nuxt.options.alias[packageName] = packageRoot
      }
    }

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
      config.resolve.dedupe = Array.from(new Set([...(config.resolve.dedupe || []), ...codemirrorSingletonPackages]))
      const existingAlias = config.resolve.alias || {}
      const aliasArray = Array.isArray(existingAlias)
        ? existingAlias
        : Object.entries(existingAlias).map(([find, replacement]) => ({ find, replacement }))

      for (const [packageName, packageRoot] of resolvedSingletonRoots) {
        // Force all app/module imports to the same package instance.
        const existingAliasEntry = aliasArray.find(aliasEntry => aliasEntry.find === packageName)
        if (existingAliasEntry) {
          existingAliasEntry.replacement = packageRoot
        }
        else {
          aliasArray.push({ find: packageName, replacement: packageRoot })
        }
      }

      config.resolve.alias = aliasArray
    })
  },
})
