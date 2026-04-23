import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";
import { MuikkuJournalFieldPlaceholder } from "./MuikkuJournalFieldPlaceholder";

export type MuikkuJournalFieldContent = {
  name: string;
};

export type MuikkuJournalFieldAttrs = {
  content: MuikkuJournalFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.journal";

/**
 * Checks if a value is a record.
 * @param value - The value to check.
 * @returns True if the value is a record, false otherwise.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes the content.
 * @param input - The value to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuJournalFieldContent | null {
  if (!isRecord(input)) return null;

  const name =
    typeof input.name === "string" && input.name.trim().length
      ? input.name.trim()
      : createRandomMuikkuFieldName();

  return { name };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku journal field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuJournalField: {
      setMuikkuJournalField: () => ReturnType;
      unsetMuikkuJournalField: () => ReturnType;
    };
  }
}

export const MuikkuJournalFieldExtension = Node.create({
  name: "muikkuJournalField",

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
    } satisfies Record<keyof MuikkuJournalFieldAttrs, unknown>;
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
      } satisfies MuikkuJournalFieldContent);

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuJournalFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuJournalField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          return commands.insertContent({
            type: this.name,
            attrs: {
              content: { name: createRandomMuikkuFieldName() },
            },
          });
        },

      unsetMuikkuJournalField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },
    };
  },
});

export default MuikkuJournalFieldExtension;
