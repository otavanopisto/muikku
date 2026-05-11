import { Link } from "@tiptap/extension-link";
import { Plugin } from "@tiptap/pm/state";

/**
 * Fired when the user double-clicks a link in the editor so the settings modal can open.
 * Listeners should call `setOpen(true)` (or equivalent).
 */
export const OPEN_MUIKKU_LINK_SETTINGS_MODAL_EVENT =
  "muikku:open-link-settings-modal-event" as const;

export type MuikkuLinkAttrs = {
  href: string | null;
  target: string | null;
  rel: string | null;

  // CKEditor-like extra attrs
  id: string | null;
  dir: string | null;
  accesskey: string | null;
  tabindex: string | null;
  title: string | null;
  class: string | null;
  style: string | null;
  download: string | null; // set to "" to force download, or filename
};

export type InsertMuikkuLinkPayload = { text: string } & MuikkuLinkAttrs;

declare module "@tiptap/core" {
  /**
   * Commands interface for the Muikku link extension.
   */
  interface Commands<ReturnType> {
    muikkuLink: {
      /**
       * Sets/updates a link with Muikku attributes.
       * Requires href (string).
       */
      setMuikkuLink: (attributes: MuikkuLinkAttrs) => ReturnType;
      /**
       * Inserts a link with Muikku attributes.
       * Requires href (string).
       */
      insertMuikkuLink: (payload: InsertMuikkuLinkPayload) => ReturnType;
      /**
       * Unsets link mark at selection (extends mark range).
       */
      unsetMuikkuLink: () => ReturnType;
    };
  }
}

/**
 * MuikkuLinkExtension is the extension for the Muikku link.
 */
export const MuikkuLinkExtension = Link.extend({
  name: "link",

  addCommands() {
    return {
      ...this.parent?.(),
      // Sets link mark at selection (extends mark range).
      setMuikkuLink:
        (attributes: MuikkuLinkAttrs) =>
        ({ chain }) =>
          chain()
            .focus()
            .extendMarkRange("link")
            // use generic setMark so extra attrs are always accepted
            .setMark("link", attributes)
            .run(),
      // Inserts a link with Muikku attributes without extending mark range.
      insertMuikkuLink:
        (payload: InsertMuikkuLinkPayload) =>
        ({ chain }) => {
          const { text, ...markAttrs } = payload;
          const label = text.trim();
          const href = (markAttrs.href ?? "").trim();
          if (!label || !href) return false;
          return chain()
            .focus()
            .insertContent({
              type: "text",
              text: label,
              marks: [
                {
                  type: "link",
                  attrs: markAttrs,
                },
              ],
            })
            .run();
        },
      // Unsets link mark at selection (extends mark range).
      unsetMuikkuLink:
        () =>
        ({ chain }) =>
          chain().focus().extendMarkRange("link").unsetMark("link").run(),
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),

      // Ensure these exist so UI can read/write them deterministically.
      target: {
        default: null,
        parseHTML: (element) => element.getAttribute("target"),
        renderHTML: (attributes) =>
          attributes.target ? { target: attributes.target as string } : {},
      },
      rel: {
        default: null,
        parseHTML: (element) => element.getAttribute("rel"),
        renderHTML: (attributes) =>
          attributes.rel ? { rel: attributes.rel as string } : {},
      },

      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) =>
          attributes.id ? { id: attributes.id as string } : {},
      },
      dir: {
        default: null,
        parseHTML: (element) => element.getAttribute("dir"),
        renderHTML: (attributes) =>
          attributes.dir ? { dir: attributes.dir as string } : {},
      },
      accesskey: {
        default: null,
        parseHTML: (element) => element.getAttribute("accesskey"),
        renderHTML: (attributes) =>
          attributes.accesskey
            ? { accesskey: attributes.accesskey as string }
            : {},
      },
      tabindex: {
        default: null,
        parseHTML: (element) => element.getAttribute("tabindex"),
        renderHTML: (attributes) =>
          attributes.tabindex
            ? { tabindex: attributes.tabindex as string }
            : {},
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) =>
          attributes.title ? { title: attributes.title as string } : {},
      },
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) =>
          attributes.class ? { class: attributes.class as string } : {},
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) =>
          attributes.style ? { style: attributes.style as string } : {},
      },
      download: {
        default: null,
        parseHTML: (element) => element.getAttribute("download"),
        renderHTML: (attributes) =>
          attributes.download !== null && attributes.download !== undefined
            ? { download: attributes.download as string }
            : {},
      },
    };
  },

  // Add prose mirror plugin to handle double-click events.
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            dblclick: (_view, event) => {
              if (!editor?.isEditable) return false;
              const e = event;
              const coords = editor.view.posAtCoords({
                left: e.clientX,
                top: e.clientY,
              });
              if (!coords) return false;
              const $pos = editor.state.doc.resolve(coords.pos);
              const linkType = editor.schema.marks.link;
              if (!linkType?.isInSet($pos.marks())) return false;
              e.preventDefault();
              editor
                .chain()
                .focus()
                .setTextSelection(coords.pos)
                .extendMarkRange("link")
                .run();
              window.dispatchEvent(
                new Event(OPEN_MUIKKU_LINK_SETTINGS_MODAL_EVENT)
              );
              return true;
            },
          },
        },
      }),
    ];
  },
});
