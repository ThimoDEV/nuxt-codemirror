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
  (event: 'onChange', value: string, viewUpdate: ViewUpdate): void
  (event: 'onStatistics', data: Statistics): void
  (event: 'onCreateEditor', editor: { view: EditorView, state: EditorState }): void
  (event: 'onUpdate', update: ViewUpdate): void
}>()

onMounted(async () => {
  await nextTick()
  codemirror.value = useNuxtCodeMirror({
    ...props,
    container: editor.value,
    onChange: (value, viewUpdate) => emit('onChange', value, viewUpdate),
    onStatistics: data => emit('onStatistics', data),
    onCreateEditor: (view, state) => emit('onCreateEditor', { view, state }),
    onUpdate: viewUpdate => emit('onUpdate', viewUpdate),
  })
})

defineExpose({
  codemirror,
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
  />
</template>
