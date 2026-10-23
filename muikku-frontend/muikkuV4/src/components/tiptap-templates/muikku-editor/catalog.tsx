import type { AnyExtension } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import type { StarterKitOptions } from "@tiptap/starter-kit";
import type { Level } from "@tiptap/extension-heading";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { TextColorPopover } from "@/components/tiptap-ui/text-color-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { TableBubbleMenu } from "@/components/tiptap-ui/table-bubble-menu";
import TablePopover from "@/components/tiptap-ui/table-popover/table-popover";
import { MuikkuLinkExtension } from "@/components/tiptap-extension-custom/muikku-link";
import { MuikkuLinkButton } from "@/components/tiptap-extension-custom/muikku-link";
import { MathEquation } from "@/components/tiptap-extension-custom/math-equations";
import { MathEquationButton } from "@/components/tiptap-extension-custom/math-equations";
import { IndentExtension } from "@/components/tiptap-extension-custom/indent";
import { IndentButton } from "@/components/tiptap-extension-custom/indent";
import { SpecialCharButton } from "@/components/tiptap-extension-custom/special-char";
import type {
  AlignFeatureOptions,
  HeadingFeatureOptions,
  ImageFeatureOptions,
  IndentFeatureOptions,
  ListFeatureOptions,
  MuikkuEditorFeatures,
  TableFeatureOptions,
  ToolbarGroupId,
} from "./types";

/**
 * Default heading levels for student rich editing.
 */
const DEFAULT_HEADING_LEVELS: Level[] = [1, 2, 3, 4];

/**
 * Default list types for student rich editing.
 */
const DEFAULT_LIST_TYPES: ("bulletList" | "orderedList")[] = [
  "bulletList",
  "orderedList",
];

/**
 * Default alignments for student rich editing.
 */
const DEFAULT_ALIGN_TYPES: AlignFeatureOptions["types"] = [
  "left",
  "center",
  "right",
];

/**
 * CKEditor 4 math spans stored as `<span class="math-tex">`.
 */
const LEGACY_MATH_RULES = [
  {
    tag: "span.math-tex",
    getAttrsLegacy: (el: HTMLElement) => {
      const raw = ((el.textContent ?? "") || (el.innerHTML ?? "")).trim();
      return { latex: raw };
    },
  },
];

/**
 * One catalog row: schema + toolbar + optional bubble menu.
 */
export interface CatalogEntry {
  starterKitKeys?: (keyof StarterKitOptions)[];
  starterKit?: (options: object) => Partial<StarterKitOptions>;
  extensions?: (options: object) => AnyExtension[];
  toolbar?: {
    group: ToolbarGroupId;
    render: (options: object) => React.ReactNode;
  };
  bubbleMenu?: (editor: Editor, options: object) => React.ReactNode;
}

/**
 * Insertion order is toolbar order within a group.
 */
export const FEATURE_NAMES = [
  "history",
  "heading",
  "list",
  "blockquote",
  "bold",
  "italic",
  "underline",
  "strike",
  "highlight",
  "textColor",
  "link",
  "align",
  "indent",
  "math",
  "table",
  "specialChar",
  "image",
] as const satisfies readonly (keyof MuikkuEditorFeatures)[];

/**
 * Single map from feature name to Tiptap + UI.
 */
