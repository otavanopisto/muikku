import { Node, mergeAttributes } from "@tiptap/core";
import type { Node as PMNode, NodeRange } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { findWrapping } from "@tiptap/pm/transform";
import { findParentNodeClosestToPos } from "@tiptap/react";

import { stylesSet, type StyleDefinition } from "../style-set/helper";

export const DIV_BOX_MARK = "data-muikku-div-box";

export type DivBoxAttrs = {
  class: string | null;
  id: string | null;
  lang: string | null;
  style: string | null;
  title: string | null;
  dir: "ltr" | "rtl" | null;
  "data-show": string | null;
  "data-name": string | null;
  "data-style": string | null; // preset name
};

export type DivBoxStylePolicy = "any" | "allowedStylesOnly" | "none";
export type DivBoxDataStylePolicy = "any" | "knownPresetsOnly";

export type DivBoxOptions = {
  /**
   * How to treat inline style on the div box.
   * - "any": keep style as-is (current behavior)
   * - "none": drop style completely
   * - "allowedStylesOnly": keep only whitelisted CSS properties
   * @default "any"
   */
  stylePolicy?: DivBoxStylePolicy;

  /**
   * CSS properties allowed when stylePolicy="allowedStylesOnly".
   * Use lowercase names (e.g. "background-color").
   */
  allowedStyles?: string[];

  /**
   * Whether data-style must match known preset names (stylesSet).
   * @default "knownPresetsOnly"
   */
  dataStylePolicy?: DivBoxDataStylePolicy;
};

declare module "@tiptap/core" {
  /**
   * Commands for the divBox extension.
   */
  interface Commands<ReturnType> {
    divBox: {
      setDivBoxPreset: (styleName: string) => ReturnType;
      updateDivBox: (attrs: Partial<DivBoxAttrs>) => ReturnType;
      unsetDivBox: () => ReturnType;
    };
  }
}

/**
 * Empty to null.
 * @param v - The string to convert.
 * @returns The string or null.
 */
function emptyToNull(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}

/**
 * Normalize the direction.
 * @param v - The direction to normalize.
 * @returns The normalized direction.
 */
function normalizeDir(v: unknown): DivBoxAttrs["dir"] {
  return v === "ltr" || v === "rtl" ? v : null;
}

/**
 * Find the style definition by name.
 * @param styleName - The name of the style to find.
 * @returns The style definition or null.
 */
function findStyle(styleName: string): StyleDefinition | null {
  return stylesSet.find((s) => s.name === styleName) ?? null;
}

/**
 * Check if the name is a known preset name.
 * @param name - The name to check.
 * @returns True if the name is a known preset name, false otherwise.
 */
function isKnownPresetName(name: string | null | undefined): boolean {
  if (!name) return false;
  return stylesSet.some((s) => s.name === name);
}

/**
 * Keep only allowed CSS declarations (property allowlist).
 * Very simple parser: splits by ";" and ":".
 */
function filterStyleByAllowlist(
  style: string | null | undefined,
  allowedProps: string[]
): string | null {
  const raw = emptyToNull(style);
  if (!raw) return null;

  const allowed = new Set(
    allowedProps.map((p) => p.trim().toLowerCase()).filter(Boolean)
  );
  if (allowed.size === 0) return null;

  const kept: string[] = [];

  for (const decl of raw.split(";")) {
    const d = decl.trim();
    if (!d) continue;

    const idx = d.indexOf(":");
    if (idx < 0) continue;

    const prop = d.slice(0, idx).trim().toLowerCase();
    const val = d.slice(idx + 1).trim();

    if (!prop || !val) continue;
    if (!allowed.has(prop)) continue;

    // Guard: disallow CSS custom props in allowlist mode unless explicitly included
    // (If you want them, add "--foo" to allowedStyles)
    if (prop.startsWith("--") && !allowed.has(prop)) continue;

    kept.push(`${prop}: ${val}`);
  }

  return kept.length ? kept.join("; ") : null;
}

/**
 * Sanitize the style by policy.
 * @param style - The style to sanitize.
 * @param options - The options for the sanitization.
 * @returns The sanitized style or null.
 */
