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
  heading: false,
  list: false,
  blockquote: false,
  link: false,
  highlight: false,
  textColor: false,
  align: false,
  indent: false,
  table: false,
  image: false,
  math: false,
  specialChar: false,
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