export const FEATURE_CATALOG: Record<keyof MuikkuEditorFeatures, CatalogEntry> =
  {
    history: {
      starterKitKeys: ["undoRedo"],
      toolbar: {
        group: "history",
        render: () => (
          <>
            <UndoRedoButton action="undo" />
            <UndoRedoButton action="redo" />
          </>
        ),
      },
    },
    heading: {
      starterKitKeys: ["heading"],
      starterKit: (options) => {
        const { levels } = options as HeadingFeatureOptions;
        return { heading: { levels: levels ?? DEFAULT_HEADING_LEVELS } };
      },
      toolbar: {
        group: "blocks",
        render: (options) => {
          const { levels } = options as HeadingFeatureOptions;
          return (
            <HeadingDropdownMenu
              modal={false}
              levels={levels ?? DEFAULT_HEADING_LEVELS}
            />
          );
        },
      },
    },
    list: {
      starterKitKeys: ["bulletList", "orderedList", "listItem", "listKeymap"],
      starterKit: (options) => {
        const { types } = options as ListFeatureOptions;
        const enabled = types ?? DEFAULT_LIST_TYPES;
        const hasBullet = enabled.includes("bulletList");
        const hasOrdered = enabled.includes("orderedList");
        return {
          bulletList: hasBullet ? {} : false,
          orderedList: hasOrdered ? {} : false,
          listItem: hasBullet || hasOrdered ? {} : false,
          listKeymap: hasBullet || hasOrdered ? {} : false,
        };
      },
      toolbar: {
        group: "blocks",
        render: (options) => {
          const { types } = options as ListFeatureOptions;
          return (
            <ListDropdownMenu
              modal={false}
              types={types ?? DEFAULT_LIST_TYPES}
            />
          );
        },
      },
    },
    blockquote: {
      starterKitKeys: ["blockquote"],
      toolbar: {
        group: "blocks",
        render: () => <BlockquoteButton />,
      },
    },
    bold: {
      starterKitKeys: ["bold"],
      toolbar: {
        group: "marks",
        render: () => <MarkButton type="bold" />,
      },
    },
    italic: {
      starterKitKeys: ["italic"],
      toolbar: {
        group: "marks",
        render: () => <MarkButton type="italic" />,
      },
    },
    underline: {
      starterKitKeys: ["underline"],
      toolbar: {
        group: "marks",
        render: () => <MarkButton type="underline" />,
      },
    },
    strike: {
      starterKitKeys: ["strike"],
      toolbar: {
        group: "marks",
        render: () => <MarkButton type="strike" />,
      },
    },
    highlight: {
      extensions: () => [Highlight.configure({ multicolor: true })],
      toolbar: {
        group: "marks",
        render: () => <ColorHighlightPopover />,
      },
    },
    textColor: {
      extensions: () => [TextStyleKit],
      toolbar: {
        group: "marks",
        render: () => <TextColorPopover />,
      },
    },
    link: {
      starterKitKeys: ["link"],
      starterKit: () => ({ link: false }),
      extensions: () => [
        MuikkuLinkExtension.configure({
          openOnClick: false,
          enableClickSelection: true,
        }),
      ],
      toolbar: {
        group: "marks",
        render: () => <MuikkuLinkButton />,
      },
    },
    align: {
      extensions: (options) => {
        const { types } = options as AlignFeatureOptions;
        return [
          TextAlign.configure({
            types: ["heading", "paragraph"],
            alignments: types ?? DEFAULT_ALIGN_TYPES,
          }),
        ];
      },
      toolbar: {
        group: "align",
        render: (options) => {
          const { types } = options as AlignFeatureOptions;
          const aligns = types ?? DEFAULT_ALIGN_TYPES;
          return (
            <>
              {aligns.map((align) => (
                <TextAlignButton key={align} align={align} />
              ))}
            </>
          );
        },
      },
    },
    indent: {
      extensions: (options) => {
        const { stepPx } = options as IndentFeatureOptions;
        return [IndentExtension.configure({ stepPx: stepPx ?? 40 })];
      },
      toolbar: {
        group: "indent",
        render: () => (
          <>
            <IndentButton action="increase" />
            <IndentButton action="decrease" />
          </>
        ),
      },
    },
    math: {
      extensions: () => [
        MathEquation.configure({ legacyMathRules: LEGACY_MATH_RULES }),
      ],
      toolbar: {
        group: "insert",
        render: () => <MathEquationButton />,
      },
    },
    table: {
      extensions: (options) => {
        const { resizable } = options as TableFeatureOptions;
        return [
          TableKit.configure({ table: { resizable: resizable ?? true } }),
        ];
      },
      toolbar: {
        group: "insert",
        render: () => <TablePopover />,
      },
      bubbleMenu: (editor) => <TableBubbleMenu editor={editor} />,
    },
    specialChar: {
      toolbar: {
        group: "insert",
        render: () => <SpecialCharButton />,
      },
    },
    image: {
      extensions: (options) => {
        const { inline, allowBase64 } = options as ImageFeatureOptions;
        return [
          Image.configure({
            inline: inline ?? true,
            allowBase64: allowBase64 ?? true,
          }),
        ];
      },
    },
  };
