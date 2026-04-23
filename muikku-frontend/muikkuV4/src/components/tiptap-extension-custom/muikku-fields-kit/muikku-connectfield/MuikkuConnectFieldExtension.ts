import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MuikkuConnectFieldPlaceholder } from "./MuikkuConnectFieldPlaceholder";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";

export type MuikkuConnectFieldPair = {
  left: string;
  right: string;
};

export type MuikkuConnectFieldItem = {
  name: string; // "1", "2", ... OR "A", "B", ...
  text: string;
};

export type MuikkuConnectFieldConnection = {
  field: string; // "1", "2", ...
  counterpart: string; // "A", "B", ...
};

export type MuikkuConnectFieldContent = {
  name: string;
  fields: MuikkuConnectFieldItem[];
  counterparts: MuikkuConnectFieldItem[];
  connections: MuikkuConnectFieldConnection[];
};

export type MuikkuConnectFieldAttrs = {
  content: MuikkuConnectFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.connect";
const OPEN_EVENT = "muikku:open-muikku-connectfield-modal";

/**
 * Converts a numeric index to an Excel-style letter index.
 * @param numericIndex - The numeric index to convert.
 * @returns The Excel-style letter index.
 */
function excelStyleLetterIndex(numericIndex: number): string {
  // Ported from CKEditor plugin.js
  let result = "";
  const ALPHABET_SIZE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".length;
  let n = numericIndex;

  do {
    const charIndex = n % ALPHABET_SIZE;
    n = (n / ALPHABET_SIZE) | 0;
    n -= 1;
    result = String.fromCharCode(charIndex + "A".charCodeAt(0)) + result;
  } while (n > -1);

  return result;
}

/**
 * Builds the content from a list of pairs.
 * @param props - The props for the content.
 * @returns The content.
 */
function buildContentFromPairs(props: {
  name: string;
  pairs: MuikkuConnectFieldPair[];
}): MuikkuConnectFieldContent {
  const { name, pairs } = props;

  const fields: MuikkuConnectFieldItem[] = pairs.map((p, i) => ({
    name: String(i + 1),
    text: p.left ?? "",
  }));

  const counterparts: MuikkuConnectFieldItem[] = pairs.map((p, i) => ({
    name: excelStyleLetterIndex(i),
    text: p.right ?? "",
  }));

  const connections: MuikkuConnectFieldConnection[] = pairs.map((_, i) => ({
    field: String(i + 1),
    counterpart: excelStyleLetterIndex(i),
  }));

  return { name, fields, counterparts, connections };
}

/**
 * Reconstructs the pairs from the existing content.
 * @param input - The input to reconstruct the pairs from.
 * @returns The reconstructed pairs.
 */
function pairsFromExistingContent(input: unknown): MuikkuConnectFieldPair[] {
  if (!input || typeof input !== "object") return [];

  const obj = input as Partial<MuikkuConnectFieldContent>;

  const fields: MuikkuConnectFieldItem[] = Array.isArray(obj.fields)
    ? obj.fields.filter(
        (x): x is MuikkuConnectFieldItem =>
          !!x &&
          typeof x === "object" &&
          typeof x.name === "string" &&
          typeof x.text === "string"
      )
    : [];

  const counterparts: MuikkuConnectFieldItem[] = Array.isArray(obj.counterparts)
    ? obj.counterparts.filter(
        (x): x is MuikkuConnectFieldItem =>
          !!x &&
          typeof x === "object" &&
          typeof x.name === "string" &&
          typeof x.text === "string"
      )
    : [];

  const connections: MuikkuConnectFieldConnection[] = Array.isArray(
    obj.connections
  )
    ? obj.connections.filter(
        (x): x is MuikkuConnectFieldConnection =>
          !!x &&
          typeof x === "object" &&
          typeof x.field === "string" &&
          typeof x.counterpart === "string"
      )
    : [];

  const byName = (items: readonly MuikkuConnectFieldItem[], name: string) =>
    items.find((it) => it.name === name);

  const byField = (
    items: readonly MuikkuConnectFieldConnection[],
    field: string
  ) => items.find((it) => it.field === field);

  const count = fields.length;
  const pairs: MuikkuConnectFieldPair[] = [];

  for (let i = 0; i < count; i++) {
    const fieldName = String(i + 1);

    const left = byName(fields, fieldName)?.text ?? "";

    const rightName = byField(connections, fieldName)?.counterpart ?? "";

    const right = byName(counterparts, rightName)?.text ?? "";

    pairs.push({ left, right });
  }

  return pairs;
}

/**
 * Normalizes the content of a Muikku connect field.
 * @param input - The input to normalize.
 * @returns The normalized content of a Muikku connect field.
 */
function normalizeContent(input: unknown): MuikkuConnectFieldContent | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Partial<MuikkuConnectFieldContent>;

  const name =
    typeof obj.name === "string" && obj.name.trim().length
      ? obj.name.trim()
      : createRandomMuikkuFieldName();

  const pairs = pairsFromExistingContent(obj);
  return buildContentFromPairs({ name, pairs });
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku connect field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuConnectField: {
      setMuikkuConnectField: (pairs?: MuikkuConnectFieldPair[]) => ReturnType;
      updateMuikkuConnectField: (pairs: MuikkuConnectFieldPair[]) => ReturnType;
      unsetMuikkuConnectField: () => ReturnType;
      openMuikkuConnectFieldModal: () => ReturnType;
    };
  }
}

export const MuikkuConnectFieldExtension = Node.create({
  name: "muikkuConnectField",

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
    } satisfies Record<keyof MuikkuConnectFieldAttrs, unknown>;
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
      buildContentFromPairs({
        name: createRandomMuikkuFieldName(),
        pairs: [],
      });

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuConnectFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuConnectField:
        (pairs) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          const content = buildContentFromPairs({
            name: createRandomMuikkuFieldName(),
            pairs: pairs ?? [],
          });

          return commands.insertContent({
            type: this.name,
            attrs: { content },
          });
        },

      updateMuikkuConnectField:
        (pairs) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          const prev = editor.getAttributes(this.name)
            .content as MuikkuConnectFieldContent | null;

          const name = prev?.name?.trim() ?? createRandomMuikkuFieldName();

          const content = buildContentFromPairs({ name, pairs });

          return commands.updateAttributes(this.name, { content });
        },

      unsetMuikkuConnectField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },

      openMuikkuConnectFieldModal:
        () =>
        ({ editor }) => {
          if (!editor.isEditable) return false;
          window.dispatchEvent(new CustomEvent(OPEN_EVENT));
          return true;
        },
    };
  },
});

export default MuikkuConnectFieldExtension;
