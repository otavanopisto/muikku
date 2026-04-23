import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
} from "../helpers";
import { MuikkuAudioFieldPlaceholder } from "./MuikkuAudioFieldPlaceholder";

export type MuikkuAudioFieldContent = {
  name: string;
};

export type MuikkuAudioFieldAttrs = {
  content: MuikkuAudioFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.audio";

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
function normalizeContent(input: unknown): MuikkuAudioFieldContent | null {
  if (!isRecord(input)) return null;

  const name =
    typeof input.name === "string" && input.name.trim().length
      ? input.name.trim()
      : createRandomMuikkuFieldName();

  return { name };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku audio field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuAudioField: {
      setMuikkuAudioField: () => ReturnType;
      unsetMuikkuAudioField: () => ReturnType;
    };
  }
}

export const MuikkuAudioFieldExtension = Node.create({
  name: "muikkuAudioField",

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
    } satisfies Record<keyof MuikkuAudioFieldAttrs, unknown>;
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
      } satisfies MuikkuAudioFieldContent);

    // We intentionally match CKEditor output:
    // <object type="...">
    //   <param name="type" value="application/json">
    //   <param name="content" value="...json...">
    //   <input name="..." type="file" accept="audio/*" capture="microphone">
    // </object>
    return [
      "object",
      mergeAttributes(HTMLAttributes, { type: FIELD_OBJECT_TYPE }),
      ["param", { name: "type", value: "application/json" }],
      ["param", { name: "content", value: JSON.stringify(content) }],
      [
        "input",
        {
          name: content.name,
          type: "file",
          accept: "audio/*",
          capture: "microphone",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuAudioFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuAudioField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          return commands.insertContent({
            type: this.name,
            attrs: { content: { name: createRandomMuikkuFieldName() } },
          });
        },

      unsetMuikkuAudioField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },
    };
  },
});

export default MuikkuAudioFieldExtension;
