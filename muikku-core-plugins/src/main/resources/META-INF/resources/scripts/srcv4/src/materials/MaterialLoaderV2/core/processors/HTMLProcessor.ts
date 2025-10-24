/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// srcv4/src/materials/MaterialLoaderV2/core/processors/HTMLProcessor.ts

import * as React from "react";
import { type ProcessingRuleContext } from "../types";

/**
 * Enhanced HTML to React Component Rule interface
 */
export interface EnhancedHTMLToReactComponentRule {
  shouldProcessHTMLElement: (tag: string, element: HTMLElement) => boolean;
  preventChildProcessing?: boolean;
  processingFunction?: (
    tag: string,
    props: {
      key?: number;
      [key: string]: any;
    },
    children: React.ReactNode[],
    element: HTMLElement,
    context?: ProcessingRuleContext
  ) => any;
  preprocessReactProperties?: (
    tag: string,
    props: {
      key?: number;
      [key: string]: any;
    },
    children: any[],
    element: HTMLElement,
    context?: ProcessingRuleContext
  ) => string | void;
  preprocessElement?: (element: HTMLElement) => string | void;
  id?: string;
}

// Attribute translations from HTML to React props
const translations: Record<string, string> = {
  width: "width",
  class: "className",
  id: "id",
  name: "name",
  src: "src",
  height: "height",
  href: "href",
  target: "target",
  alt: "alt",
  title: "title",
  dir: "dir",
  lang: "lang",
  hreflang: "hrefLang",
  charset: "charSet",
  download: "download",
  rel: "rel",
  type: "type",
  media: "media",
  wrap: "wrap",
  start: "start",
  reversed: "reversed",

  // Iframe specific
  scrolling: "scrolling",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  allow: "allow",
  loading: "loading",

  // Table specific
  cellspacing: "cellSpacing", // Deprecated, Table
  cellpadding: "cellPadding", // Deprecated, Table
  span: "span",
  summary: "summary", // Deprecated, Table
  colspan: "colSpan",
  rowspan: "rowSpan",
  scope: "scope",
  headers: "headers",

  // Audio/video specific
  autoplay: "autoPlay",
  capture: "capture",
  controls: "controls",
  loop: "loop",
  role: "role",
  label: "label",
  default: "default",
  kind: "kind",
  srclang: "srcLang",
  controlsList: "controlsList",

  // Form specific
  required: "required",
  rows: "rows",
  cols: "cols",
  tabindex: "tabIndex",
  hidden: "hidden",
  list: "list",
  value: "value",
  selected: "selected",
  checked: "checked",
  disabled: "disabled",
  readonly: "readOnly",
  size: "size",
  placeholder: "placeholder",
  multiple: "multiple",
  accept: "accept",
};

/**
 * Converts a style property string into a camel case based one
 * this is basically to convert things like text-align into textAlign
 * for use within react
 */
function convertStylePropertyToCamelCase(str: string): string {
  // first we split the dashes
  const splitted = str.startsWith("-") ? [] : str.split("-");

  // if it's just one then we return that just one
  if (splitted.length === 1) {
    return splitted[0];
  }

  // otherwise we do this process of capitalization
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
}

/**
 * CSSStyleDeclarationToObject
 */
export function CSSStyleDeclarationToObject(
  declaration: CSSStyleDeclaration
): any {
  const result: any = {};
  for (let i = 0; i < declaration.length; i++) {
    const item = declaration.item(i);
    result[convertStylePropertyToCamelCase(item)] = (
      declaration as unknown as Record<string, string>
    )[item];
  }
  return result;
}

/**
 * HTMLtoReactComponent - Enhanced version with context support
 * Extracted from modifiers.ts
 */
export function HTMLtoReactComponent(
  element: HTMLElement,
  rules?: EnhancedHTMLToReactComponentRule[],
  key?: number,
  context?: ProcessingRuleContext
): any {
  if (element.nodeType === 3) {
    return element.textContent;
  }

  let tagname = element.tagName.toLowerCase();
  const matchingRule = rules?.find((r) =>
    r.shouldProcessHTMLElement(tagname, element)
  );

  if (matchingRule?.preprocessElement) {
    tagname = matchingRule.preprocessElement(element) ?? tagname;
  }

  /**
   * defaultProcessor
   */
  const defaultProcessor = (tag: string, props: any, children: any[]) =>
    React.createElement(tag, props, children);

  const actualProcessor = matchingRule
    ? matchingRule.processingFunction ?? defaultProcessor
    : defaultProcessor;

  const props: {
    key?: number;
    [key: string]: any;
  } = {
    key,
  };

  Array.from(element.attributes).forEach((attr: Attr) => {
    if (translations[attr.name]) {
      props[translations[attr.name]] = attr.value;
    }
  });

  if (element.style.cssText) {
    props.style = CSSStyleDeclarationToObject(element.style);
  }

  const shouldProcessChildren = matchingRule
    ? !matchingRule.preventChildProcessing
    : true;

  const children = shouldProcessChildren
    ? Array.from(element.childNodes).map((node, index) => {
        if (node instanceof HTMLElement) {
          return HTMLtoReactComponent(node, rules, index, context);
        }
        return node.textContent;
      })
    : [];

  if (matchingRule?.preprocessReactProperties) {
    tagname =
      matchingRule.preprocessReactProperties(
        tagname,
        props,
        children,
        element,
        context
      ) ?? tagname;
  }

  const finalChildren = children.length === 0 ? [] : children;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return actualProcessor(tagname, props, finalChildren, element, context);
}
