<script setup lang="ts">
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { onMounted, ref } from '#imports'

// const props = defineProps({
//   doc: {
//     type: String,
//     required: true,
//   },
//   extensions: {
//     type: Array as PropType<Extension[]>,
//     default: () => [],
//   },
//   klass: {
//     type: String,
//     default: '',
//   },
// })

const parent = ref<HTMLElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let view: EditorView | null = null

onMounted(() => {
  if (parent.value) {
    view = new EditorView({
      state: EditorState.create({
        doc: 'hello world',
        extensions: [basicSetup],
        // extensions: props.extensions.length > 0 ? props.extensions : [],
      }),
      parent: parent.value,
    })
  }
})
</script>

<template>
  <div
    ref="parent"
    class="editor-container"
  />
</template>

<style>
.editor-container {
  width: 800px;
  height: 400px;
}
</style>
