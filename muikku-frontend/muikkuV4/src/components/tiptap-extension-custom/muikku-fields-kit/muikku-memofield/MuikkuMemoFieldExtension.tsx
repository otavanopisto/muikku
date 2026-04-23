import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";
import { MuikkuMemoFieldPlaceholder } from "./MuikkuMemoFieldPlaceholder";

export type MuikkuMemoFieldContent = {
  name: string;
  rows?: string;
  example?: string;
  richedit?: boolean;
  maxChars?: string;
  maxWords?: string;
};

export type MuikkuMemoFieldAttrs = {
  content: MuikkuMemoFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.memo";
const OPEN_EVENT = "muikku:open-muikku-memofield-modal";

/**
 * Normalizes the content of a Muikku memo field.
 * @param input - The input to normalize.
 * @returns The normalized content of a Muikku memo field.
 */
function normalizeContent(input: unknown): MuikkuMemoFieldContent | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Partial<MuikkuMemoFieldContent>;

  const name =
    typeof obj.name === "string" && obj.name.trim().length
      ? obj.name.trim()
      : createRandomMuikkuFieldName();

  // CKEditor dialog stores values as strings for text fields
  const rows =
    typeof obj.rows === "string"
      ? obj.rows
      : (obj.rows as unknown as string)?.toString?.() ?? "";
  const maxChars =
    typeof obj.maxChars === "string"
      ? obj.maxChars
      : (obj.maxChars as unknown as string)?.toString?.() ?? "";
  const maxWords =
    typeof obj.maxWords === "string"
      ? obj.maxWords
      : (obj.maxWords as unknown as string)?.toString?.() ?? "";

  return {
    name,
    rows,
    maxChars,
    maxWords,
    example: typeof obj.example === "string" ? obj.example : "",
    richedit: typeof obj.richedit === "boolean" ? obj.richedit : false,
  };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku memo field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuMemoField: {
      setMuikkuMemoField: (
        content?: Partial<MuikkuMemoFieldContent>
      ) => ReturnType;
      updateMuikkuMemoField: (
        content: Partial<MuikkuMemoFieldContent>
      ) => ReturnType;
      unsetMuikkuMemoField: () => ReturnType;
      openMuikkuMemoFieldModal: () => ReturnType;
    };
  }
}

export const MuikkuMemoFieldExtension = Node.create({
  name: "muikkuMemoField",

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
        renderHTML: () => ({}), // handled in renderHTML()
      },
    } satisfies Record<keyof MuikkuMemoFieldAttrs, unknown>;
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
        rows: "",
        maxChars: "",
        maxWords: "",
        example: "",
        richedit: false,
      } satisfies MuikkuMemoFieldContent);

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuMemoFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuMemoField:
        (partial) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          const content = normalizeContent({
            ...(partial ?? {}),
            name: partial?.name ?? createRandomMuikkuFieldName(),
          });

          if (!content) return false;

          return commands.insertContent({
            type: this.name,
            attrs: { content },
          });
        },

      updateMuikkuMemoField:
        (partial) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          const prev = editor.getAttributes(this.name)
            .content as MuikkuMemoFieldContent | null;
          const next = normalizeContent({
            ...(prev ?? {}),
            ...(partial ?? {}),
          });

          if (!next) return false;

          return commands.updateAttributes(this.name, { content: next });
        },

      unsetMuikkuMemoField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },

      openMuikkuMemoFieldModal:
        () =>
        ({ editor }) => {
          if (!editor.isEditable) return false;
          window.dispatchEvent(new CustomEvent(OPEN_EVENT));
          return true;
        },
    };
  },
});

export default MuikkuMemoFieldExtension;
