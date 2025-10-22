/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// srcv4/src/materials/MaterialLoaderV2/core/hooks/useContentProcessor.ts

import { useMemo } from "react";
import $ from "jquery";
import { HTMLtoReactComponent } from "../processors/HTMLProcessor";
import { HTMLPreprocessor } from "../processors/HTMLPreprocessor";
import { createProcessingRules } from "../processors/ProcessingRules";
import type { ProcessingRuleContext } from "../types";

/**
 * Hook for processing HTML content into React components
 * Combines HTML preprocessing, processing rules, and React conversion
 */
export function useContentProcessor(
  html: string,
  context: ProcessingRuleContext
): React.ReactNode[] {
  return useMemo(() => {
    if (!html) return [];

    // Preprocess HTML with jQuery (preserve existing logic)
    const $html = $(html);
    const preprocessedElements = HTMLPreprocessor.preprocess(
      $html
    ).toArray() as HTMLElement[];

    // Get processing rules
    const processingRules = createProcessingRules();

    // Convert to React components
    return preprocessedElements.map((element, index) =>
      HTMLtoReactComponent(element, processingRules, index, context)
    );
  }, [html, context]);
}
