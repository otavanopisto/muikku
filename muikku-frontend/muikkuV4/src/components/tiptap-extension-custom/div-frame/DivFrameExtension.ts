import { Node, mergeAttributes } from "@tiptap/core";
import type { EditorState } from "@tiptap/pm/state";
import type { Node as PMNode, NodeRange } from "@tiptap/pm/model";
import { findWrapping } from "@tiptap/pm/transform";
import { findParentNodeClosestToPos } from "@tiptap/core";

export const DIV_FRAME_MARK = "data-muikku-div-frame";

export type DivFrameAttrs = {
  class: string | null;
  id: string | null;
  lang: string | null;
  style: string | null;
  title: string | null;
  dir: "ltr" | "rtl" | null;
  "data-show": string | null;
  "data-name": string | null;
};

declare module "@tiptap/core" {
  /**
   * Commands for the divFrame extension.
   */
  interface Commands<ReturnType> {
    divFrame: {
      setDivFrame: (attrs: DivFrameAttrs) => ReturnType;
      unsetDivFrame: () => ReturnType;
    };
  }
}

/**
 * Empty to null.
 * @param s - The string to convert.
 * @returns The string or null.
 */
function emptyToNull(s: string | undefined | null): string | null {
  const t = (s ?? "").trim();
  return t.length ? t : null;
}

/**
 * Normalize the direction.
 * @param v - The direction to normalize.
 * @returns The normalized direction.
 */
function normalizeDir(v: string | null | undefined): DivFrameAttrs["dir"] {
  if (v === "ltr" || v === "rtl") return v;
  return null;
}

/**
 * Merge preset StyleDefinition.attributes with manual class and other attrs.
 */
export function buildDivFrameAttrs(input: {
  presetAttributes?: Record<string, unknown> | null;
  extraClass?: string | null;
  id?: string | null;
  lang?: string | null;
  style?: string | null;
  title?: string | null;
  dir?: string | null;
}): DivFrameAttrs {
  const preset = input.presetAttributes ?? {};
  const presetClass = typeof preset.class === "string" ? preset.class : null;
  const mergedClass = [presetClass, emptyToNull(input.extraClass ?? null)]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    class: mergedClass.length ? mergedClass : null,
    id: emptyToNull(input.id ?? null),
    lang: emptyToNull(input.lang ?? null),
    style: emptyToNull(input.style ?? null),
    title: emptyToNull(input.title ?? null),
    dir: normalizeDir(input.dir ?? null),
    "data-show":
      typeof preset["data-show"] === "string" ? preset["data-show"] : null,
    "data-name":
      typeof preset["data-name"] === "string" ? preset["data-name"] : null,
  };
}

/**
 * Find the enclosing divFrame node.
 * @param state - The editor state.
 * @returns The enclosing divFrame node.
 */
function findEnclosingDivFrame(state: EditorState) {
  return findParentNodeClosestToPos(
    state.selection.$from,
    (n) => n.type.name === "divFrame"
  );
}

/**
 * Table / list: wrap whole node. Otherwise: ProseMirror blockRange + wrap.
 */
function resolveWrapTarget(state: EditorState):
  | { kind: "single"; pos: number; node: PMNode }
  | {
      kind: "range";
      range: NodeRange;
    }
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

export const DivFrameExtension = Node.create({
  name: "divFrame",
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
          const d = attrs.dir as string | null;
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
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[${DIV_FRAME_MARK}="true"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { [DIV_FRAME_MARK]: "true" }),
      0,
    ];
  },

  addCommands() {
    return {
      setDivFrame:
        (attrs: Partial<DivFrameAttrs>) =>
        ({ state, tr, dispatch }) => {
          const type = state.schema.nodes[this.name];
          if (!type) return false;
          const existing = findEnclosingDivFrame(state);
          if (existing) {
            tr = tr.setNodeMarkup(existing.pos, undefined, {
              ...existing.node.attrs,
              ...attrs,
            });
            if (dispatch) dispatch(tr.scrollIntoView());
            return true;
          }
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
        },

      unsetDivFrame:
        () =>
        ({ state, tr, dispatch }) => {
          const found = findEnclosingDivFrame(state);
          if (!found) return false;
          const { pos, node } = found;
          const inner = node.content;
          tr = tr.replaceWith(pos, pos + node.nodeSize, inner);
          if (dispatch) dispatch(tr.scrollIntoView());
          return true;
        },
    };
  },
});

export default DivFrameExtension;
