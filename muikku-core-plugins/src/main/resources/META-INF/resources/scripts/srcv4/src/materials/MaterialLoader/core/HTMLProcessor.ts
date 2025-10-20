/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// srcv4/src/materials/MaterialLoader/core/HTMLProcessor.ts
import * as React from "react";

/**
 * ProcessingRule
 */
export interface ProcessingRule {
  matches: (element: HTMLElement) => boolean;
  process: (
    element: HTMLElement,
    context: ProcessingContext
  ) => React.ReactNode;
  preventChildProcessing?: boolean;
  preprocessElement?: (element: HTMLElement) => HTMLElement;
}

/**
 * ProcessingContext
 */
export interface ProcessingContext {
  processingRules: ProcessingRule[];
  fieldManager?: any; // We'll type this properly later
  path?: string;
  invisible?: boolean;
  key?: number;
}

/**
 * HTMLProcessor
 */
export class HTMLProcessor {
  private rules: ProcessingRule[];
  private context: ProcessingContext;

  /**
   * constructor
   * @param rules - rules
   * @param context - context
   */
  constructor(
    rules: ProcessingRule[],
    context: ProcessingContext = { processingRules: rules }
  ) {
    this.rules = rules;
    this.context = context;
  }

  /**
   * process
   * @param html - html
   */
  process(html: string): React.ReactNode[] {
    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Preprocess HTML
    this.preprocess(doc);

    // Convert to React elements
    return Array.from(doc.body.children).map((element, index) =>
      this.processElement(element as HTMLElement, index)
    );
  }

  /**
   * processElement
   * @param element - element
   * @param index - index
   */
  private processElement(element: HTMLElement, index: number): React.ReactNode {
    const rule = this.findMatchingRule(element);

    if (rule) {
      return rule.process(element, { ...this.context, key: index });
    }

    // Default processing
    return this.defaultProcess(element, index);
  }

  /**
   * findMatchingRule
   * @param element - element
   */
  private findMatchingRule(element: HTMLElement): ProcessingRule | null {
    return this.rules.find((rule) => rule.matches(element)) ?? null;
  }

  /**
   * preprocess
   * @param doc - doc
   */
  private preprocess(doc: Document): void {
    // Image preprocessing
    doc.querySelectorAll("img").forEach((img) => {
      if (img.parentElement?.tagName !== "FIGURE") {
        const wrapper = doc.createElement("span");
        wrapper.className = "image";
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }

      const src = img.getAttribute("src");
      if (src) {
        img.dataset.original = src;
        img.removeAttribute("src");
      }
    });

    // Audio preprocessing
    doc.querySelectorAll("audio").forEach((audio) => {
      audio.setAttribute("preload", "metadata");
    });

    // Source preprocessing
    doc.querySelectorAll("source").forEach((source) => {
      const src = source.getAttribute("src");
      if (src) {
        source.dataset.original = src;
        source.removeAttribute("src");
      }
    });

    // Table preprocessing
    doc.querySelectorAll("table").forEach((table) => {
      if (
        !table.parentElement?.classList.contains("material-page__table-wrapper")
      ) {
        const wrapper = doc.createElement("div");
        wrapper.className = "material-page__table-wrapper";
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // Remove old style images wrapped in links
    doc.querySelectorAll("a figure").forEach((figure) => {
      const link = figure.parentElement;
      if (link?.tagName === "A") {
        link.parentNode?.insertBefore(figure, link);
        link.remove();
      }
    });
  }

  /**
   * defaultProcess
   * @param element - element
   * @param index - index
   */
  private defaultProcess(element: HTMLElement, index: number): React.ReactNode {
    const tagName = element.tagName.toLowerCase();
    const props: any = { key: index };

    // Convert attributes
    Array.from(element.attributes).forEach((attr) => {
      props[attr.name] = attr.value;
    });

    // Convert styles
    if (element.style.cssText) {
      props.style = this.convertStyles(element.style);
    }

    // Process children
    const children = Array.from(element.childNodes).map((node, childIndex) => {
      if (node instanceof HTMLElement) {
        return this.processElement(node, childIndex);
      }
      return node.textContent;
    });

    return React.createElement(tagName, props, children);
  }

  /**
   * convertStyles
   * @param style - style
   * @returns
   */
  private convertStyles(style: CSSStyleDeclaration): React.CSSProperties {
    const result: any = {};
    for (let i = 0; i < style.length; i++) {
      const property = style.item(i);
      const camelCaseProperty = this.toCamelCase(property);

      result[camelCaseProperty] = style[property as keyof CSSStyleDeclaration];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  /**
   * toCamelCase
   * @param str - str
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
}
