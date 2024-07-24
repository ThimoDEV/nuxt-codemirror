<script setup lang="ts">
import type { EditorView, ViewUpdate } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { useNuxtCodeMirror } from '../composables/useNuxtCodeMirror'
import type { NuxtCodeMirrorProps } from '../types'
import type { Statistics } from '../utils'
import { onMounted, ref, useAttrs, watch } from '#imports'

const props = withDefaults(defineProps<NuxtCodeMirrorProps>(), {
  modelValue: '',
  extensions: () => [],
  theme: 'light',
})

const div = ref<HTMLDivElement | null>(null)

const emit = defineEmits<{
  (event: 'update:value', value: string, viewUpdate: ViewUpdate): void
  (event: 'statistics', stats: Statistics): void
  (event: 'createEditor', editor: { view: EditorView, state: EditorState }): void
  (event: 'update', update: ViewUpdate): void
}>()

const { state, view, container } = useNuxtCodeMirror({
  container: div.value,
  ...props,
  modelValue: props.modelValue,
  // TS doesn't like the `emit` function
  onChange: (value, viewUpdate) => emit('update:value', value, viewUpdate),
  onStatistics: data => emit('statistics', data),
  onCreateEditor: (view, state) => emit('createEditor', { view, state }),
  onUpdate: viewUpdate => emit('update', viewUpdate),
})

defineExpose({
  state,
  view,
  container,
})

const attrs = useAttrs()

watch(() => props.modelValue, (newValue) => {
  if (typeof newValue !== 'string') {
    console.error(`value must be typeof string but got ${typeof newValue}`)
  }
})

const defaultClassNames = typeof props.theme === 'string' ? `cm-theme-${props.theme}` : 'cm-theme'

onMounted(() => {
  console.log(div.value)
  console.log('bla', state.value, view.value, container.value)
  if (view.value) {
    view.value.dispatch({ changes: { from: 0, insert: props.modelValue } })
  }
})
</script>

<template>
  <div
    ref="div"
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
