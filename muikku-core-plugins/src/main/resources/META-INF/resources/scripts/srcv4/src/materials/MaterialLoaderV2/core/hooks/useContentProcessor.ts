/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useMemo } from "react";
import $ from "jquery";
import { HTMLtoReactComponent } from "../processors/HTMLProcessor";
import { HTMLPreprocessor } from "../processors/HTMLPreprocessor";
import type {
  EnhancedHTMLToReactComponentRule,
  ProcessingRuleContext,
} from "../types";

/**
 * Hook for processing HTML content into React components
 * Combines HTML preprocessing, processing rules, and React conversion
 * @param html - The HTML content to process
 * @param processingRules - The processing rules to apply
 * @param context - The context to use for processing
 * @returns The processed content as React components
 */
export function useContentProcessor(
  html: string | null,
  processingRules: EnhancedHTMLToReactComponentRule[],
  context?: ProcessingRuleContext
): React.ReactNode[] {
  return useMemo(() => {
    if (!html) return [];

    // Preprocess HTML with jQuery (preserve existing logic)
    const $html = $(html);
    const preprocessedElements = HTMLPreprocessor.preprocess($html).toArray();

    // Convert to React components
    return preprocessedElements.map((element, index) =>
      HTMLtoReactComponent(element, processingRules, index, context)
    );
  }, [html, processingRules, context]);
}
