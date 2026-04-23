import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";
import { MuikkuSorterFieldPlaceholder } from "./MuikkuSorterFieldPlaceholder";

export type MuikkuSorterFieldOrientation = "vertical" | "horizontal";

export type MuikkuSorterFieldItem = {
  id: string;
  name: string;
};

export type MuikkuSorterFieldContent = {
  name: string;
  orientation?: MuikkuSorterFieldOrientation;
  capitalize?: boolean;
  items?: MuikkuSorterFieldItem[];
};

export type MuikkuSorterFieldAttrs = {
  content: MuikkuSorterFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.sorter";
const OPEN_EVENT = "muikku:open-muikku-sorterfield-modal";

/**
 * Checks if a value is a record.
 * @param value - The value to check.
 * @returns True if the value is a record, false otherwise.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes the orientation.
 * @param v - The value to normalize.
 * @returns The normalized orientation.
 */
function normalizeOrientation(v: unknown): MuikkuSorterFieldOrientation {
  return v === "horizontal" ? "horizontal" : "vertical";
}

/**
 * Normalizes the items.
 * @param v - The value to normalize.
 * @returns The normalized items.
 */
function normalizeItems(v: unknown): MuikkuSorterFieldItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return null;
      const id = typeof x.id === "string" ? x.id : "";
      const name = typeof x.name === "string" ? x.name : "";
      return { id, name };
    })
    .filter((x): x is MuikkuSorterFieldItem => !!x && !!x.id);
}

/**
 * Normalizes the content.
 * @param input - The value to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuSorterFieldContent | null {
  if (!isRecord(input)) return null;

  const name =
    typeof input.name === "string" && input.name.trim().length
      ? input.name.trim()
      : createRandomMuikkuFieldName();

  return {
    name,
    orientation: normalizeOrientation(input.orientation),
    capitalize:
      typeof input.capitalize === "boolean" ? input.capitalize : false,
    items: normalizeItems(input.items),
  };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku sorter field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuSorterField: {
      setMuikkuSorterField: (
        content?: Partial<MuikkuSorterFieldContent>
      ) => ReturnType;
      updateMuikkuSorterField: (
        content: Partial<MuikkuSorterFieldContent>
      ) => ReturnType;
      unsetMuikkuSorterField: () => ReturnType;
      openMuikkuSorterFieldModal: () => ReturnType;
    };
  }
}

export const MuikkuSorterFieldExtension = Node.create({
  name: "muikkuSorterField",

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
    } satisfies Record<keyof MuikkuSorterFieldAttrs, unknown>;
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
        orientation: "vertical",
        capitalize: false,
        items: [],
      } satisfies MuikkuSorterFieldContent);

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuSorterFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuSorterField:
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

      updateMuikkuSorterField:
        (partial) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          const prev = editor.getAttributes(this.name)
            .content as MuikkuSorterFieldContent | null;

          const next = normalizeContent({
            ...(prev ?? {}),
            ...(partial ?? {}),
          });
          if (!next) return false;

          return commands.updateAttributes(this.name, { content: next });
        },

      unsetMuikkuSorterField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },

      openMuikkuSorterFieldModal:
        () =>
        ({ editor }) => {
          if (!editor.isEditable) return false;
          window.dispatchEvent(new CustomEvent(OPEN_EVENT));
          return true;
        },
    };
  },
});

export default MuikkuSorterFieldExtension;
