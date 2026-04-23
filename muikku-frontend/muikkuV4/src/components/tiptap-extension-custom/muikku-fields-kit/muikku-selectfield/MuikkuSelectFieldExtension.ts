import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
} from "../helpers";
import { MuikkuSelectFieldPlaceholder } from "./MuikkuSelectFieldPlaceholder";

export type MuikkuSelectionListType =
  | "dropdown"
  | "list"
  | "radio-horizontal"
  | "radio-vertical"
  | "checkbox-horizontal"
  | "checkbox-vertical";

export type MuikkuSelectionOption = {
  name: string;
  text: string;
  correct: boolean;
};

export type MuikkuSelectionFieldContent = {
  name: string;
  explanation?: string;
  listType?: MuikkuSelectionListType;
  options?: MuikkuSelectionOption[];
};

export type MuikkuSelectionFieldAttrs = {
  content: MuikkuSelectionFieldContent | null;
};

const SELECT_OBJECT_TYPE = "application/vnd.muikku.field.select";
const MULTISELECT_OBJECT_TYPE = "application/vnd.muikku.field.multiselect";
const OPEN_EVENT = "muikku:open-muikku-selectionfield-modal";

/**
 * Checks if a value is a record.
 * @param value - The value to check.
 * @returns True if the value is a record, false otherwise.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes the list type.
 * @param v - The value to normalize.
 * @returns The normalized list type.
 */
function normalizeListType(v: unknown): MuikkuSelectionListType {
  switch (v) {
    case "list":
    case "radio-horizontal":
    case "radio-vertical":
    case "checkbox-horizontal":
    case "checkbox-vertical":
    case "dropdown":
      return v;
    default:
      return "dropdown";
  }
}

/**
 * Normalizes the options.
 * @param v - The value to normalize.
 * @returns The normalized options.
 */
function normalizeOptions(v: unknown): MuikkuSelectionOption[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return null;
      const name = typeof x.name === "string" ? x.name : "";
      const text = typeof x.text === "string" ? x.text : "";
      const correct = typeof x.correct === "boolean" ? x.correct : false;
      return { name, text, correct };
    })
    .filter((o): o is MuikkuSelectionOption => !!o && !!o.name);
}

/**
 * Checks if a list type is a multiselect.
 * @param listType - The list type to check.
 * @returns True if the list type is a multiselect, false otherwise.
 */
function isMultiselectByListType(listType: MuikkuSelectionListType): boolean {
  return listType === "checkbox-horizontal" || listType === "checkbox-vertical";
}

/**
 * Normalizes the content.
 * @param input - The value to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuSelectionFieldContent | null {
  if (!isRecord(input)) return null;

  const name =
    typeof input.name === "string" && input.name.trim().length
      ? input.name.trim()
      : createRandomMuikkuFieldName();

  const listType = normalizeListType(input.listType);
  const options = normalizeOptions(input.options);

  return {
    name,
    listType,
    options,
    explanation: typeof input.explanation === "string" ? input.explanation : "",
  };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku selection field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuSelectionField: {
      setMuikkuSelectionField: (
        content?: Partial<MuikkuSelectionFieldContent>
      ) => ReturnType;
      updateMuikkuSelectionField: (
        content: Partial<MuikkuSelectionFieldContent>
      ) => ReturnType;
      unsetMuikkuSelectionField: () => ReturnType;
      openMuikkuSelectionFieldModal: () => ReturnType;
    };
  }
}

export const MuikkuSelectionFieldExtension = Node.create({
  name: "muikkuSelectionField",

  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,
  content: "",

  addAttributes() {
    return {
      objectType: {
        default: SELECT_OBJECT_TYPE,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("type") ?? SELECT_OBJECT_TYPE,
        renderHTML: () => ({}), // handled in renderHTML()
      },
      content: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          normalizeContent(readMuikkuObjectContentParam(el)),
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [
      { tag: `object[type="${SELECT_OBJECT_TYPE}"]` },
      { tag: `object[type="${MULTISELECT_OBJECT_TYPE}"]` },
      { tag: `cke\\:object[type="${SELECT_OBJECT_TYPE}"]` },
      { tag: `cke\\:object[type="${MULTISELECT_OBJECT_TYPE}"]` },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const content =
      normalizeContent(node.attrs.content) ??
      ({
        name: createRandomMuikkuFieldName(),
        listType: "dropdown",
        options: [],
        explanation: "",
      } satisfies MuikkuSelectionFieldContent);

    const listType = content.listType ?? "dropdown";
    const objectType = isMultiselectByListType(listType)
      ? MULTISELECT_OBJECT_TYPE
      : SELECT_OBJECT_TYPE;

    // CKEditor also appended default UI elements (select/radio/checkbox).
    // You *can* replicate that later, but for now we keep the required param structure identical.
    return [
      "object",
      mergeAttributes(HTMLAttributes, { type: objectType }),
      ["param", { name: "type", value: "application/json" }],
      ["param", { name: "content", value: JSON.stringify(content) }],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuSelectFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuSelectionField:
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
            attrs: {
              content,
              objectType: isMultiselectByListType(
                content.listType ?? "dropdown"
              )
                ? MULTISELECT_OBJECT_TYPE
                : SELECT_OBJECT_TYPE,
            },
          });
        },

      updateMuikkuSelectionField:
        (partial) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          const prev = editor.getAttributes(this.name)
            .content as MuikkuSelectionFieldContent | null;

          const next = normalizeContent({
            ...(prev ?? {}),
            ...(partial ?? {}),
          });
          if (!next) return false;

          return commands.updateAttributes(this.name, {
            content: next,
            objectType: isMultiselectByListType(next.listType ?? "dropdown")
              ? MULTISELECT_OBJECT_TYPE
              : SELECT_OBJECT_TYPE,
          });
        },

      unsetMuikkuSelectionField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },

      openMuikkuSelectionFieldModal:
        () =>
        ({ editor }) => {
          if (!editor.isEditable) return false;
          window.dispatchEvent(new CustomEvent(OPEN_EVENT));
          return true;
        },
    };
  },
});

export default MuikkuSelectionFieldExtension;
