/* eslint-disable @typescript-eslint/no-unsafe-return */
// srcv4/src/materials/MaterialLoaderV2/core/hooks/useContentProcessor.ts

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