function sanitizeStyleByPolicy(
  style: string | null | undefined,
  options: DivBoxOptions
): string | null {
  const policy = options.stylePolicy ?? "any";
  if (policy === "none") return null;
  if (policy === "allowedStylesOnly") {
    return filterStyleByAllowlist(style, options.allowedStyles ?? []);
  }
  // policy === "any"
  return emptyToNull(style);
}

/**
 * Sanitize the data style by policy.
 * @param dataStyle - The data style to sanitize.
 * @param options - The options for the sanitization.
 * @returns The sanitized data style or null.
 */
function sanitizeDataStyleByPolicy(
  dataStyle: string | null | undefined,
  options: DivBoxOptions
): string | null {
  const policy = options.dataStylePolicy ?? "knownPresetsOnly";
  const v = emptyToNull(dataStyle);
  if (!v) return null;

  if (policy === "any") return v;
  // knownPresetsOnly
  return isKnownPresetName(v) ? v : null;
}

/**
 * Find the active div box.
 * @param state - The state to find the active div box in.
 * @returns The active div box or null.
 */
function findActiveDivBox(state: EditorState) {
  return findParentNodeClosestToPos(
    state.selection.$from,
    (node) => node.type.name === "divBox"
  );
}

/**
 * Resolve the wrap target.
 * @param state - The state to resolve the wrap target in.
 * @returns The wrap target or null.
 */
function resolveWrapTarget(
  state: EditorState
):
  | { kind: "single"; pos: number; node: PMNode }
  | { kind: "range"; range: NodeRange }
  | null {
  const { $from, $to } = state.selection;

  for (let d = $from.depth; d > 0; d--) {
    const n = $from.node(d);
    if (n.type.name === "table") {
      return { kind: "single", pos: $from.before(d), node: n };
    }
  }

  for (let d = $from.depth; d > 0; d--) {
    const n = $from.node(d);
    if (
      n.type.name === "bulletList" ||
      n.type.name === "orderedList" ||
      n.type.name === "taskList"
    ) {
      return { kind: "single", pos: $from.before(d), node: n };
    }
  }

  const range = $from.blockRange($to);
  if (!range) return null;
  return { kind: "range", range };
}

/**
 * Apply the wrap.
 * @param props - The props for the apply wrap.
 * @returns True if the wrap was applied, false otherwise.
 */
function applyWrap(props: {
  state: EditorState;
  tr: Transaction;
  dispatch?: (tr: Transaction) => void;
  type: PMNode["type"];
  attrs: Record<string, unknown>;
}) {
  const { state, dispatch, type, attrs } = props;
  let { tr } = props;

  const target = resolveWrapTarget(state);
  if (!target) return false;

  if (target.kind === "single") {
    const { pos, node } = target;
    const wrapper = type.create(attrs, node);
    tr = tr.replaceWith(pos, pos + node.nodeSize, wrapper);
    if (dispatch) dispatch(tr.scrollIntoView());
    return true;
  }

  const wrapping = findWrapping(target.range, type, attrs);
  if (!wrapping) return false;

  tr = tr.wrap(target.range, wrapping);
  if (dispatch) dispatch(tr.scrollIntoView());
  return true;
}

