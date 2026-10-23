import type {
  MuikkuEditorFeatures,
  ResolvedMuikkuEditorFeatures,
} from "./types";

/**
 * Baseline: typing + undo/redo. Every other feature is off.
 */
export const MUIKKU_EDITOR_DEFAULTS: ResolvedMuikkuEditorFeatures = {
  history: true,
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  code: false,
  heading: false,
  list: false,
  blockquote: false,
  codeBlock: false,
  link: false,
  highlight: false,
  textColor: false,
  align: false,
  indent: false,
  table: false,
  image: false,
  math: false,
  specialChar: false,
  superscript: false,
  subscript: false,
  horizontalRule: false,
  anchor: false,
  lang: false,
  details: false,
  iframe: false,
  divBox: false,
  sourceMode: false,
  emoji: false,
  muikkuImage: false,
  imageUpload: false,
  muikkuFields: false,
  textDirection: false,
  typography: false,
  selection: false,
  themeToggle: false,
};

/**
 * Student plain memo (richedit off). Same as editor defaults.
 */
export const STUDENT_PLAIN: MuikkuEditorFeatures = {
  history: true,
};

/**
 * Student rich memo / journal. Matches the current memo toolbar.
 * Image is off until a student image control exists; enable with `{ ...STUDENT_RICH, image: true }`.
 */
export const STUDENT_RICH: MuikkuEditorFeatures = {
  history: true,
  bold: true,
  italic: true,
  underline: true,
  strike: true,
  heading: { levels: [1, 2, 3, 4] },
  list: { types: ["bulletList", "orderedList"] },
  blockquote: true,
  link: true,
  highlight: true,
  textColor: true,
  align: { types: ["left", "center", "right"] },
  indent: true,
  table: true,
  math: true,
  specialChar: true,
};

/**
 * Workspace material authoring. Same idea as STUDENT_RICH: a mergeable default.
 */
export const MATERIAL_AUTHOR: MuikkuEditorFeatures = {
  ...STUDENT_RICH,
  list: { types: ["bulletList", "orderedList", "taskList"] },
  align: { types: ["left", "center", "right", "justify"] },
  code: true,
  codeBlock: true,
  superscript: true,
  subscript: true,
  horizontalRule: true,
  anchor: true,
  lang: true,
  details: true,
  iframe: {
    allowedProtocols: ["https:"],
    srcAllowlist: ["*.youtube.com"],
  },
  divBox: true,
  sourceMode: true,
  emoji: true,
  muikkuImage: true,
  imageUpload: true,
  muikkuFields: true,
  textDirection: true,
  typography: true,
  selection: true,
  themeToggle: true,
};

/**
 * Whether a feature is enabled.
 * @param value - Resolved flag (`false` / `true`) or an options object
 */
export function isOn(value: unknown): boolean {
  return value !== false && value !== undefined;
}
/**
 * Options object for an enabled feature. `true` becomes `{}`.
 * @param value - Resolved flag or options object
 */
export function optionsOf(value: unknown): object {
  if (typeof value === "object" && value !== null) {
    return value;
  }
  return {};
}

/**
 * Merge caller features onto editor defaults.
 * @param override - Partial feature map from a wrapper or call site
 */
export function resolveFeatures(
  override?: MuikkuEditorFeatures
): ResolvedMuikkuEditorFeatures {
  return { ...MUIKKU_EDITOR_DEFAULTS, ...override };
}
