import { Extension, Mark, mergeAttributes, Node } from "@tiptap/core";
import type { Node as PMNode, Schema } from "@tiptap/pm/model";
import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const OPEN_MUIKKU_ANCHOR_SETTINGS_MODAL_EVENT =
  "muikku:open-anchor-settings-modal" as const;

const anchorFlagPluginKey = new PluginKey("muikkuAnchorFlagDecorations");

export type MuikkuAnchorAttrs = { id: string; name: string };

declare module "@tiptap/core" {
  // eslint-disable-next-line jsdoc/require-jsdoc
  interface Commands<ReturnType> {
    muikkuAnchor: {
      setMuikkuAnchor: (attrs: MuikkuAnchorAttrs) => ReturnType;
      insertMuikkuAnchorPlaceholder: (attrs: MuikkuAnchorAttrs) => ReturnType;
      unsetMuikkuAnchor: () => ReturnType;
    };
  }
}

/**
 * The Muikku anchor mark.
 * @returns The Muikku anchor mark (<a id name>…</a>).
 */
export const MuikkuAnchorMark = Mark.create({
  name: "anchor",
  inclusive: false,
  excludes: "link",

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (el) => el.getAttribute("id"),
        renderHTML: (a) => (a.id ? { id: a.id as string } : {}),
      },
      name: {
        default: null,
        parseHTML: (el) => el.getAttribute("name"),
        renderHTML: (a) => (a.name ? { name: a.name as string } : {}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[id][name]:not([href])",
        getAttrs: (el) => {
          const e = el;

          // IMPORTANT: if it's empty, let `anchorPlaceholder` node parse it instead
          if ((e.textContent ?? "").trim().length === 0) return false;

          const id = e.getAttribute("id");
          const name = e.getAttribute("name");
          if (!id || !name || id !== name) return false;
          return { id, name };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["a", mergeAttributes(HTMLAttributes), 0];
  },
});

/**
 * The Muikku anchor placeholder node.
 * @returns The Muikku anchor placeholder node (<a id name></a>).
 */
export const MuikkuAnchorPlaceholder = Node.create({
  name: "anchorPlaceholder",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: { default: null },
      name: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[id][name]:not([href])",
        getAttrs: (el) => {
          const e = el;
          if ((e.textContent ?? "").trim().length > 0) return false;
          const id = e.getAttribute("id");
          const name = e.getAttribute("name");
          if (!id || !name || id !== name) return false;
          return { id, name };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["a", mergeAttributes(HTMLAttributes)];
  },
});

/**
 * The Muikku anchor extension.
 * @returns The Muikku anchor extension.
 */
export const MuikkuAnchorExtension = Extension.create({
  name: "muikkuAnchor",
  addExtensions() {
    return [MuikkuAnchorMark, MuikkuAnchorPlaceholder];
  },
  addCommands() {
    return {
      // Sets the anchor.
      setMuikkuAnchor:
        (attrs: MuikkuAnchorAttrs) =>
        ({ chain, state }) => {
          if (state.selection.empty) return false;
          return chain().focus().setMark("anchor", attrs).run();
        },
      // Inserts a Muikku anchor placeholder if the selection is empty.
      insertMuikkuAnchorPlaceholder:
        (attrs: MuikkuAnchorAttrs) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({ type: "anchorPlaceholder", attrs })
            .run(),
      // Unsets the anchor.
      unsetMuikkuAnchor:
        () =>
        ({ chain, state }) => {
          if (
            state.selection instanceof NodeSelection &&
            state.selection.node.type.name === "anchorPlaceholder"
          ) {
            return chain().focus().deleteSelection().run();
          }
          return chain()
            .focus()
            .extendMarkRange("anchor")
            .unsetMark("anchor")
            .run();
        },
    };
  },
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            dblclick: (_view, event) => {
              if (!editor?.isEditable) return false;
              const e = event;
              const coords = editor.view.posAtCoords({
                left: e.clientX,
                top: e.clientY,
              });
              if (!coords) return false;
              const $pos = editor.state.doc.resolve(coords.pos);
              const mark = editor.schema.marks.anchor;
              const ph = editor.schema.nodes.anchorPlaceholder;
              // inside anchor mark?
              if (mark?.isInSet($pos.marks())) {
                e.preventDefault();
                editor
                  .chain()
                  .focus()
                  .setTextSelection(coords.pos)
                  .extendMarkRange("anchor")
                  .run();
                window.dispatchEvent(
                  new Event(OPEN_MUIKKU_ANCHOR_SETTINGS_MODAL_EVENT)
                );
                return true;
              }
              // on placeholder node?
              const node = $pos.nodeAfter ?? $pos.nodeBefore;
              if (ph && node?.type === ph) {
                e.preventDefault();
                const pos =
                  node === $pos.nodeAfter ? $pos.pos : $pos.pos - node.nodeSize;
                editor.chain().focus().setNodeSelection(pos).run();
                window.dispatchEvent(
                  new Event(OPEN_MUIKKU_ANCHOR_SETTINGS_MODAL_EVENT)
                );
                return true;
              }
              return false;
            },
          },
        },
      }),
      new Plugin({
        key: anchorFlagPluginKey,
        state: {
          init: (_, state) => createAnchorDecorations(state.doc, state.schema),
          apply: (tr, old, _oldState, newState) => {
            // Recompute only when document changes
            if (!tr.docChanged) return old.map(tr.mapping, tr.doc);
            return createAnchorDecorations(newState.doc, newState.schema);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

/**
 * Create the anchor decorations.
 * @param doc - The document.
 * @param anchorMarkType - The anchor mark type.
 * @returns The anchor decorations.
 */
function createAnchorDecorations(doc: PMNode, schema: Schema) {
  const decos: Decoration[] = [];
  const anchorMarkType = schema.marks.anchor;
  const placeholderType = schema.nodes.anchorPlaceholder;

  doc.descendants((node, pos) => {
    // 1) Flag anchor mark ranges (text)
    if (node.isText && anchorMarkType) {
      const mark = anchorMarkType.isInSet(node.marks);
      if (mark) {
        const from = pos;
        const to = pos + node.nodeSize;
        decos.push(
          Decoration.inline(from, to, {
            class: "muikku-anchor-deco",
            "data-anchor": String(mark.attrs?.name ?? mark.attrs?.id ?? ""),
          })
        );
      }
      return;
    }
    // 2) Flag empty anchor placeholder nodes
    if (placeholderType && node.type === placeholderType) {
      const from = pos;
      const to = pos + node.nodeSize;
      decos.push(
        Decoration.node(from, to, {
          class: "muikku-anchor-placeholder-deco",
          "data-anchor": String(node.attrs?.name ?? node.attrs?.id ?? ""),
        })
      );
    }
  });

  return DecorationSet.create(doc, decos);
}
