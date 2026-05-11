import { Image } from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";
import { MuikkuImageView } from "./MuikkuImageView";
import { ReactNodeViewRenderer } from "@tiptap/react";

/**
 * Horizontal alignment for images (CKEditor-style: float left/right, block center).
 * `null` = "Ei asetettu" — no alignment in exported `style` from this extension.
 *
 * Later: `figure` + `figcaption` as a separate node for "kuva kuvatekstillä".
 */
export type MuikkuImageAlign = "left" | "center" | "right";

/**
 * MuikkuImageAttributes
 */
export interface MuikkuImageAttributes {
  align: MuikkuImageAlign | null;
  dataAuthor: string | null;
  dataAuthorUrl: string | null;
  dataLicense: string | null;
  dataLicenseUrl: string | null;
  dataSource: string | null;
  dataSourceUrl: string | null;
}

/**
 * Parse the align attribute from an image element.
 * @param el - The image element.
 * @returns The align attribute.
 */
export function parseAlignFromImg(el: HTMLElement): MuikkuImageAlign | null {
  const data = el.getAttribute("data-align")?.trim().toLowerCase();
  if (data === "left" || data === "center" || data === "right") {
    return data;
  }

  const legacyAlign = el.getAttribute("align")?.trim().toLowerCase();
  if (legacyAlign === "left") return "left";
  if (legacyAlign === "right") return "right";
  if (legacyAlign === "middle" || legacyAlign === "center") return "center";

  const style = el.getAttribute("style") ?? "";
  if (/float\s*:\s*left/i.test(style)) return "left";
  if (/float\s*:\s*right/i.test(style)) return "right";
  if (
    /float\s*:\s*none/i.test(style) &&
    /display\s*:\s*block/i.test(style) &&
    (/margin(-left|-right)?\s*:\s*auto/i.test(style) ||
      /margin\s*:\s*0(?:px)?\s+auto/i.test(style))
  ) {
    return "center";
  }

  return null;
}

/**
 * Generate the style string for the align attribute.
 * @param align - The align attribute.
 * @returns The style string.
 */
export function styleForAlign(align: MuikkuImageAlign | null): string | null {
  if (align === "left") return "float:left";
  if (align === "right") return "float:right";
  if (align === "center") {
    return "float:none;display:block;margin-left:auto;margin-right:auto";
  }
  return null;
}

/**
 * Merge the existing image styles with the align style.
 * @param existing - The existing image styles.
 * @param alignStyle - The align style.
 * @returns The merged style string.
 */
export function mergeImageStyles(
  existing: string | undefined,
  alignStyle: string | null
): string | undefined {
  if (!alignStyle) {
    return existing;
  }
  if (!existing?.trim()) {
    return alignStyle;
  }
  const parts = existing
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((decl) => {
      const prop = decl.split(":")[0]?.trim().toLowerCase();
      if (!prop) return true;
      if (prop === "float") return false;
      if (prop === "display") return false;
      if (prop === "margin-left" || prop === "margin-right") return false;
      if (prop === "margin") return false;
      return true;
    });
  parts.push(alignStyle);
  return parts.join("; ");
}

declare module "@tiptap/core" {
  /**
   * Commands
   */
  interface Commands<ReturnType> {
    muikkuImage: {
      setImageAlign: (align: MuikkuImageAlign | null) => ReturnType;
    };
  }
}

/**
 * MuikkuImage extension
 */
export const MuikkuImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null as MuikkuImageAlign | null,
      },
      dataAuthor: {
        default: null as string | null,
      },
      dataAuthorUrl: {
        default: null as string | null,
      },
      dataLicense: {
        default: null as string | null,
      },
      dataLicenseUrl: {
        default: null as string | null,
      },
      dataSource: {
        default: null as string | null,
      },
      dataSourceUrl: {
        default: null as string | null,
      },
    };
  },

  parseHTML() {
    const allowBase64 = this.options.allowBase64;

    return [
      {
        tag: allowBase64 ? "img[src]" : 'img[src]:not([src^="data:"])',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const src = element.getAttribute("src");
          if (!src) return false;
          if (!allowBase64 && src.startsWith("data:")) return false;

          return {
            src,
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
            width: element.getAttribute("width"),
            height: element.getAttribute("height"),
            align: parseAlignFromImg(element),
            dataAuthor: element.getAttribute("data-author"),
            dataAuthorUrl: element.getAttribute("data-author-url"),
            dataLicense: element.getAttribute("data-license"),
            dataLicenseUrl: element.getAttribute("data-license-url"),
            dataSource: element.getAttribute("data-source"),
            dataSourceUrl: element.getAttribute("data-source-url"),
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align as MuikkuImageAlign | null;
    const alignStyle = styleForAlign(align);
    const style = mergeImageStyles(
      HTMLAttributes.style as string | undefined,
      alignStyle
    );

    const dataAttrs: Record<string, string> = {};
    const a = node.attrs;
    if (a.dataAuthor) dataAttrs["data-author"] = String(a.dataAuthor);
    if (a.dataAuthorUrl) dataAttrs["data-author-url"] = String(a.dataAuthorUrl);
    if (a.dataLicense) dataAttrs["data-license"] = String(a.dataLicense);
    if (a.dataLicenseUrl)
      dataAttrs["data-license-url"] = String(a.dataLicenseUrl);
    if (a.dataSource) dataAttrs["data-source"] = String(a.dataSource);
    if (a.dataSourceUrl) dataAttrs["data-source-url"] = String(a.dataSourceUrl);

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, dataAttrs, {
        ...(style ? { style } : {}),
      }),
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align: MuikkuImageAlign | null) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { align }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuImageView);
  },
});
