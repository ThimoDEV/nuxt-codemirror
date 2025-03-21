<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript'
import type { ViewUpdate } from '@codemirror/view'
// import { minimalSetup } from 'codemirror'

const code = ref('console.log("Hello, CodeMirror!");')
// const theme = ref<'light' | 'dark' | 'none'>('light')
const codemirror = ref()

const handleChange = (value: string, viewUpdate: ViewUpdate) => {
  console.log('Value changed:', value)
  console.log('View updated:', viewUpdate)
}

const handleStatistics = (stats: any) => {
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

<!-- Adding minimalSetup in the extensions array makes highlighting work, while it should work with basicSetup == true -->

<template>
  <div>
    <NuxtCodeMirror
      ref="codemirror"
      v-model="code"
      style="width: 500px; height: 400px;"
      placeholder="Enter your code here..."
      :auto-focus="true"
      :editable="true"
      :extensions="[javascript()]"
      :basic-setup="[true]"
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
  </div>
</template>
