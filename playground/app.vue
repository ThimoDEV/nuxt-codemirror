<script setup lang="ts">
// import { javascript } from '@codemirror/lang-javascript'

import type { ViewUpdate } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import type { Statistics } from '../src/runtime/utils'

const code = ref('console.log("Hello, CodeMirror!");')
const theme = ref<'light' | 'dark' | 'none'>('light')
const extensions = [basicSetup]

const handleChange = (value: string, viewUpdate: ViewUpdate) => {
  console.log('Value changed:', value)
  console.log('View updated:', viewUpdate)
}

const handleStatistics = (stats: Statistics) => {
  console.log('Editor statistics:', stats)
}

const handleUpdate = (viewUpdate: ViewUpdate) => {
  console.log('Editor updated:', viewUpdate)
}
</script>

<template>
  <div style="width: 800px; height: 400px;">
      <NuxtCodemirror
        v-model="code"
        :extensions="extensions"
        :theme="theme"
        placeholder="Enter your code here..."
        :auto-focus="true"
        :editable="true"
        :basic-setup="true"
        :indent-with-tab="true"
        @change="handleChange"
        @statistics="handleStatistics"
        @update="handleUpdate"
      />
  </div>
</template>
