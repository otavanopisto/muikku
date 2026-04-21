import { Node, mergeAttributes } from "@tiptap/core";
//import type { Editor } from "@tiptap/react";
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
 * Find the active div box.
 * @param state - The editor state.
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
 * @param state - The editor state.
 * @returns The wrap target or null.
 */
function resolveWrapTarget(
  state: EditorState
):
  | { kind: "single"; pos: number; node: PMNode }
  | { kind: "range"; range: NodeRange }
  | null {
  const { $from, $to } = state.selection;

  // Wrap whole table
  for (let d = $from.depth; d > 0; d--) {
    const n = $from.node(d);
    if (n.type.name === "table") {
      return { kind: "single", pos: $from.before(d), node: n };
    }
  }

  // Wrap whole list
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
 * @param props - The props for the applyWrap function.
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

export const DivBoxExtension = Node.create({
  name: "divBox",

  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("class"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.class ? { class: attrs.class as string } : {},
      },
      id: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("id"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.id ? { id: attrs.id as string } : {},
      },
      lang: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("lang"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.lang ? { lang: attrs.lang as string } : {},
      },
      style: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("style"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.style ? { style: attrs.style as string } : {},
      },
      title: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("title"),
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
        parseHTML: (el: HTMLElement) => el.getAttribute("data-show"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-show"]
            ? { "data-show": attrs["data-show"] as string }
            : {},
      },
      "data-name": {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-name"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-name"]
            ? { "data-name": attrs["data-name"] as string }
            : {},
      },
      "data-style": {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-style"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-style"]
            ? { "data-style": attrs["data-style"] as string }
            : {},
      },
    };
  },

  parseHTML() {
    return [
      // New unified box
      { tag: `div[${DIV_BOX_MARK}="true"]` },

      // Legacy styleSet boxes
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

          // If already inside a box -> update attrs (toggle off if same preset)
          if (active) {
            const currentPreset = active.node.attrs["data-style"] as
              | string
              | undefined
              | null;

            if (currentPreset && currentPreset === styleName) {
              // same preset again = unwrap (toggle off)
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

          // Not inside a box -> wrap selection with one wrapper
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

          // If inside a box -> update it
          if (active) {
            tr = tr.setNodeMarkup(active.pos, undefined, {
              ...active.node.attrs,
              ...attrs,
              id: emptyToNull(attrs.id ?? (active.node.attrs.id as string)),
              lang: emptyToNull(
                attrs.lang ?? (active.node.attrs.lang as string)
              ),
              title: emptyToNull(
                attrs.title ?? (active.node.attrs.title as string)
              ),
              style: emptyToNull(
                attrs.style ?? (active.node.attrs.style as string)
              ),
              dir: normalizeDir(attrs.dir ?? active.node.attrs.dir),
            });
            if (dispatch) dispatch(tr.scrollIntoView());
            return true;
          }

          // Not inside a box -> allow wrapping with attrs (optional; handy for modal-first use)
          return applyWrap({
            state,
            tr,
            dispatch,
            type,
            attrs,
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

export default DivBoxExtension;
