import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import IframePlaceholder from "./IframePlaceholder";

export type IframeAlignment = "unset" | "left" | "center" | "right";

export type IframeAttrs = {
  src: string | null;
  width: string | null;
  height: string | null;
  scrolling: "yes" | "no" | null;
  frameborder: "0" | "1" | null;
  id: string | null;
  class: string | null;
  style: string | null;
  title: string | null;
  alignment: IframeAlignment;
};

declare module "@tiptap/core" {
  /**
   * Commands for the iframe extension.
   */
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (attrs: Partial<IframeAttrs>) => ReturnType;
      updateIframe: (attrs: Partial<IframeAttrs>) => ReturnType;
      unsetIframe: () => ReturnType;
    };
  }
}

/**
 * Empty to null.
 * @param v - The string to convert.
 * @returns The string or null.
 */
function emptyToNull(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}

/**
 * Strip properties from a style string.
 * @param style - The style string to strip.
 * @param props - The properties to strip.
 * @returns The stripped style string.
 */
function stripProps(style: string, props: string[]) {
  const remove = new Set(props.map((p) => p.toLowerCase()));
  return style
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((decl) => {
      const key = decl.split(":")[0]?.trim()?.toLowerCase();
      return key ? !remove.has(key) : true;
    })
    .join("; ");
}

/**
 * Apply align to a style string.
 * @param style - The style string to apply align to.
 * @param align - The align to apply.
 * @returns The applied style string.
 */
function applyAlignToStyle(style: string, align: IframeAlignment): string {
  const base = stripProps(style, ["display", "margin-left", "margin-right"]);
  if (align === "unset") return base;

  const decls: string[] = ["display: block"];

  if (align === "center") {
    decls.push("margin-left: auto", "margin-right: auto");
  } else if (align === "left") {
    decls.push("margin-left: 0", "margin-right: auto");
  } else if (align === "right") {
    decls.push("margin-left: auto", "margin-right: 0");
  }

  const alignStyle = decls.join("; ");
  return base ? `${base}; ${alignStyle}` : alignStyle;
}

/**
 * Parse alignment from a style string.
 * @param styleAttr - The style string to parse alignment from.
 * @returns The parsed alignment.
 */
function parseAlignmentFromStyle(styleAttr: string | null): IframeAlignment {
  if (!styleAttr) return "unset";
  const s = styleAttr.toLowerCase();

  const hasMLAuto = /margin-left\s*:\s*auto/.test(s);
  const hasMRAuto = /margin-right\s*:\s*auto/.test(s);

  if (hasMLAuto && hasMRAuto) return "center";
  if (hasMRAuto && !hasMLAuto) return "left";
  if (hasMLAuto && !hasMRAuto) return "right";
  return "unset";
}

export const IframeExtension = Node.create({
  name: "iframe",

  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("src"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.src ? { src: attrs.src as string } : {},
      },
      width: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("width"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.width ? { width: attrs.width as string } : {},
      },
      height: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("height"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.height ? { height: attrs.height as string } : {},
      },
      scrolling: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("scrolling"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.scrolling ? { scrolling: attrs.scrolling as string } : {},
      },
      frameborder: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("frameborder") ?? el.getAttribute("frameBorder"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.frameborder ? { frameborder: attrs.frameborder as string } : {},
      },
      id: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("id"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.id ? { id: attrs.id as string } : {},
      },
      class: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("class"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.class ? { class: attrs.class as string } : {},
      },
      title: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("title"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.title ? { title: attrs.title as string } : {},
      },
      style: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("style"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.style ? { style: attrs.style as string } : {},
      },
      alignment: {
        default: "unset",
        parseHTML: (el: HTMLElement) => {
          const dataAlignment = el.getAttribute(
            "data-alignment"
          ) as IframeAlignment | null;

          if (
            dataAlignment === "left" ||
            dataAlignment === "center" ||
            dataAlignment === "right"
          ) {
            return dataAlignment;
          }

          // Legacy align attribute is deprecated. Ckeditor 4 uses it.
          const legacyAlign = el.getAttribute("align");
          if (
            legacyAlign === "left" ||
            legacyAlign === "center" ||
            legacyAlign === "right"
          ) {
            return legacyAlign;
          }
          // fall back to infer from style
          return parseAlignmentFromStyle(el.getAttribute("style"));
        },
        renderHTML: () => ({}), // handled in extension's main renderHTML() method below
      },
    };
  },

  parseHTML() {
    return [{ tag: "iframe" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const src = emptyToNull(HTMLAttributes.src as string | null);
    const styleRaw = (HTMLAttributes.style as string | null) ?? "";
    // Get alignment from node attributes, because it's not stored in the HTML attributes.
    const alignment =
      (node.attrs.alignment as IframeAlignment | null) ?? "unset";

    // merge alignment into style. This is because iframe align is deprecated.
    const style = applyAlignToStyle(styleRaw, alignment);

    // Colletct updated attributes.
    const attrs: Record<string, unknown> = {
      ...HTMLAttributes,
      src: src ?? undefined,
      style: style ? style : undefined,
    };

    // Return the iframe tag with the merged attributes.
    return ["iframe", mergeAttributes(attrs)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframePlaceholder);
  },

  addCommands() {
    return {
      setIframe:
        (attrs) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          const src = emptyToNull(attrs.src ?? null);
          if (!src) return false;

          return commands.insertContent({
            type: this.name,
            attrs: {
              ...attrs,
              src,
            },
          });
        },

      updateIframe:
        (attrs) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          // If src is provided, require non-empty
          if (attrs.src !== undefined) {
            const src = emptyToNull(attrs.src ?? null);
            if (!src) return false;
            return commands.updateAttributes(this.name, { ...attrs, src });
          }

          return commands.updateAttributes(this.name, attrs);
        },

      unsetIframe:
        () =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;
          return commands.deleteSelection();
        },
    };
  },
});

export default IframeExtension;
