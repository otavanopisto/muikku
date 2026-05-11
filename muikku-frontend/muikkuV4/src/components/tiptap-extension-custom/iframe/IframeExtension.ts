import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { IframePlaceholder } from "./IframePlaceholder";

export const OPEN_EVENT = "muikku:open-iframe-modal";

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

export type IframeOptions = {
  /**
   * If provided, only allow iframe src whose hostname matches the allowlist.
   * Supports exact match ("example.com") and wildcard subdomains ("*.example.com").
   *
   * If empty/undefined, hostnames are not restricted (protocol rules still apply).
   */
  srcAllowlist?: string[];

  /**
   * Allowed URL protocols for iframe src.
   * @default ["https:"]
   */
  allowedProtocols?: string[];

  /**
   * If true, keep `class` attribute (sanitized).
   * @default false
   */
  allowClass?: boolean;

  /**
   * If true, keep `style` attribute (sanitized).
   * @default false
   */
  allowStyle?: boolean;

  /**
   * If true, keep `id` attribute.
   * @default false
   */
  allowId?: boolean;

  /**
   * If true, keep `title` attribute.
   * @default true
   */
  allowTitle?: boolean;

  /**
   * If true, read legacy `align` attribute (CKEditor 4).
   * @default true
   */
  allowLegacyAlign?: boolean;

  /**
   * If true, iframes with invalid src are dropped at parse time (not converted to a node).
   * @default true
   */
  dropInvalidIframesOnParse?: boolean;
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
 */
function emptyToNull(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}

/**
 * Strip properties from a style string.
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

/**
 * Allow only "123" or "123%". Everything else -> null.
 */
function sanitizeDimension(v: string | null | undefined): string | null {
  const t = emptyToNull(v);
  if (!t) return null;
  if (/^\d+%?$/.test(t)) return t;
  return null;
}

/**
 * Keep only simple class tokens (letters/numbers/_/-). Drop others.
 * (If allowClass=false, caller will drop entirely.)
 */
function sanitizeClass(v: string | null | undefined): string | null {
  const t = emptyToNull(v);
  if (!t) return null;
  const tokens = t
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => /^[a-zA-Z0-9_-]+$/.test(s));
  return tokens.length ? tokens.join(" ") : null;
}

/**
 * Very conservative style sanitizer: currently drops everything except
 * width/height (optional) and border (optional). You can expand this later.
 *
 * If you don’t need inline style at all, keep allowStyle=false.
 */
function sanitizeStyle(v: string | null | undefined): string | null {
  const t = emptyToNull(v);
  if (!t) return null;

  const allowed = new Set(["width", "height", "border"]);
  const decls = t
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((decl) => {
      const idx = decl.indexOf(":");
      if (idx < 0) return null;
      const prop = decl.slice(0, idx).trim().toLowerCase();
      const val = decl.slice(idx + 1).trim();
      if (!allowed.has(prop)) return null;

      // Basic guard: disallow CSS custom props and weird values
      if (prop.startsWith("--")) return null;
      if (!val) return null;

      return `${prop}: ${val}`;
    })
    .filter(Boolean) as string[];

  return decls.length ? decls.join("; ") : null;
}

/**
 * Check if a hostname is allowed.
 * @param hostname - The hostname to check.
 * @param allowlist - The allowlist to check.
 * @returns True if the hostname is allowed, false otherwise.
 */
function isHostnameAllowed(hostname: string, allowlist: string[]): boolean {
  const h = hostname.toLowerCase();
  return allowlist.some((rule) => {
    const r = rule.toLowerCase().trim();
    if (!r) return false;
    if (r.startsWith("*.")) {
      const suffix = r.slice(2);
      return h === suffix || h.endsWith(`.${suffix}`);
    }
    return h === r;
  });
}

/**
 * Normalize protocol relative URL to absolute URL.
 * @param raw - The raw URL.
 * @param allowedProtocols - The allowed protocols.
 * @returns The normalized URL, or null if the URL is not valid.
 */
function normalizeProtocolRelativeUrl(
  raw: string,
  allowedProtocols: string[]
): string | null {
  if (!raw.startsWith("//")) return raw;
  // Prefer https for security, fall back to first allowed protocol if needed.
  const preferred = allowedProtocols.includes("https:")
    ? "https:"
    : allowedProtocols[0];
  if (!preferred) return null;
  return `${preferred}${raw}`;
}

/**
 * Sanitizes iframe src:
 * - must be absolute URL
 * - protocol must be allowed
 * - hostname must match allowlist if provided
 */
