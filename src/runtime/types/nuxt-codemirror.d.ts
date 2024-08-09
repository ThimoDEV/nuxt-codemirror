import type { EditorState, EditorStateConfig, Extension, StateField, EditorSelection, SelectionRange, Line } from '@codemirror/state'
import type { EditorView, ViewUpdate } from '@codemirror/view'
import type { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup'
import type { ModelRef } from 'vue'
import type { Ref } from '#imports'

export interface NuxtCodeMirrorProps
  extends Omit<EditorStateConfig, 'doc' | 'extensions'> {
  /** value of the auto created model in the editor. Works as underlying logic of a V-Model */
  modelValue?: ModelRef<string | undefined, string>
  /** The height value of the editor. */
  height?: string
  /** The minimum height value of the editor. */
  minHeight?: string
  /** The maximum height value of the editor. */
  maxHeight?: string
  /** The width value of the editor. */
  width?: string
  /** The minimum width value of the editor. */
  minWidth?: string
  /** The maximum width value of the editor. */
  maxWidth?: string
  /** focus on the editor. */
  autoFocus?: boolean
  /** Enables a placeholder—a piece of example content to show when the editor is empty. */
  placeholder?: string | HTMLElement
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: 'light' | 'dark' | 'none' | Extension
  /**
   * Whether to optional basicSetup by default
   * @default true
   */
  basicSetup?: boolean | BasicSetupOptions
  /**
   * This disables editing of the editor content by the user.
   * @default true
   */
  editable?: boolean
  /**
   * This disables editing of the editor content by the user.
   * @default false
   */
  readOnly?: boolean
  /**
   * Controls whether pressing the `Tab` key inserts a tab character and indents the text (`true`)
   * or behaves according to the browser's default behavior (`false`).
   * @default true
   */
  indentWithTab?: boolean
  /** Fired whenever a change occurs to the document. */
  onChange?(value: string, viewUpdate: ViewUpdate): void
  /** Some data on the statistics editor. */
  onStatistics?(data: Statistics): void
  /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
  onUpdate?(viewUpdate: ViewUpdate): void
  /** The first time the editor executes the event. */
  onCreateEditor?(view: EditorView, state: EditorState): void
  /** Fired whenever the editor is focused. */
  onFocus?(view: ViewUpdate): void
  /** Fired whenever the editor is blurred. */
  onBlur?(view: ViewUpdate): void
  /**
   * Extension values can be [provided](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions) when creating a state to attach various kinds of configuration and behavior information.
   * They can either be built-in extension-providing objects,
   * such as [state fields](https://codemirror.net/6/docs/ref/#state.StateField) or [facet providers](https://codemirror.net/6/docs/ref/#state.Facet.of),
   * or objects with an extension in its `extension` property. Extensions can be nested in arrays arbitrarily deep—they will be flattened when processed.
   */
  extensions?: Extension[]
  /**
   * If the view is going to be mounted in a shadow root or document other than the one held by the global variable document (the default), you should pass it here.
   * Originally from the [config of EditorView](https://codemirror.net/6/docs/ref/#view.EditorView.constructor%5Econfig.root)
   */
  root?: ShadowRoot | Document
  /**
   * Create a state from its JSON representation serialized with [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) function
   */
  initialState?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields?: Record<string, StateField<any>>
  }
}

export interface UseCodeMirrorProps extends NuxtCodeMirrorProps {
  /** Container element of the CodeMirror instance */
  container?: HTMLDivElement | null
  /** The EditorView of the CodeMirror instance */
  viewRef: Ref<EditorView | undefined>
  /** The EditorState of the CodeMirror instance */
  stateRef: Ref<EditorState | undefined>
  /** Editor element of the CodeMirror instance */
  containerRef: Ref<HTMLDivElement | null>
}

export interface Statistics {
  /** total length of the document */
  length: number
  /** Get the number of lines in the editor. */
  lineCount: number
  /** Get the currently line description around the given position. */
  line: Line
  /** Get the proper [line-break](https://codemirror.net/docs/ref/#state.EditorState^lineSeparator) string for this state. */
  lineBreak: string
  /** Returns true when the editor is [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only. */
  readOnly: boolean
  /** The size (in columns) of a tab in the document, determined by the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet. */
  tabSize: number
  /** Cursor Position */
  selection: EditorSelection
  /** Make sure the selection only has one range. */
  selectionAsSingle: SelectionRange
  /** Retrieves a list of all current selections. */
  ranges: readonly SelectionRange[]
  /** Get the currently selected code. */
  selectionCode: string
  /**
   * The length of the given array should be the same as the number of active selections.
   * Replaces the content of the selections with the strings in the array.
   */
  selections: string[]
  /** Return true if any text is selected. */
  selectedText: boolean
}

export interface CodeMirrorRef {
  /** Container element of the CodeMirror instance */
  container: HTMLDivElement | null
  /** The EditorView of the CodeMirror instance */
  view: EditorView | undefined
  /** The EditorState of the CodeMirror instance */
  state: EditorState | undefined
  /** Editor element of the CodeMirror instance */
  editor: HTMLDivElement | null
}
