import { Extension, Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export type DetailsClasses = {
  details: string;
  summary: string;
  content: string;
};

export type DetailsOptions = {
  classes: DetailsClasses;
  /**
   * If true, new <details> will be inserted with the `open` attribute.
   * @default false
   */
  openByDefault?: boolean;
};

/**
 * DetailsKitOptions is the options for the DetailsKit
 */
export interface DetailsKitOptions extends DetailsOptions {}

declare module "@tiptap/core" {
  /**
   * Commands is the commands for the DetailsExtension
   */
  interface Commands<ReturnType> {
    details: {
      /**
       * Insert a new details block at the current selection.
       */
      insertDetails: (attrs?: {
        summary?: string;
        open?: boolean;
      }) => ReturnType;
      /**
       * Toggle the `open` attribute on the nearest parent details node.
       */
      toggleDetailsOpen: () => ReturnType;
    };
  }
}

/**
 * DetailsKit is the extension for the DetailsKit
 */
export const DetailsKit = Extension.create<DetailsKitOptions>({
  name: "detailsKit",
  addOptions() {
    return {
      classes: {
        details: "details",
        summary: "details__summary",
        content: "details__content",
      },
      openByDefault: false,
    };
  },
  addExtensions() {
    const { classes } = this.options;
    return [
      Details.configure(this.options),
      DetailsSummary.configure({ HTMLAttributes: { class: classes.summary } }),
      DetailsContent.configure({ HTMLAttributes: { class: classes.content } }),
    ];
  },
});

/**
 * DetailsSummary is the node for the DetailsSummary
 */
export const DetailsSummary = Node.create<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
}>({
  name: "detailsSummary",
  group: "block",
  content: "inline*",
  defining: true,
  addOptions() {
    return { HTMLAttributes: {} };
  },
  parseHTML() {
    return [{ tag: "summary" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "summary",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

/**
 * DetailsContent is the node for the DetailsContent
 */
export const DetailsContent = Node.create<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
}>({
  name: "detailsContent",
  group: "block",
  content: "block+",
  defining: true,
  addOptions() {
    return { HTMLAttributes: {} };
  },
  parseHTML() {
    return [{ tag: "div" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

/**
 * <details class="..."><summary ... /><div ... /></details>
 */
export const Details = Node.create<DetailsOptions>({
  name: "details",
  group: "block",
  content: "detailsSummary detailsContent",
  defining: true,
  isolating: true,

  addOptions() {
    return {
      classes: {
        details: "details",
        summary: "details__summary",
        content: "details__content",
      },
      openByDefault: false,
    };
  },

  addAttributes() {
    return {
      open: {
        default: null as null | boolean,
        parseHTML: (el) => (el.hasAttribute("open") ? true : null),
        renderHTML: (attrs) => (attrs.open ? { open: "" } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "details" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { classes } = this.options;
    return [
      "details",
      mergeAttributes(HTMLAttributes, { class: classes.details }),
      0,
    ];
  },

  addCommands() {
    return {
      insertDetails:
        (attrs) =>
        ({ chain }) => {
          const summaryText = attrs?.summary ?? "Yhteenveto";
          const open =
            typeof attrs?.open === "boolean"
              ? attrs.open
              : this.options.openByDefault;

          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { open: open ? true : null },
              content: [
                {
                  type: "detailsSummary",
                  content: [{ type: "text", text: summaryText }],
                },
                {
                  type: "detailsContent",
                  content: [{ type: "paragraph" }],
                },
              ],
            })
            .run();
        },

      toggleDetailsOpen:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const $from = selection.$from;

          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name !== this.name) continue;

            const pos = $from.before(depth);
            const currentOpen = !!node.attrs.open;
            const nextAttrs = {
              ...node.attrs,
              open: currentOpen ? null : true,
            };

            tr = tr.setNodeMarkup(pos, undefined, nextAttrs);

            if (dispatch) dispatch(tr);
            return true;
          }

          return false;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("detailsToggle"),
        props: {
          handleClick: (_view, _pos, event) => {
            const target = event.target as HTMLElement | null;
            if (!target) return false;
            // Only handle clicks on summary inside a details node
            if (target.closest("summary")) {
              // Prevent native DOM toggle; we toggle via document attrs
              event.preventDefault();
              // Use your command (updates attrs + dispatches)
              this.editor.commands.toggleDetailsOpen();
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
