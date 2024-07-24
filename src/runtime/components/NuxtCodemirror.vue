<script setup lang="ts">
import type { EditorView, ViewUpdate } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { useNuxtCodeMirror } from '../composables/useNuxtCodeMirror'
import type { NuxtCodeMirrorProps } from '../types'
import type { Statistics } from '../utils'
import { onMounted, ref, useAttrs, watch, nextTick, type Ref } from '#imports'

const props = withDefaults(defineProps<NuxtCodeMirrorProps>(), {
  modelValue: '',
  extensions: () => [],
  theme: 'light',
})

const editor = ref<HTMLDivElement | null>(null)
const codemirror = ref<{ container: Ref<HTMLDivElement | null>, view: Ref<EditorView | undefined>, state: Ref<EditorState | undefined> }>()

const emit = defineEmits<{
  (event: 'update:value', value: string, viewUpdate: ViewUpdate): void
  (event: 'statistics', stats: Statistics): void
  (event: 'createEditor', editor: { view: EditorView, state: EditorState }): void
  (event: 'update', update: ViewUpdate): void
}>()

onMounted(async () => {
  await nextTick()
  codemirror.value = useNuxtCodeMirror({
    container: editor.value,
    ...props,
    onChange: (value, viewUpdate) => emit('update:value', value, viewUpdate),
    onStatistics: data => emit('statistics', data),
    onCreateEditor: (view, state) => emit('createEditor', { view, state }),
    onUpdate: viewUpdate => emit('update', viewUpdate),
  })
})

defineExpose({
  codemirror
})

const attrs = useAttrs()

watch(() => props.modelValue, (newValue) => {
  if (typeof newValue !== 'string') {
    console.error(`value must be typeof string but got ${typeof newValue}`)
  }
})

const defaultClassNames = typeof props.theme === 'string' ? `cm-theme-${props.theme}` : 'cm-theme'
</script>

<template>
  <div
    ref="editor"
    :class="`${defaultClassNames}${attrs.class ? ` ${attrs.class}` : ''}`"
    v-bind="attrs"
    class="editor-container"
  />
</template>

<style scoped>
.editor-container {
  width: 1500px;
  height: 400px;
}
</style>
