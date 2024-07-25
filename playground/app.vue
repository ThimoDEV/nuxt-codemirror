<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript'

import type { ViewUpdate } from '@codemirror/view'
import type { Statistics } from '../src/runtime/utils'

const code = ref('console.log("Hello, CodeMirror!");')
const theme = ref<'light' | 'dark' | 'none'>('light')
const codemirror = ref()

const extensions = [javascript({ jsx: true, typescript: true })]

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

onMounted(async () => {
  await nextTick()

  watchEffect(() => {
    console.log('blaaaaa', codemirror.value.view)
  })
})
</script>

<template>
  <div style="width: 800px; height: 400px;">
    <NuxtCodeMirror
      ref="codemirror"
      v-model="code"
      :extensions="extensions"
      :theme="theme"
      placeholder="Enter your code here..."
      :auto-focus="true"
      :editable="true"
      :basic-setup="true"
      :indent-with-tab="true"
      @on-change="handleChange"
      @statistics="handleStatistics"
      @on-update="handleUpdate"
    />
  </div>
</template>
