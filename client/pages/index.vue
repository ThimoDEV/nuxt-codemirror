<!-- eslint-disable max-len -->
<script setup lang="ts">
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

const client = useDevtoolsClient()
</script>

<template>
  <div class="relative n-bg-base flex flex-col h-screen">
    <header class="p4 flex items-center justify-between hover:bg-active p-2" border="b base">
      <div class="flex items-center gap-4">
        <h2 class="opacity-60 font-bold">
          CodeMirror DevTools
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <UButton variant="ghost" color="white" size="sm" icon="i-carbon-document" target="_blank"
          to="https://codemirror.net/docs/ref/" />
        <UButton variant="ghost" color="white" size="sm" icon="i-iconoir-github" target="_blank"
          to="https://github.com/ThimoDEV/nuxt-codemirror" />
      </div>
    </header>
    <div v-if="client" class="flex flex-col gap-2 p-2">
      Connected to the client.
    </div>
    <div v-else>
      <span class="text-yellow-500">
        Failed to connect to the client. Did you open this page inside Nuxt DevTools?
      </span>
    </div>
  </div>
</template>
