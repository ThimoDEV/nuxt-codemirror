import type { Extension } from '@codemirror/state'
import { indentWithTab, history, defaultKeymap, historyKeymap } from '@codemirror/commands'
import type {
  KeyBinding,
} from '@codemirror/view'
import {
  EditorView,
  keymap,
  placeholder,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
} from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentUnit,
  foldKeymap,
} from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { defaultLightThemeOption } from './theme/light'

export * from '@codemirror/theme-one-dark'
export * from './theme/light'

export interface BasicSetupOptions {
  lineNumbers?: boolean
  highlightActiveLineGutter?: boolean
  highlightSpecialChars?: boolean
  history?: boolean
  foldGutter?: boolean
  drawSelection?: boolean
  dropCursor?: boolean
  allowMultipleSelections?: boolean
  indentOnInput?: boolean
  syntaxHighlighting?: boolean
  bracketMatching?: boolean
  closeBrackets?: boolean
  autocompletion?: boolean
  rectangularSelection?: boolean
  crosshairCursor?: boolean
  highlightActiveLine?: boolean
  highlightSelectionMatches?: boolean

  defaultKeymap?: boolean
  closeBracketsKeymap?: boolean
  searchKeymap?: boolean
  historyKeymap?: boolean
  foldKeymap?: boolean
  completionKeymap?: boolean
  lintKeymap?: boolean
  tabSize?: number
}

export interface DefaultExtensionsOptions {
  indentWithTab?: boolean
  basicSetup?: boolean | BasicSetupOptions
  placeholder?: string | HTMLElement
  theme?: 'light' | 'dark' | 'none' | Extension
  readOnly?: boolean
  editable?: boolean
}

export const minimalSetup: Extension = (() => [
  highlightSpecialChars(),
  history(),
  drawSelection(),
  syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap,
  ])
])()

/**
 * Basic setup that includes standard CodeMirror extensions
 */
export const basicSetup = (options: BasicSetupOptions = {}): Extension[] => {
  let keymaps: KeyBinding[] = []
  if (options.closeBracketsKeymap !== false) {
    keymaps = keymaps.concat(closeBracketsKeymap)
  }
  if (options.defaultKeymap !== false) {
    keymaps = keymaps.concat(defaultKeymap)
  }
  if (options.searchKeymap !== false) {
    keymaps = keymaps.concat(searchKeymap)
  }
  if (options.historyKeymap !== false) {
    keymaps = keymaps.concat(historyKeymap)
  }
  if (options.foldKeymap !== false) {
    keymaps = keymaps.concat(foldKeymap)
  }
  if (options.completionKeymap !== false) {
    keymaps = keymaps.concat(completionKeymap)
  }
  if (options.lintKeymap !== false) {
    keymaps = keymaps.concat(lintKeymap)
  }

  const extensions: Extension[] = []
  if (options.lineNumbers !== false) extensions.push(lineNumbers())
  if (options.highlightActiveLineGutter !== false) extensions.push(highlightActiveLineGutter())
  if (options.highlightSpecialChars !== false) extensions.push(highlightSpecialChars())
  if (options.history !== false) extensions.push(history())
  if (options.foldGutter !== false) extensions.push(foldGutter())
  if (options.drawSelection !== false) extensions.push(drawSelection())
  if (options.dropCursor !== false) extensions.push(dropCursor())
  if (options.allowMultipleSelections !== false) extensions.push(EditorState.allowMultipleSelections.of(true))
  if (options.indentOnInput !== false) extensions.push(indentOnInput())
  if (options.syntaxHighlighting !== false)
    extensions.push(syntaxHighlighting(defaultHighlightStyle, { fallback: true }))
  if (options.bracketMatching !== false) extensions.push(bracketMatching())
  if (options.closeBrackets !== false) extensions.push(closeBrackets())
  if (options.autocompletion !== false) extensions.push(autocompletion())
  if (options.rectangularSelection !== false) extensions.push(rectangularSelection())
  if (options.crosshairCursor !== false) extensions.push(crosshairCursor())
  if (options.highlightActiveLine !== false) extensions.push(highlightActiveLine())
  if (options.highlightSelectionMatches !== false) extensions.push(highlightSelectionMatches())
  if (options.tabSize && typeof options.tabSize === 'number')
    extensions.push(indentUnit.of(' '.repeat(options.tabSize)))

  return extensions.concat([keymap.of(keymaps.flat())]).filter(Boolean)
}

export const getDefaultExtensions = (optios: DefaultExtensionsOptions = {}): Extension[] => {
  const {
    indentWithTab: defaultIndentWithTab = true,
    editable = true,
    readOnly = false,
    theme = 'light',
    placeholder: placeholderStr = '',
    basicSetup: defaultBasicSetup = true,
  } = optios
  const getExtensions: Extension[] = []
  if (defaultIndentWithTab) {
    getExtensions.unshift(keymap.of([indentWithTab]))
  }
  if (defaultBasicSetup) {
    if (typeof defaultBasicSetup === 'boolean') {
      getExtensions.unshift(...basicSetup())
    }
    else {
      getExtensions.unshift(...basicSetup(defaultBasicSetup))
    }
  }
  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr))
  }
  switch (theme) {
    case 'light':
      getExtensions.push(defaultLightThemeOption)
      break
    case 'dark':
      getExtensions.push(oneDark)
      break
    case 'none':
      break
    default:
      getExtensions.push(theme)
      break
  }
  if (editable === false) {
    getExtensions.push(EditorView.editable.of(false))
  }
  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true))
  }

  return [...getExtensions]
}