function sanitizeSrc(
  raw: string | null | undefined,
  opts: { allowedProtocols: string[]; srcAllowlist?: string[] }
): string | null {
  const t0 = emptyToNull(raw);
  if (!t0) return null;

  const t = normalizeProtocolRelativeUrl(t0, opts.allowedProtocols);

  if (!t) return null;

  let url: URL;

  try {
    url = new URL(t);
  } catch {
    return null;
  }

  const proto = url.protocol;

  if (!opts.allowedProtocols.includes(proto)) return null;
  if (opts.srcAllowlist && opts.srcAllowlist.length > 0) {
    if (!isHostnameAllowed(url.hostname, opts.srcAllowlist)) return null;
  }
  return url.toString();
}

export const IframeExtension = Node.create<IframeOptions>({
  name: "iframe",

  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      srcAllowlist: undefined,
      allowedProtocols: ["https:"],
      allowClass: false,
      allowStyle: false,
      allowId: false,
      allowTitle: true,
      allowLegacyAlign: true,
      dropInvalidIframesOnParse: true,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.src ? { src: attrs.src as string } : {},
      },
      width: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.width ? { width: attrs.width as string } : {},
      },
      height: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.height ? { height: attrs.height as string } : {},
      },
      scrolling: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.scrolling ? { scrolling: attrs.scrolling as string } : {},
      },
      frameborder: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.frameborder ? { frameborder: attrs.frameborder as string } : {},
      },
      id: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.id ? { id: attrs.id as string } : {},
      },
      class: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.class ? { class: attrs.class as string } : {},
      },
      title: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.title ? { title: attrs.title as string } : {},
      },
      style: {
        default: null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.style ? { style: attrs.style as string } : {},
      },
      alignment: {
        default: "unset",

        renderHTML: () => ({}), // handled in renderHTML() below
      },
    };
  },

  parseHTML() {
    const allowedProtocols = this.options.allowedProtocols ?? ["https:"];
    const srcAllowlist = this.options.srcAllowlist;

    const allowClass = !!this.options.allowClass;
    const allowStyle = !!this.options.allowStyle;
    const allowId = !!this.options.allowId;
    const allowTitle = this.options.allowTitle !== false;

    return [
      {
        tag: "iframe",
        getAttrs: (node) => {
          const el = node;
          const src = sanitizeSrc(el.getAttribute("src"), {
            allowedProtocols,
            srcAllowlist,
          });
          // If src is invalid, either drop the node (false) or keep it unparsed (null),
          // depending on your existing option.
          if (!src) {
            return this.options.dropInvalidIframesOnParse === false
              ? null
              : false;
          }
          const alignment = (() => {
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
            if (this.options.allowLegacyAlign !== false) {
              const legacyAlign = el.getAttribute("align");
              if (
                legacyAlign === "left" ||
                legacyAlign === "center" ||
                legacyAlign === "right"
              ) {
                return legacyAlign;
              }
            }
            return parseAlignmentFromStyle(el.getAttribute("style"));
          })();
          return {
            src,
            width: sanitizeDimension(el.getAttribute("width")),
            height: sanitizeDimension(el.getAttribute("height")),
            scrolling: (() => {
              const v = emptyToNull(el.getAttribute("scrolling"));
              return v === "yes" || v === "no" ? v : null;
            })(),
            frameborder: (() => {
              const v =
                el.getAttribute("frameborder") ??
                el.getAttribute("frameBorder");
              return v === "0" || v === "1" ? v : null;
            })(),
            id: allowId ? emptyToNull(el.getAttribute("id")) : null,
            class: allowClass ? sanitizeClass(el.getAttribute("class")) : null,
            style: allowStyle ? sanitizeStyle(el.getAttribute("style")) : null,
            title: allowTitle ? emptyToNull(el.getAttribute("title")) : null,
            alignment,
          } satisfies Partial<IframeAttrs>;
        },
      },

      // Legacy CKEditor 4 iframe wrapper / oEmbed migration.
      // CKEditor stores embeds as:
      //   <div class="embeddedContent ..." data-oembed="..." ...>
      //     <iframe src="//www.youtube.com/embed/..." ...></iframe>
      //   </div>
      // We need to parse the iframe from the div.embeddedContent.
      {
        tag: "div.embeddedContent",
        priority: 1000,
        getAttrs: (node) => {
          const wrapper = node;

          // ProseMirror can still apply attributes defined in the schema (addAttributes())
          // based on the element which tag name matches.
          // So we need to remove the attributes from the div.embeddedContent.
          wrapper.removeAttribute("class");
          wrapper.removeAttribute("id");
          wrapper.removeAttribute("style");
          wrapper.removeAttribute("title");

          const iframe = wrapper.querySelector("iframe");
          if (!iframe) return false;

          // In legacy case, the alignment is stored in the data-align attribute of the div.embeddedContent.
          const dataAlign = wrapper.getAttribute("data-align");
          const alignment: IframeAlignment =
            dataAlign === "left" ||
            dataAlign === "center" ||
            dataAlign === "right"
              ? dataAlign
              : "unset";
          const src = sanitizeSrc(iframe.getAttribute("src"), {
            allowedProtocols,
            srcAllowlist,
          });
          if (!src) {
            return this.options.dropInvalidIframesOnParse === false
              ? null
              : false;
          }
          return {
            src,
            width: sanitizeDimension(iframe.getAttribute("width")),
            height: sanitizeDimension(iframe.getAttribute("height")),
            scrolling: (() => {
              const v = emptyToNull(iframe.getAttribute("scrolling"));
              return v === "yes" || v === "no" ? v : null;
            })(),
            frameborder: (() => {
              const v =
                iframe.getAttribute("frameborder") ??
                iframe.getAttribute("frameBorder");
              return v === "0" || v === "1" ? v : null;
            })(),
            id: allowId ? emptyToNull(iframe.getAttribute("id")) : null,
            class: allowClass
              ? sanitizeClass(iframe.getAttribute("class"))
              : null,
            style: allowStyle
              ? sanitizeStyle(iframe.getAttribute("style"))
              : null,
            title: allowTitle
              ? emptyToNull(iframe.getAttribute("title"))
              : null,
            alignment,
          } satisfies Partial<IframeAttrs>;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const src = emptyToNull(HTMLAttributes.src as string | null);
    const styleRaw = (HTMLAttributes.style as string | null) ?? "";

    const alignment =
      (node.attrs.alignment as IframeAlignment | null) ?? "unset";

    // merge alignment into style. This is because iframe align is deprecated.
    const style = applyAlignToStyle(styleRaw, alignment);

    const attrs: Record<string, unknown> = {
      ...HTMLAttributes,
      src: src ?? undefined,
      style: style ? style : undefined,
    };

    return ["iframe", mergeAttributes(attrs)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframePlaceholder);
  },

  addCommands() {
    const allowedProtocols = this.options.allowedProtocols ?? ["https:"];
    const srcAllowlist = this.options.srcAllowlist;

    const allowClass = !!this.options.allowClass;
    const allowStyle = !!this.options.allowStyle;
    const allowId = !!this.options.allowId;
    const allowTitle = this.options.allowTitle !== false;

    return {
      setIframe:
        (attrs) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;

          const src = sanitizeSrc(attrs.src ?? null, {
            allowedProtocols,
            srcAllowlist,
          });
          if (!src) return false;

          return commands.insertContent({
            type: this.name,
            attrs: {
              src,
              width: sanitizeDimension(attrs.width ?? null),
              height: sanitizeDimension(attrs.height ?? null),
              scrolling: attrs.scrolling ?? null,
              frameborder: attrs.frameborder ?? null,
              id: allowId ? emptyToNull(attrs.id ?? null) : null,
              class: allowClass ? sanitizeClass(attrs.class ?? null) : null,
              style: allowStyle ? sanitizeStyle(attrs.style ?? null) : null,
              title: allowTitle ? emptyToNull(attrs.title ?? null) : null,
              alignment: attrs.alignment ?? "unset",
            },
          });
        },

      updateIframe:
        (attrs) =>
        ({ editor, commands }) => {
          if (!editor.isEditable) return false;
          if (!editor.isActive(this.name)) return false;

          // If src is provided, require it to pass validation
          if (attrs.src !== undefined) {
            const src = sanitizeSrc(attrs.src ?? null, {
              allowedProtocols,
              srcAllowlist,
            });
            if (!src) return false;
            return commands.updateAttributes(this.name, { ...attrs, src });
          }

          const next: Partial<IframeAttrs> = { ...attrs };

          if (attrs.width !== undefined)
            next.width = sanitizeDimension(attrs.width);
          if (attrs.height !== undefined)
            next.height = sanitizeDimension(attrs.height);

          if (attrs.id !== undefined)
            next.id = allowId ? emptyToNull(attrs.id) : null;
          if (attrs.class !== undefined)
            next.class = allowClass ? sanitizeClass(attrs.class) : null;
          if (attrs.style !== undefined)
            next.style = allowStyle ? sanitizeStyle(attrs.style) : null;
          if (attrs.title !== undefined)
            next.title = allowTitle ? emptyToNull(attrs.title) : null;

          return commands.updateAttributes(this.name, next);
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
