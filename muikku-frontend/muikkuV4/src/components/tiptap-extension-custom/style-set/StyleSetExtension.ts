/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Node, mergeAttributes } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { findParentNodeClosestToPos } from "@tiptap/react";
import { stylesSet, type StyleDefinition } from "./helper";

/**
 * StyleSetOptions is the options for the StyleSetExtension
 */
export interface StyleSetOptions {
  styles: StyleDefinition[];
}

declare module "@tiptap/core" {
  /**
   * Commands is the commands for the StyleSetExtension
   */
  interface Commands<ReturnType> {
    styleSet: {
      setStyle: (styleName: string) => ReturnType;
      unsetStyle: () => ReturnType;
    };
  }
}

/**
 * CKEditor4-like style box wrapper:
 * - wraps a SINGLE block in a <div class="... material-styles-block">...</div>
 * - multi-block selection: apply wrapper PER block (not one wrapper for the whole selection)
 * - if selection hits an existing wrapper:
 *    - choosing a different style updates wrapper attrs
 *    - choosing same style toggles (unwraps)
 * - no nesting
 */
export const StyleSetExtension = Node.create<StyleSetOptions>({
  name: "styleSet",

  group: "block",

  // Exactly ONE block inside (enforces “one wrapper per block”)
  content: "block",

  defining: true,

  addOptions() {
    return { styles: stylesSet };
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (el) => el.getAttribute("class"),
        renderHTML: (attrs) => (attrs.class ? { class: attrs.class } : {}),
      },
      "data-show": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-show"),
        renderHTML: (attrs) =>
          attrs["data-show"] ? { "data-show": attrs["data-show"] } : {},
      },
      "data-name": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-name"),
        renderHTML: (attrs) =>
          attrs["data-name"] ? { "data-name": attrs["data-name"] } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.material-styles-block" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    const findStyle = (styleName: string) =>
      this.options.styles.find((s) => s.name === styleName);

    const findActiveWrapper = (editor: Editor) =>
      findParentNodeClosestToPos(
        editor.state.selection.$from,
        (node) => node.type.name === this.name
      );

    return {
      setStyle:
        (styleName) =>
        ({ editor, state, tr, dispatch }) => {
          if (!editor.isEditable) return false;

          const style = findStyle(styleName);
          if (!style) return false;

          const styleSetType = state.schema.nodes[this.name];
          if (!styleSetType) return false;

          const { from, to } = state.selection;

          const targets: (
            | { kind: "wrapper"; pos: number }
            | { kind: "block"; pos: number }
          )[] = [];

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!node.isBlock) return;

            if (node.type === styleSetType) {
              targets.push({ kind: "wrapper", pos });
              return false; // don't descend into wrapper content
            }

            targets.push({ kind: "block", pos });
            return false; // don't descend into this block
          });

          if (targets.length === 0) return false;

          // Apply bottom-to-top so positions don't shift
          for (let i = targets.length - 1; i >= 0; i--) {
            const t = targets[i];

            if (t.kind === "wrapper") {
              const wrapperNode = tr.doc.nodeAt(t.pos);
              if (!wrapperNode) continue;
              if (wrapperNode.type !== styleSetType) continue;

              const currentClass = wrapperNode.attrs.class as
                | string
                | undefined;
              const nextClass = style.attributes.class as string | undefined;

              // Same style again => unwrap (toggle off)
              if (nextClass && currentClass === nextClass) {
                const inner = wrapperNode.firstChild;
                if (inner) {
                  tr = tr.replaceWith(
                    t.pos,
                    t.pos + wrapperNode.nodeSize,
                    inner
                  );
                }
              } else {
                tr = tr.setNodeMarkup(t.pos, undefined, {
                  ...wrapperNode.attrs,
                  ...style.attributes,
                });
              }

              continue;
            }

            // kind === "block": wrap this block unless it’s already inside a wrapper
            const blockNode = tr.doc.nodeAt(t.pos);
            if (!blockNode) continue;
            if (!blockNode.isBlock) continue;
            if (blockNode.type === styleSetType) continue;

            const $pos = tr.doc.resolve(t.pos);
            let insideWrapper = false;
            for (let depth = $pos.depth; depth > 0; depth--) {
              if ($pos.node(depth).type === styleSetType) {
                insideWrapper = true;
                break;
              }
            }
            if (insideWrapper) continue;

            const wrapper = styleSetType.create(
              { ...style.attributes },
              blockNode
            );
            tr = tr.replaceWith(t.pos, t.pos + blockNode.nodeSize, wrapper);
          }

          if (dispatch) dispatch(tr);
          return true;
        },

      unsetStyle:
        () =>
        ({ editor, state, tr, dispatch }) => {
          if (!editor.isEditable) return false;

          const styleSetType = state.schema.nodes[this.name];
          if (!styleSetType) return false;

          const active = findActiveWrapper(editor);
          if (!active) return false;

          const { pos, node } = active;
          const inner = node.firstChild;
          if (!inner) return false;

          tr = tr.replaceWith(pos, pos + node.nodeSize, inner);

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});

export default StyleSetExtension;
