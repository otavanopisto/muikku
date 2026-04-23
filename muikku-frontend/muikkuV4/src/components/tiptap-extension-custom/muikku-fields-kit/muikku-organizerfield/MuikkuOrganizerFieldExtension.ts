import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  createRandomMuikkuFieldName,
  readMuikkuObjectContentParam,
  renderMuikkuObjectTag,
} from "../helpers";
import { MuikkuOrganizerFieldPlaceholder } from "./MuikkuOrganizerFieldPlaceholder";

export type MuikkuOrganizerTerm = {
  id: string; // "t1", "t2", ...
  name: string;
};

export type MuikkuOrganizerCategory = {
  id: string; // "c1", "c2", ...
  name: string;
};

export type MuikkuOrganizerCategoryTerms = {
  category: string; // category id
  terms: string[]; // term ids
};

export type MuikkuOrganizerFieldContent = {
  name: string;
  termTitle: string;
  terms: MuikkuOrganizerTerm[];
  categories: MuikkuOrganizerCategory[];
  categoryTerms: MuikkuOrganizerCategoryTerms[];
};

export type MuikkuOrganizerFieldAttrs = {
  content: MuikkuOrganizerFieldContent | null;
};

const FIELD_OBJECT_TYPE = "application/vnd.muikku.field.organizer";
const OPEN_EVENT = "muikku:open-muikku-organizerfield-modal";

/**
 * Checks if a value is a record.
 * @param value - The value to check.
 * @returns True if the value is a record, false otherwise.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Normalizes a string.
 * @param v - The value to normalize.
 * @returns The normalized string.
 */
function normalizeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Normalizes the terms.
 * @param v - The value to normalize.
 * @returns The normalized terms.
 */
function normalizeTerms(v: unknown): MuikkuOrganizerTerm[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return { id: "", name: "" };
      const id = typeof x.id === "string" ? x.id : "";
      const name = typeof x.name === "string" ? x.name : "";
      return { id, name };
    })
    .filter((t) => t.id && t.name);
}

/**
 * Normalizes the categories.
 * @param v - The value to normalize.
 * @returns The normalized categories.
 */
function normalizeCategories(v: unknown): MuikkuOrganizerCategory[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return { id: "", name: "" };
      const id = typeof x.id === "string" ? x.id : "";
      const name = typeof x.name === "string" ? x.name : "";
      return { id, name };
    })
    .filter((c) => c.id);
}

/**
 * Normalizes the category terms.
 * @param v - The value to normalize.
 * @returns The normalized category terms.
 */
function normalizeCategoryTerms(v: unknown): MuikkuOrganizerCategoryTerms[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return { category: "", terms: [] };
      const category = typeof x.category === "string" ? x.category : "";
      const terms = Array.isArray(x.terms)
        ? x.terms.filter((t: unknown): t is string => typeof t === "string")
        : [];
      return { category, terms };
    })
    .filter((ct) => ct.category);
}

/**
 * Normalizes the content.
 * @param input - The value to normalize.
 * @returns The normalized content.
 */
function normalizeContent(input: unknown): MuikkuOrganizerFieldContent | null {
  if (!input || typeof input !== "object") return null;

  const obj = input as Partial<MuikkuOrganizerFieldContent>;

  const name =
    typeof obj.name === "string" && obj.name.trim().length
      ? obj.name.trim()
      : createRandomMuikkuFieldName();

  return {
    name,
    termTitle: normalizeString(obj.termTitle),
    terms: normalizeTerms(obj.terms),
    categories: normalizeCategories(obj.categories),
    categoryTerms: normalizeCategoryTerms(obj.categoryTerms),
  };
}

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku organizer field extension.
   * @param ReturnType - The return type of the commands.
   */
  interface Commands<ReturnType> {
    muikkuOrganizerField: {
      setMuikkuOrganizerField: (
        content?: Partial<MuikkuOrganizerFieldContent>
      ) => ReturnType;
      updateMuikkuOrganizerField: (
        content: Partial<MuikkuOrganizerFieldContent>
      ) => ReturnType;
      unsetMuikkuOrganizerField: () => ReturnType;
      openMuikkuOrganizerFieldModal: () => ReturnType;
    };
  }
}

/**
 * The Muikku organizer field extension.
 * @returns The Muikku organizer field extension.
 */
export const MuikkuOrganizerFieldExtension = Node.create({
  name: "muikkuOrganizerField",

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
    } satisfies Record<keyof MuikkuOrganizerFieldAttrs, unknown>;
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
        termTitle: "",
        terms: [],
        categories: [],
        categoryTerms: [],
      } satisfies MuikkuOrganizerFieldContent);

    return renderMuikkuObjectTag({
      objectType: FIELD_OBJECT_TYPE,
      htmlAttributes: HTMLAttributes,
      content,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuOrganizerFieldPlaceholder);
  },

  addCommands() {
    return {
      setMuikkuOrganizerField:
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

      updateMuikkuOrganizerField:
        (partial) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          const prev = editor.getAttributes(this.name)
            .content as MuikkuOrganizerFieldContent | null;

          const next = normalizeContent({
            ...(prev ?? {}),
            ...(partial ?? {}),
          });
          if (!next) return false;

          return commands.updateAttributes(this.name, { content: next });
        },

      unsetMuikkuOrganizerField:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },

      openMuikkuOrganizerFieldModal:
        () =>
        ({ editor }) => {
          if (!editor.isEditable) return false;
          window.dispatchEvent(new CustomEvent(OPEN_EVENT));
          return true;
        },
    };
  },
});

export default MuikkuOrganizerFieldExtension;
