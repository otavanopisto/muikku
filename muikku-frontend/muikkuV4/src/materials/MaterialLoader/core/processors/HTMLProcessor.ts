/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  type EnhancedHTMLToReactComponentRule,
  type ProcessingRuleContext,
} from "../types";

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
 * @param str - The string to convert
 * @returns The converted string
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
 * @param declaration - The CSSStyleDeclaration to convert
 * @returns The converted object
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
 * @param element - The element to convert to a React component
 * @param rules - The rules to use for the conversion
 * @param key - The key to use for the conversion
 * @param context - The context to use for the conversion
 * @returns The converted React component
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
   * @param tag - The tag to convert to a React component
   * @param props - The props to use for the conversion
   * @param children - The children to use for the conversion
   * @returns The converted React component
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
