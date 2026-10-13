/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Optional processing context for rules.
 * Core keeps this open; material loaders can pass a richer object later.
 */
export type RichContentProcessingContext = Record<string, any> | undefined;

/**
 * Rule used by HTMLtoReactComponent
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
    context?: RichContentProcessingContext
  ) => any;
  preprocessReactProperties?: (
    tag: string,
    props: {
      key?: number;
      [key: string]: any;
    },
    children: any[],
    element: HTMLElement,
    context?: RichContentProcessingContext
  ) => string | void;
  preprocessElement?: (element: HTMLElement) => string | void;
  id?: string;
}

/**
 * Word definition dataset
 */
export interface WordDefinitionDataset {
  muikkuWordDefinition: string;
}

/**
 * Link dataset
 */
export interface LinkDataset {
  url?: string;
}

/**
 * Image dataset
 */
export interface ImageDataset {
  author: string;
  authorUrl: string;
  license: string;
  licenseUrl: string;
  source: string;
  sourceUrl: string;
  original?: string;
}

/**
 * Iframe dataset
 */
export interface IframeDataset {
  url?: string;
}

/**
 * Source dataset
 */
export interface SourceDataset {
  original?: string;
}

export type StaticDataset =
  | WordDefinitionDataset
  | LinkDataset
  | ImageDataset
  | IframeDataset
  | SourceDataset;

export type MathEngine = "mathlive" | "katex" | "mathjax";
