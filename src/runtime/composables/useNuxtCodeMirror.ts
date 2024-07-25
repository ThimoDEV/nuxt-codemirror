import { Annotation, EditorState, StateEffect, type Extension } from '@codemirror/state'
import { EditorView, type ViewUpdate } from '@codemirror/view'
import { getDefaultExtensions } from '../getDefaultExtensions'
import { type NuxtCodeMirrorProps } from '../types'
import { getStatistics } from '../utils'
import { onBeforeUnmount, watch, watchEffect, type Ref } from '#imports'

const External = Annotation.define<boolean>()

export interface UseCodeMirrorProps extends NuxtCodeMirrorProps {
  container?: HTMLDivElement | null
  viewRef: Ref<EditorView | undefined>
  stateRef: Ref<EditorState | undefined>
  containerRef: Ref<HTMLDivElement | null>
}

const emptyExtensions: Extension[] = []

// TODO: setStyle, Translations, disabled,

export function useNuxtCodeMirror(props: UseCodeMirrorProps) {
  const {
    modelValue: value = '',
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions = emptyExtensions,
    autoFocus,
    theme = 'light',
    height = null,
    minHeight = null,
    maxHeight = null,
    width = null,
    minWidth = null,
    maxWidth = null,
    placeholder: placeholderStr = '',
    editable = true,
    readOnly = false,
    indentWithTab: defaultIndentWithTab = true,
    basicSetup: defaultBasicSetup = true,
    root,
    initialState,
    containerRef,
    viewRef,
    stateRef,
  } = props

  // const container = ref<HTMLDivElement | null>(null)
  // const view = ref<EditorView>()
  // const state = ref<EditorState>()

  const defaultThemeOption = EditorView.theme({
    '&': {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
    },
    '& .cm-scroller': {
      height: '100% !important',
    },
  })

  const updateListener = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    // TODO: Add focusChangedEvent, onUpdate event, onBlurred event
    if (
      viewUpdate.docChanged
      && typeof onChange === 'function'
      // Fix echoing of the remote changes:
      // If transaction is market as remote we don't have to call `onChange` handler again
      && !viewUpdate.transactions.some(tr => tr.annotation(External))
    ) {
      const doc = viewUpdate.state.doc
      const value = doc.toString()
      onChange(value, viewUpdate)
    }
    onStatistics && onStatistics(getStatistics(viewUpdate))
  })

  const defaultExtensions = getDefaultExtensions({
    theme,
    editable,
    readOnly,
    placeholder: placeholderStr,
    indentWithTab: defaultIndentWithTab,
    basicSetup: defaultBasicSetup,
  })

  let getExtensions = [updateListener, defaultThemeOption, ...defaultExtensions]

  if (onUpdate && typeof onUpdate === 'function') {
    getExtensions.push(EditorView.updateListener.of(onUpdate))
  }
  getExtensions = getExtensions.concat(extensions)

  watchEffect(() => {
    if (containerRef.value && !stateRef?.value) {
      const config = {
        doc: value,
        selection,
        extensions: getExtensions,
      }
      const stateCurrent = initialState
        ? EditorState.fromJSON(initialState.json, config, initialState.fields)
        : EditorState.create(config)
      stateRef.value = stateCurrent
      if (!viewRef.value) {
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: containerRef.value,
          root,
        })
        viewRef.value = viewCurrent
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent)
      }
    }
  })

  watch(
    () => props.container,
    (newContainer) => {
      if (newContainer === undefined) return
      containerRef.value = newContainer
    },
    { immediate: true },
  )

  watch([
    () => theme,
    () => extensions,
    () => height,
    () => minHeight,
    () => maxHeight,
    () => width,
    () => minWidth,
    () => maxWidth,
    () => placeholderStr,
    () => editable,
    () => readOnly,
    () => defaultIndentWithTab,
    () => defaultBasicSetup,
    () => onChange,
    () => onUpdate,
  ],
  () => {
    if (viewRef.value) {
      viewRef.value.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) })
    }
  },
  { immediate: true },
  )

  watchEffect(() => {
    if (value === undefined) {
      return
    }

    const currentValue = viewRef.value ? viewRef.value.state.doc.toString() : ''
    if (viewRef.value && value !== currentValue) {
      viewRef.value.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
        annotations: [External.of(true)],
      })
    }
  })

  watch([() => autoFocus, () => viewRef.value], ([autoFocus, view]) => {
    if (autoFocus && view) {
      view.focus()
    }
  },
  { immediate: true },
  )

  onBeforeUnmount(() => {
    if (viewRef) {
      viewRef.value?.destroy()
      viewRef.value = undefined
    }
  })

  return {
    containerRef,
    viewRef,
    stateRef,
  }
}
