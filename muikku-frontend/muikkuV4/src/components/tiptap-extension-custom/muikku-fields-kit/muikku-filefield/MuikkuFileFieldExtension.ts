import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  isRecord,
} from "../helpers";
import { MuikkuFileFieldPlaceholder } from "./MuikkuFileFieldPlaceholder";

export type MuikkuFileFieldContent = {
  name: string;
};

export type MuikkuFileFieldAttrs = {
  content: MuikkuFileFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.file";

/**
 * Normalizes the content.
 * @param input - The value to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuFileFieldContent | null {
  if (!isRecord(input)) return null;

  const name =
    typeof input.name === "string" && input.name.trim().length
      ? input.name.trim()
      : createRandomMuikkuFieldName();

  return { name };
}

declare module "@tiptap/core" {
  // eslint-disable-next-line jsdoc/require-jsdoc
  interface Commands<ReturnType> {
    muikkuFileField: {
      setMuikkuFileField: () => ReturnType;
      unsetMuikkuFileField: () => ReturnType;
    };
  }
}

export const MuikkuFileFieldExtension = Node.create({
  name: "muikkuFileField",

  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,
  content: "",

  addAttributes() {
    return {
      content: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          normalizeContent(readMuikkuObjectContentParam(el)),
        renderHTML: () => ({}),
      },
    } satisfies Record<keyof MuikkuFileFieldAttrs, unknown>;
  },

  parseHTML() {
    return [
      { tag: `object[type="${FIELD_OBJECT_TYPE}"]` },
      { tag: `cke\\:object[type="${FIELD_OBJECT_TYPE}"]` },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const content =
      normalizeContent(node.attrs.content) ??
      ({
        name: createRandomMuikkuFieldName(),
      } satisfies MuikkuFileFieldContent);

    // Match CKEditor output: object + params + <input type="file" name="...">
    return [
      "object",
      mergeAttributes(HTMLAttributes, { type: FIELD_OBJECT_TYPE }),
      ["param", { name: "type", value: "application/json" }],
      ["param", { name: "content", value: JSON.stringify(content) }],
      ["input", { name: content.name, type: "file" }],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuFileFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuFileField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          return commands.insertContent({
            type: this.name,
            attrs: { content: { name: createRandomMuikkuFieldName() } },
          });
        },

      unsetMuikkuFileField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },
    };
  },
});