export const DivBoxExtension = Node.create<DivBoxOptions>({
  name: "divBox",

  group: "block",
  content: "block+",
  defining: true,

  addOptions() {
    return {
      stylePolicy: "any",
      allowedStyles: [],
      dataStylePolicy: "knownPresetsOnly",
    };
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (el: HTMLElement) => emptyToNull(el.getAttribute("class")),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.class ? { class: attrs.class as string } : {},
      },
      id: {
        default: null,
        parseHTML: (el: HTMLElement) => emptyToNull(el.getAttribute("id")),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.id ? { id: attrs.id as string } : {},
      },
      lang: {
        default: null,
        parseHTML: (el: HTMLElement) => emptyToNull(el.getAttribute("lang")),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.lang ? { lang: attrs.lang as string } : {},
      },
      style: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          sanitizeStyleByPolicy(el.getAttribute("style"), this.options),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.style ? { style: attrs.style as string } : {},
      },
      title: {
        default: null,
        parseHTML: (el: HTMLElement) => emptyToNull(el.getAttribute("title")),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.title ? { title: attrs.title as string } : {},
      },
      dir: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("dir"),
        renderHTML: (attrs: Record<string, unknown>) => {
          const d = attrs.dir;
          return d === "ltr" || d === "rtl" ? { dir: d } : {};
        },
      },
      "data-show": {
        default: null,
        parseHTML: (el: HTMLElement) =>
          emptyToNull(el.getAttribute("data-show")),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-show"]
            ? { "data-show": attrs["data-show"] as string }
            : {},
      },
      "data-name": {
        default: null,
        parseHTML: (el: HTMLElement) =>
          emptyToNull(el.getAttribute("data-name")),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-name"]
            ? { "data-name": attrs["data-name"] as string }
            : {},
      },
      "data-style": {
        default: null,
        parseHTML: (el: HTMLElement) =>
          sanitizeDataStyleByPolicy(
            el.getAttribute("data-style"),
            this.options
          ),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-style"]
            ? { "data-style": attrs["data-style"] as string }
            : {},
      },
    };
  },

  parseHTML() {
    return [
      { tag: "div" },
      { tag: `div[${DIV_BOX_MARK}="true"]` },
      { tag: "div.material-styles-block" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { [DIV_BOX_MARK]: "true" }),
      0,
    ];
  },

  addCommands() {
    return {
      setDivBoxPreset:
        (styleName: string) =>
        ({ editor, state, tr, dispatch }) => {
          if (!editor.isEditable) return false;

          const style = findStyle(styleName);
          if (!style) return false;

          const type = state.schema.nodes[this.name];
          if (!type) return false;

          const active = findActiveDivBox(state);

          if (active) {
            const currentPreset = active.node.attrs["data-style"] as
              | string
              | undefined
              | null;

            if (currentPreset && currentPreset === styleName) {
              tr = tr.replaceWith(
                active.pos,
                active.pos + active.node.nodeSize,
                active.node.content
              );
              if (dispatch) dispatch(tr.scrollIntoView());
              return true;
            }

            tr = tr.setNodeMarkup(active.pos, undefined, {
              ...active.node.attrs,
              ...style.attributes,
              "data-style": styleName,
            });

            if (dispatch) dispatch(tr.scrollIntoView());
            return true;
          }

          return applyWrap({
            state,
            tr,
            dispatch,
            type,
            attrs: {
              ...style.attributes,
              "data-style": styleName,
            },
          });
        },

      updateDivBox:
        (attrs: Partial<DivBoxAttrs>) =>
        ({ editor, state, tr, dispatch }) => {
          if (!editor.isEditable) return false;

          const type = state.schema.nodes[this.name];
          if (!type) return false;

          const active = findActiveDivBox(state);

          const nextStyle =
            attrs.style !== undefined
              ? sanitizeStyleByPolicy(attrs.style, this.options)
              : undefined;

          const nextDataStyle =
            attrs["data-style"] !== undefined
              ? sanitizeDataStyleByPolicy(attrs["data-style"], this.options)
              : undefined;

          if (active) {
            tr = tr.setNodeMarkup(active.pos, undefined, {
              ...active.node.attrs,
              ...attrs,
              ...(nextStyle !== undefined ? { style: nextStyle } : {}),
              ...(nextDataStyle !== undefined
                ? { "data-style": nextDataStyle }
                : {}),
              id: emptyToNull(attrs.id ?? (active.node.attrs.id as string)),
              lang: emptyToNull(
                attrs.lang ?? (active.node.attrs.lang as string)
              ),
              title: emptyToNull(
                attrs.title ?? (active.node.attrs.title as string)
              ),
              dir: normalizeDir(attrs.dir ?? active.node.attrs.dir),
            });
            if (dispatch) dispatch(tr.scrollIntoView());
            return true;
          }

          const wrapAttrs: Record<string, unknown> = { ...attrs };
          if (nextStyle !== undefined) wrapAttrs.style = nextStyle;
          if (nextDataStyle !== undefined)
            wrapAttrs["data-style"] = nextDataStyle;

          return applyWrap({
            state,
            tr,
            dispatch,
            type,
            attrs: wrapAttrs,
          });
        },

      unsetDivBox:
        () =>
        ({ editor, state, tr, dispatch }) => {
          if (!editor.isEditable) return false;
          const active = findActiveDivBox(state);
          if (!active) return false;

          tr = tr.replaceWith(
            active.pos,
            active.pos + active.node.nodeSize,
            active.node.content
          );
          if (dispatch) dispatch(tr.scrollIntoView());
          return true;
        },
    };
  },
});
