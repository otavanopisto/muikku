import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MuikkuTextFieldPlaceholder } from "./MuikkuTextFieldPlaceholder";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";

export type MuikkuTextFieldRightAnswer = {
  text: string;
  correct: boolean;
  caseSensitive?: boolean;
  normalizeWhitespace?: boolean;
};

export type MuikkuTextFieldContent = {
  name: string;
  rightAnswers?: MuikkuTextFieldRightAnswer[];
  columns?: string; // CKEditor stored this as whatever the dialog returns (string)
  autogrow?: boolean;
  hint?: string;
};

export type MuikkuTextFieldAttrs = {
  content: MuikkuTextFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.text";

const OPEN_EVENT = "muikku:open-muikku-textfield-modal";

/**
 * Normalizes the content of a Muikku text field.
 * @param input - The input to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuTextFieldContent | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Partial<MuikkuTextFieldContent>;

  const name =
    typeof obj.name === "string" && obj.name.trim().length
      ? obj.name.trim()
      : createRandomMuikkuFieldName();

  const rightAnswers = Array.isArray(obj.rightAnswers)
    ? obj.rightAnswers
        .map((a) => ({
          text: typeof a?.text === "string" ? a.text : "",
          correct: !!a?.correct,
          caseSensitive:
            typeof a?.caseSensitive === "boolean" ? a.caseSensitive : false,
          normalizeWhitespace:
            typeof a?.normalizeWhitespace === "boolean"
              ? a.normalizeWhitespace
              : true,
        }))
        .filter((a) => a.text.trim().length > 0 || a.correct)
    : [];

  return {
    name,
    columns:
      typeof obj.columns === "string"
        ? obj.columns
        : (obj.columns as unknown as string),
    autogrow: typeof obj.autogrow === "boolean" ? obj.autogrow : true,
    hint: typeof obj.hint === "string" ? obj.hint : "",
    rightAnswers,
  };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku text field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuTextField: {
      setMuikkuTextField: (
        content?: Partial<MuikkuTextFieldContent>
      ) => ReturnType;
      updateMuikkuTextField: (
        content: Partial<MuikkuTextFieldContent>
      ) => ReturnType;
      unsetMuikkuTextField: () => ReturnType;
      openMuikkuTextFieldModal: () => ReturnType;
    };
  }
}

/**
 * MuikkuTextFieldExtension is the extension for the Muikku text field.
 * @returns The Muikku text field extension.
 */
export const MuikkuTextFieldExtension = Node.create({
  name: "muikkuTextField",

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
        renderHTML: () => ({}), // handled in renderHTML() below
      },
    } satisfies Record<keyof MuikkuTextFieldAttrs, unknown>;
  },

  parseHTML() {
    return [
      { tag: `object[type="${FIELD_OBJECT_TYPE}"]` },
      // In case legacy HTML contains namespaced tags
      { tag: `cke\\:object[type="${FIELD_OBJECT_TYPE}"]` },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const content = normalizeContent(node.attrs.content) ?? {
      name: createRandomMuikkuFieldName(),
      columns: "",
      autogrow: true,
      hint: "",
      rightAnswers: [],
    };

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuTextFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuTextField:
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

      updateMuikkuTextField:
        (partial) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          const prev = editor.getAttributes(this.name)
            .content as MuikkuTextFieldContent | null;
          const next = normalizeContent({
            ...(prev ?? {}),
            ...(partial ?? {}),
          });

          if (!next) return false;

          return commands.updateAttributes(this.name, { content: next });
        },

      unsetMuikkuTextField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },

      openMuikkuTextFieldModal:
        () =>
        ({ editor }) => {
          if (!editor.isEditable) return false;
          window.dispatchEvent(new CustomEvent(OPEN_EVENT));
          return true;
        },
    };
  },
});

export default MuikkuTextFieldExtension;
