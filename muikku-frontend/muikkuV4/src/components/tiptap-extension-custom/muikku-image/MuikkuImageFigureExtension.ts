import { mergeAttributes, Node } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { NodeSelection, type EditorState } from "@tiptap/pm/state";
import {
  type MuikkuImageAlign,
  parseAlignFromImg,
  styleForAlign,
  mergeImageStyles,
} from "./MuikkuImageExtension";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MuikkuImageFigureView } from "./MuikkuImageFigureView";

/**
 * MuikkuImageFigureOptions
 */
export interface MuikkuImageFigureOptions {
  /** Allow base64 data: URLs as image src. */
  allowBase64: boolean;
  /** Default HTML attributes added to the rendered <figure>. */
  HTMLAttributes: Record<string, unknown>;
  /** Default HTML attributes added to the inner <img>. */
  imgHTMLAttributes: Record<string, unknown>;
}

/**
 * MuikkuImageFigureAttributes
 */
export interface MuikkuImageFigureAttributes {
  src: string | null;
  alt: string | null;
  title: string | null;
  width: string | number | null;
  height: string | number | null;
  align: MuikkuImageAlign | null;
  dataAuthor: string | null;
  dataAuthorUrl: string | null;
  dataLicense: string | null;
  dataLicenseUrl: string | null;
  dataSource: string | null;
  dataSourceUrl: string | null;
}

declare module "@tiptap/core" {
  // eslint-disable-next-line jsdoc/require-jsdoc
  interface Commands<ReturnType> {
    muikkuImageFigure: {
      /** Insert a new captioned image. */
      setImageFigure: (
        attrs: Partial<MuikkuImageFigureAttributes>,
        captionText?: string
      ) => ReturnType;
      /** Convert the selected `image` node to `imageFigure` with an empty (or given) caption. */
      addImageCaption: (captionText?: string) => ReturnType;
      /** Convert the selected `imageFigure` node back to `image` (caption text is dropped). */
      removeImageCaption: () => ReturnType;
      /** Toggle caption on the selected image / image figure. */
      toggleImageCaption: () => ReturnType;
    };
  }
}

/**
 * Parse the align attribute from a <figure>; falls back to its inner <img>.
 * @param figure - The <figure> element.
 * @param img - The inner <img> element (if any).
 * @returns The align value or null.
 */
function parseAlignFromFigure(
  figure: HTMLElement,
  img: HTMLElement | null
): MuikkuImageAlign | null {
  const data = figure.getAttribute("data-align")?.trim().toLowerCase();
  if (data === "left" || data === "center" || data === "right") return data;

  const style = figure.getAttribute("style") ?? "";
  if (/float\s*:\s*left/i.test(style)) return "left";
  if (/float\s*:\s*right/i.test(style)) return "right";
  if (
    /float\s*:\s*none/i.test(style) &&
    (/margin(-left|-right)?\s*:\s*auto/i.test(style) ||
      /margin\s*:\s*0(?:px)?\s+auto/i.test(style))
  ) {
    return "center";
  }

  return img ? parseAlignFromImg(img) : null;
}

/**
 * Read CKEditor-style image fields from either an inner <img> or a <figure>
 * that carries src/alt/data-* on the figure (no <img> child).
 * @param figure - The <figure> element.
 * @param allowBase64 - Whether to allow base64 data: URLs as image src.
 * @returns The image figure attributes or false.
 */
function parseImageFigureAttrsFromDom(
  figure: HTMLElement,
  allowBase64: boolean
):
  | Omit<
      MuikkuImageFigureAttributes,
      "class" extends keyof MuikkuImageFigureAttributes ? never : never
    >
  | false {
  const img =
    figure.querySelector<HTMLElement>(":scope > img") ??
    figure.querySelector<HTMLElement>("img");

  const source: HTMLElement = img ?? figure;
  const src = source.getAttribute("src");
  if (!src) return false;
  if (!allowBase64 && src.startsWith("data:")) return false;

  return {
    src,
    alt: source.getAttribute("alt"),
    title: source.getAttribute("title"),
    width: source.getAttribute("width"),
    height: source.getAttribute("height"),
    align: parseAlignFromFigure(figure, img),
    dataAuthor: source.getAttribute("data-author"),
    dataAuthorUrl: source.getAttribute("data-author-url"),
    dataLicense: source.getAttribute("data-license"),
    dataLicenseUrl: source.getAttribute("data-license-url"),
    dataSource: source.getAttribute("data-source"),
    dataSourceUrl: source.getAttribute("data-source-url"),
  };
}

/**
 * Build the attributes for the inner <img> tag from a node.
 * @param node - The PM node.
 * @param baseImgHtmlAttrs - Default attrs from extension options.
 * @returns The merged attrs object.
 */
