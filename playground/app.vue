<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript'
import { lineNumbersRelative } from '@uiw/codemirror-extensions-line-numbers-relative'
import { okaidia } from '@uiw/codemirror-theme-okaidia'

import type { ViewUpdate } from '@codemirror/view'
import type { CodeMirrorRef, Statistics } from '../src/runtime/types/nuxt-codemirror'

const code = ref('console.log("Hello, CodeMirror!");')
// const theme = ref<'light' | 'dark' | 'none'>('light')
const codemirror = ref<CodeMirrorRef>()

const extensions = [lineNumbersRelative, javascript({ jsx: true, typescript: true })]

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

onMounted(() => {
  if (codemirror.value) {
    console.log('Log editorRef', codemirror.value.editor)
    console.log('Log containerRef', codemirror.value.container)
  }

  watchEffect(() => {
    if (codemirror.value) {
      console.log('Log StateRef', codemirror.value.state)
      console.log('Log viewRef', codemirror.value.view)
    }
  })
})
</script>

<template>
  <NuxtCodeMirror
    ref="codemirror"
    v-model="code"
    :extensions="extensions"
    style="width: 500px; height: 400px;"
    :theme="okaidia"
    placeholder="Enter your code here..."
    :auto-focus="true"
    :editable="true"
    :basic-setup="true"
    :indent-with-tab="true"
    @on-change="handleChange"
    @statistics="handleStatistics"
    @on-update="handleUpdate"
  />
  <div>{{ code }}</div>
  <input
    v-model="code"
    type="text"
  >
</template>
