/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import type {
  EnhancedHTMLToReactComponentRule,
  RichContentProcessingContext,
} from "../types";

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
  scrolling: "scrolling",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  allow: "allow",
  loading: "loading",
  cellspacing: "cellSpacing",
  cellpadding: "cellPadding",
  span: "span",
  summary: "summary",
  colspan: "colSpan",
  rowspan: "rowSpan",
  scope: "scope",
  headers: "headers",
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
 * Convert a CSS style property to camel case
 * @param str - The CSS style property to convert
 * @returns The camel case string
 */
function convertStylePropertyToCamelCase(str: string): string {
  const splitted = str.startsWith("-") ? [] : str.split("-");
  if (splitted.length === 1) {
    return splitted[0];
  }
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
}

/**
 * Convert a CSS style declaration to an object
 * @param declaration - The CSS style declaration to convert
 * @returns The object
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
 * HTML to React component converter
 * @param element - The HTML element to convert
 * @param rules - The rules to use for conversion
 * @param key - The key to use for the component
 * @param context - The context to use for the conversion
 * @returns The React component
 */
export function HTMLtoReactComponent(
  element: HTMLElement,
  rules?: EnhancedHTMLToReactComponentRule[],
  key?: number,
  context?: RichContentProcessingContext
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

  const defaultProcessor = (tag: string, props: any, children: any[]) =>
    children.length > 0
      ? React.createElement(tag, props, children)
      : React.createElement(tag, props);

  const actualProcessor = matchingRule
    ? (matchingRule.processingFunction ?? defaultProcessor)
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