function buildImgAttrs(
  node: PMNode,
  baseImgHtmlAttrs: Record<string, unknown>
): Record<string, unknown> {
  const a = node.attrs as MuikkuImageFigureAttributes;
  const out: Record<string, unknown> = { ...baseImgHtmlAttrs };
  if (a.src) out.src = a.src;
  if (a.alt != null) out.alt = a.alt;
  if (a.title != null) out.title = a.title;
  if (a.width != null) out.width = a.width;
  if (a.height != null) out.height = a.height;
  if (a.dataAuthor) out["data-author"] = String(a.dataAuthor);
  if (a.dataAuthorUrl) out["data-author-url"] = String(a.dataAuthorUrl);
  if (a.dataLicense) out["data-license"] = String(a.dataLicense);
  if (a.dataLicenseUrl) out["data-license-url"] = String(a.dataLicenseUrl);
  if (a.dataSource) out["data-source"] = String(a.dataSource);
  if (a.dataSourceUrl) out["data-source-url"] = String(a.dataSourceUrl);
  return out;
}

/**
 * Find an `image` or `imageFigure` node at the current selection.
 * Works for both NodeSelection and TextSelection inside an `imageFigure`.
 * @param state - The editor state.
 * @param typeName - The node type name to find.
 * @returns The node and its position, or null.
 */
function findActiveImageNodeInfo(
  state: EditorState,
  typeName: "image" | "imageFigure"
): { node: PMNode; pos: number } | null {
  const sel = state.selection;
  if (sel instanceof NodeSelection && sel.node.type.name === typeName) {
    return { node: sel.node, pos: sel.from };
  }

  const $from = sel.$from;
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === typeName) {
      return { node, pos: $from.before(depth) };
    }
  }
  return null;
}

/**
 * MuikkuImageFigure
 *
 * Block node that renders as `<figure><img …><figcaption>…</figcaption></figure>`.
 * Caption is editable inline content. Float / centering live on the <figure>
 * (so legacy CKEditor-style float on the inner <img> is handled at parse time
 * but normalized to figure on save).
 */
export const MuikkuImageFigure = Node.create<MuikkuImageFigureOptions>({
  name: "imageFigure",

  group: "block",
  content: "inline*",
  defining: true,
  isolating: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      allowBase64: false,
      HTMLAttributes: {},
      imgHTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      class: { default: "image" },
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      align: { default: null as MuikkuImageAlign | null },
      dataAuthor: { default: null },
      dataAuthorUrl: { default: null },
      dataLicense: { default: null },
      dataLicenseUrl: { default: null },
      dataSource: { default: null },
      dataSourceUrl: { default: null },
    };
  },

  parseHTML() {
    const allowBase64 = this.options.allowBase64;
    const finish = (el: HTMLElement) => {
      if (!(el instanceof HTMLElement)) return false;
      const hasFigcaption = !!el.querySelector(
        ":scope > figcaption, figcaption"
      );
      if (!hasFigcaption) return false;
      const attrs = parseImageFigureAttrsFromDom(el, allowBase64);
      if (!attrs) return false;
      return {
        class: el.getAttribute("class") ?? "image",
        ...attrs,
      };
    };
    return [
      {
        tag: "figure.image",
        priority: 70,
        contentElement: "figcaption",
        getAttrs: finish,
      },
      {
        tag: "figure",
        priority: 60,
        contentElement: "figcaption",
        getAttrs: finish,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align as MuikkuImageAlign | null;
    const alignStyle = styleForAlign(align);
    const figureStyle = mergeImageStyles(
      HTMLAttributes.style as string | undefined,
      alignStyle
    );

    const klass =
      typeof node.attrs.class === "string" && node.attrs.class.trim()
        ? node.attrs.class.trim()
        : "image";

    const figureAttrs = mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      {
        class: klass,
        ...(figureStyle ? { style: figureStyle } : {}),
      }
    );

    const imgAttrs = buildImgAttrs(node, this.options.imgHTMLAttributes);

    return ["figure", figureAttrs, ["img", imgAttrs], ["figcaption", 0]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuikkuImageFigureView);
  },

  addCommands() {
    return {
      setImageFigure:
        (attrs, captionText) =>
        ({ chain }) => {
          const content = captionText
            ? [{ type: "text", text: captionText }]
            : [];
          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs,
              content,
            })
            .run();
        },

      addImageCaption:
        (captionText) =>
        ({ state, chain }) => {
          const info = findActiveImageNodeInfo(state, "image");
          if (!info) return false;

          const content = captionText
            ? [{ type: "text", text: captionText }]
            : [];

          return chain()
            .focus()
            .insertContentAt(
              { from: info.pos, to: info.pos + info.node.nodeSize },
              {
                type: "imageFigure",
                attrs: { class: "image", ...info.node.attrs },
                content,
              }
            )
            .run();
        },

      removeImageCaption:
        () =>
        ({ state, chain }) => {
          const info = findActiveImageNodeInfo(state, "imageFigure");
          if (!info) return false;

          return chain()
            .focus()
            .insertContentAt(
              { from: info.pos, to: info.pos + info.node.nodeSize },
              {
                type: "image",
                attrs: { ...info.node.attrs },
              }
            )
            .run();
        },

      toggleImageCaption:
        () =>
        ({ commands, state }) => {
          if (findActiveImageNodeInfo(state, "imageFigure"))
            return commands.removeImageCaption();
          if (findActiveImageNodeInfo(state, "image"))
            return commands.addImageCaption();
          return false;
        },
    };
  },
});
