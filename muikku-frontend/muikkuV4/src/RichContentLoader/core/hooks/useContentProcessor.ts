/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useMemo } from "react";
import $ from "jquery";
import { HTMLtoReactComponent } from "../processors/HTMLProcessor";
import { HTMLPreprocessor } from "../processors/HTMLPreprocessor";
import type {
  EnhancedHTMLToReactComponentRule,
  RichContentProcessingContext,
} from "../types";

/**
 * Processes HTML into React nodes using the given rule set
 * Combines HTML preprocessing, processing rules, and React conversion
 * @param html - The HTML content to process
 * @param processingRules - The processing rules to apply
 * @param context - The context to use for processing
 * @returns The processed content as React components
 */
export function useContentProcessor(
  html: string | null,
  processingRules: EnhancedHTMLToReactComponentRule[],
  context?: RichContentProcessingContext
): React.ReactNode[] {
  return useMemo(() => {
    if (!html) return [];

    // Preprocess HTML with jQuery (preserve existing logic)
    const $html = $(html);
    const preprocessedElements = HTMLPreprocessor.preprocess($html).toArray();

    return preprocessedElements.map((element, index) =>
      HTMLtoReactComponent(element, processingRules, index, context)
    );
  }, [html, processingRules, context]);
}
