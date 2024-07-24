import { Annotation, EditorState, StateEffect, type Extension } from '@codemirror/state'
import { EditorView, type ViewUpdate } from '@codemirror/view'
import { getDefaultExtensions } from '../getDefaultExtensions'
import { type NuxtCodeMirrorProps } from '../types'
import { getStatistics } from '../utils'
import { ref, watch, watchEffect } from '#imports'

const External = Annotation.define<boolean>()

export interface UseCodeMirror extends NuxtCodeMirrorProps {
  container?: HTMLDivElement | null
}

const emptyExtensions: Extension[] = []

export function useNuxtCodeMirror(props: UseCodeMirror) {
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
  } = props

  const container = ref<HTMLDivElement | null>(null)
  const view = ref<EditorView>()
  const state = ref<EditorState>()
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

  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (
      vu.docChanged
      && typeof onChange === 'function'
      // Fix echoing of the remote changes:
      // If transaction is market as remote we don't have to call `onChange` handler again
      && !vu.transactions.some(tr => tr.annotation(External))
    ) {
      const doc = vu.state.doc
      const value = doc.toString()
      onChange(value, vu)
    }
    onStatistics && onStatistics(getStatistics(vu))
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
    if (container.value && !state.value) {
      const config = {
        doc: value,
        selection,
        extensions: getExtensions,
      }
      const stateCurrent = initialState
        ? EditorState.fromJSON(initialState.json, config, initialState.fields)
        : EditorState.create(config)
      state.value = stateCurrent
      if (!view.value) {
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container.value,
          root,
        })
        view.value = viewCurrent
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent)
      }
    }
    return () => {
      if (view) {
        view.value = undefined
        state.value = undefined
      }
    }
  })

  watch(
    () => props.container,
    (newContainer) => {
      if (newContainer === undefined) return
      container.value = newContainer
    },
    { immediate: true },
  )

  watch(view, (view) => {
    if (view) {
      view.destroy()
      view = undefined
    }
  }, { immediate: true })

  watch([() => autoFocus, () => view.value], ([autoFocus, view]) => {
    if (autoFocus && view) {
      view.focus()
    }
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
    if (view.value) {
      view.value.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) })
    }
  },
  { immediate: true },
  )

  watchEffect(() => {
    if (value === undefined) {
      return
    }

    const currentValue = view.value ? view.value.state.doc.toString() : ''
    if (view.value && value !== currentValue) {
      view.value.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
        annotations: [External.of(true)],
      })
    }
  })

  return {
    container,
    view,
    state,
  }
}
