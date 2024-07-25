<script setup lang="ts">
import type { ViewUpdate, EditorView } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { useNuxtCodeMirror } from '../composables/useNuxtCodeMirror'
import type { NuxtCodeMirrorProps } from '../types'
import type { Statistics } from '../utils'
import { onMounted, ref, watch, nextTick, computed } from '#imports'

const props = withDefaults(defineProps<NuxtCodeMirrorProps>(), {
  modelValue: '',
  extensions: () => [],
  theme: 'light',
})

const editor = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const view = ref<EditorView>()
const state = ref<EditorState>()

defineExpose({
  container,
  view,
  state,
  editor,
})

const emit = defineEmits<{
  (event: 'onChange', value: string, viewUpdate: ViewUpdate): void
  (event: 'onStatistics', data: Statistics): void
  (event: 'onCreateEditor', editor: { view: EditorView, state: EditorState }): void
  (event: 'onUpdate' | 'onFocus' | 'onBlur', update: ViewUpdate): void
}>()

onMounted(async () => {
  await nextTick()

  useNuxtCodeMirror({
    ...props,
    onChange: (value, viewUpdate) => emit('onChange', value, viewUpdate),
    onStatistics: data => emit('onStatistics', data),
    onCreateEditor: (view, state) => emit('onCreateEditor', { view, state }),
    onUpdate: viewUpdate => emit('onUpdate', viewUpdate),
    onFocus: viewUpdate => emit('onFocus', viewUpdate),
    onBlur: viewUpdate => emit('onBlur', viewUpdate),
    container: editor.value,
    viewRef: view,
    stateRef: state,
    containerRef: container,
  })

  // await nextTick()

  // console.log('test: ', view.value)
})

watch(() => props.modelValue, (newValue) => {
  if (typeof newValue !== 'string') {
    console.error(`value must be typeof string but got ${typeof newValue}`)
  }
})

const defaultClassNames = computed(() =>
  typeof props.theme === 'string' ? `cm-theme-${props.theme}` : 'cm-theme',
)
</script>

<template>
  <div
    ref="editor"
    :class="`${defaultClassNames}${$attrs.class ? ` ${$attrs.class}` : ''}`"
    v-bind="$attrs"
  />
</template>
