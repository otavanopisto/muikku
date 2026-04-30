/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MathLiveComponent } from "./MathLiveComponent";
import type { TagParseRule } from "@tiptap/pm/model";

/**
 * MathEquationAttributes
 */
export interface MathEquationAttributes {
  latex: string;
  displayMode?: boolean;
}

type LegacyMathRule = TagParseRule & {
  // optional helper to extract latex, if you don’t want users writing getAttrs
  getAttrsLegacy?: (el: HTMLElement) =>
    | {
        latex: string;
        displayMode?: boolean;
      }
    | false
    | null;
};

/**
 * MathEquationOptions
 */
export interface MathEquationOptions {
  HTMLAttributes: Record<string, any>;
  legacyMathRules: LegacyMathRule[];
}

declare module "@tiptap/core" {
  /**
   * Commands
   */
  interface Commands<ReturnType> {
    mathEquation: {
      setMathEquation: (options: MathEquationAttributes) => ReturnType;
    };
  }
}

// This is the maximum number of characters allowed in a latex string.
const MAX_LATEX_CHARS = 5000;

/**
 * Sanitize the latex string to avoid overflow.
 * @param raw - The latex string to sanitize.
 * @returns The sanitized latex string.
 */
function sanitizeLatex(raw: string | null | undefined): string {
  const t = (raw ?? "").trim();
  if (t.length <= MAX_LATEX_CHARS) return t;
  return t.slice(0, MAX_LATEX_CHARS);
}

// Create the MathEquation extension
export const MathEquation = Node.create<MathEquationOptions>({
  name: "mathEquation",
  inline: true,
  atom: true,
  // Define the group this node belongs to
  group: "inline",

  addOptions() {
    return {
      HTMLAttributes: {},
      legacyMathRules: [],
    };
  },

  // Attribute strategy (important):
  // We intentionally DO NOT use `addAttributes().parseHTML` for `latex` / `displayMode`.
  // Instead, we parse *all* formats via `parseHTML().getAttrs`.
  // Reason: When `addAttributes().parseHTML` is present, Tiptap may re-parse attributes
  // from the DOM element after `getAttrs` runs, which can overwrite values returned by
  // `getAttrs` (e.g. legacy spans don’t have `data-latex`, so latex becomes "").
  // Therefore:
  // - `addAttributes()` only defines defaults + renderHTML serialization
  // - `parseHTML()` contains one rule per supported/migrated HTML shape
  addAttributes() {
    return {
      latex: {
        default: "",
        renderHTML: (attributes) => ({
          "data-latex": sanitizeLatex(attributes.latex as string),
        }),
      },
      displayMode: {
        default: false,
        renderHTML: (attributes) => ({
          "data-display-mode": !!attributes.displayMode,
        }),
      },
    };
  },

  // HTML parsing / migration
  // We support both:
  // 1) New Tiptap format:
  //    <span data-type="math-equation" data-latex="..." data-display-mode="...">...</span>
  // 2) Legacy format:
  // Parse rules are added to the extension to support legacy formats. This is important for migration.
  // Each parse rule uses `getAttrs` to compute node attrs.
  parseHTML() {
    return [
      {
        // New format: read canonical data-* attributes.
        tag: 'span[data-type="math-equation"]',
        getAttrs: (el) => ({
          latex: sanitizeLatex(el.getAttribute("data-latex")),
          displayMode: el.getAttribute("data-display-mode") === "true",
        }),
      },

      // Map legacy math rules
      ...(this.options.legacyMathRules ?? []).map((rule) => ({
        ...rule,
        getAttrs: (el: HTMLElement) => {
          const attrs = rule.getAttrsLegacy?.(el) ?? false;
          if (attrs) {
            const isDisplay =
              attrs.displayMode ??
              ((attrs.latex.startsWith("\\[") && attrs.latex.endsWith("\\]")) ||
                (attrs.latex.startsWith("$$") && attrs.latex.endsWith("$$")));
            return {
              latex: sanitizeLatex(attrs.latex),
              displayMode: isDisplay,
            };
          }
          return false;
        },
      })),
    ];
  },

  // Serialization:
  // Always emit the new canonical format (data-type + data-latex + data-display-mode),
  // so legacy inputs automatically migrate when content is re-saved / round-tripped.
  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      mergeAttributes(
        { "data-type": "math-equation" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      node.attrs.latex,
    ];
  },

  // Add the React component as a node view
  addNodeView() {
    return ReactNodeViewRenderer(MathLiveComponent);
  },

  // Add commands to the editor
  addCommands() {
    return {
      setMathEquation:
        (attributes: MathEquationAttributes) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    };
  },
});
