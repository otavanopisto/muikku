import type { ReactNode } from "react";
import type { AnyExtension } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";

/**
 * Feature flag: off, on with defaults, or on with options.
 */
export type Feature<TOptions = true> = false | true | TOptions;

/**
 * Allowed text-align values.
 */
export type AlignType = "left" | "center" | "right" | "justify";

/**
 * Heading feature options.
 */
export interface HeadingFeatureOptions {
  levels?: Level[];
}

/**
 * List feature options. Task lists are not wired yet.
 */
export interface ListFeatureOptions {
  types?: ("bulletList" | "orderedList")[];
}

/**
 * Text-align feature options.
 */
export interface AlignFeatureOptions {
  types?: AlignType[];
}

/**
 * Indent feature options.
 */
export interface IndentFeatureOptions {
  stepPx?: number;
}

/**
 * Table feature options.
 */
export interface TableFeatureOptions {
  resizable?: boolean;
}

/**
 * Image feature options.
 */
export interface ImageFeatureOptions {
  inline?: boolean;
  allowBase64?: boolean;
}

/**
 * Editor capabilities. Omitted keys use MuikkuEditor defaults.
 * `false` removes schema, toolbar, and bubble menus together.
 */
export interface MuikkuEditorFeatures {
  history?: Feature;
  bold?: Feature;
  italic?: Feature;
  underline?: Feature;
  strike?: Feature;
  heading?: Feature<HeadingFeatureOptions>;
  list?: Feature<ListFeatureOptions>;
  blockquote?: Feature;
  link?: Feature;
  highlight?: Feature;
  textColor?: Feature;
  align?: Feature<AlignFeatureOptions>;
  indent?: Feature<IndentFeatureOptions>;
  table?: Feature<TableFeatureOptions>;
  image?: Feature<ImageFeatureOptions>;
  math?: Feature;
  specialChar?: Feature;
}

/**
 * Features after merging caller config onto defaults.
 */
export type ResolvedMuikkuEditorFeatures = {
  [K in keyof Required<MuikkuEditorFeatures>]: Exclude<
    Required<MuikkuEditorFeatures>[K],
    undefined
  >;
};

/**
 * Toolbar group ids. Render order is fixed in the factory.
 */
export type ToolbarGroupId =
  | "history"
  | "blocks"
  | "marks"
  | "align"
  | "indent"
  | "insert";

/**
 * Limits forwarded to CharAndWordLimitExtension.
 */
export interface MuikkuEditorCharacterCount {
  characterLimit?: number | null;
  wordLimit?: number | null;
  textCounter?: (text: string) => number;
  wordCounter?: (text: string) => number;
}

/**
 * Projected editor parts produced from resolved features.
 */
export interface MuikkuEditorParts {
  extensions: AnyExtension[];
  toolbar: ReactNode;
  renderBubbleMenus: (editor: Editor) => ReactNode;
}
