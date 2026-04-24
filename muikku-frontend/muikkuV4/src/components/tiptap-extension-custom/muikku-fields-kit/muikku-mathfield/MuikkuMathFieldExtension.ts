import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";
import { MuikkuMathFieldPlaceholder } from "./MuikkuMathFieldPlaceholder";

export type MuikkuMathFieldContent = {
  name: string;
};

export type MuikkuMathFieldAttrs = {
  content: MuikkuMathFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.mathexercise";

/**
 * Checks if the value is a record.
 * @param value - The value to check.
 * @returns True if the value is a record, false otherwise.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes the content of the math exercise field.
 * @param input - The input to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuMathFieldContent | null {
  if (!isRecord(input)) return null;

  const name =
    typeof input.name === "string" && input.name.trim().length
      ? input.name.trim()
      : createRandomMuikkuFieldName();

  return { name };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku math field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuMathField: {
      setMuikkuMathField: () => ReturnType;
      unsetMuikkuMathField: () => ReturnType;
    };
  }
}

export const MuikkuMathFieldExtension = Node.create({
  name: "muikkuMathField",

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
    } satisfies Record<keyof MuikkuMathFieldAttrs, unknown>;
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
      } satisfies MuikkuMathFieldContent);

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuMathFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuMathField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          return commands.insertContent({
            type: this.name,
            attrs: { content: { name: createRandomMuikkuFieldName() } },
          });
        },

      unsetMuikkuMathField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },
    };
  },
});

export default MuikkuMathFieldExtension;
