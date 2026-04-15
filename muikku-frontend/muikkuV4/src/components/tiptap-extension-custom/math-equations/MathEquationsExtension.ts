/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MathLiveComponent } from "./MathLiveComponent";

/**
 * MathEquationAttributes
 */
export interface MathEquationAttributes {
  latex: string;
  displayMode?: boolean;
}

/**
 * MathEquationOptions
 */
export interface MathEquationOptions {
  HTMLAttributes: Record<string, any>;
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

// Create the MathEquation extension
export const MathEquation = Node.create<MathEquationOptions>({
  name: "mathEquation",
  inline: true,
  atom: true,
  // Define the group this node belongs to
  group: "inline",

  // Define the attributes
  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex"),
        renderHTML: (attributes) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          "data-latex": attributes.latex,
        }),
      },
      displayMode: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-display-mode") === "true",
        renderHTML: (attributes) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          "data-display-mode": attributes.displayMode,
        }),
      },
    };
  },

  // Define how the node should be parsed from HTML
  parseHTML() {
    return [
      {
        tag: 'span[data-type="math-equation"]',
      },
    ];
  },

  // Define how the node should be rendered to HTML
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
