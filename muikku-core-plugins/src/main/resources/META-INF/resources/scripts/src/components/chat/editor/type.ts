import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type ParagraphElement = { type: "paragraph"; children: CustomText[] };
export type CodeElement = { type: "code"; children: CustomText[] };
export type QuoteElement = { type: "quote"; children: CustomText[] };
export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

type CustomElement =
  | ParagraphElement
  | CodeElement
  | QuoteElement
  | MentionElement;

type FormatedText = {
  text: string;
  bold?: true;
  italic?: true;
  strikeThrough?: true;
};

type CustomText = FormatedText;

declare module "slate" {
  /**
   * The interface for our custom element.
   */
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
