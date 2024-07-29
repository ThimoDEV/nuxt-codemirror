<script setup lang="ts">
import type { ViewUpdate, EditorView } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { useNuxtCodeMirror } from '../composables/useNuxtCodeMirror'
import type { NuxtCodeMirrorProps, Statistics } from '../types/nuxt-codemirror'
import { onMounted, ref, watch, computed, onBeforeUnmount } from '#imports'

const editor = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const view = ref<EditorView>()
const state = ref<EditorState>()

const modelValue = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<Omit<NuxtCodeMirrorProps, 'modelValue'>>(), {
  extensions: () => [],
  theme: 'light',
})

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

onMounted(() => {
  useNuxtCodeMirror({
    ...props,
    modelValue: modelValue.value,
    onChange: (value, viewUpdate) => {
      modelValue.value = value
      emit('onChange', value, viewUpdate)
    },
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

  /** DEBUGGING the variables exposed by defineExpose */
  // await nextTick()
  // console.log('test: ', view.value)
})

onBeforeUnmount(() => {
  if (view.value) {
    view.value?.destroy()
    view.value = undefined
  }
})

watch(() => modelValue, (newValue) => {
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
