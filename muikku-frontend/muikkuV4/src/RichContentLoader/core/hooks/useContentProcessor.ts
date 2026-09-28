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
 * Converts material/simple HTML into React nodes.
 *
 * Owns:
 * - HTML preprocessing (HTMLPreprocessor)
 * - Applying the given processing rules (HTMLtoReactComponent)
 *
 * Does not own:
 * - Which rules to use (caller passes them)
 * - Assignment/answer/field state (passed in via optional context)
 *
 * @param html - Raw HTML string, or null
 * @param processingRules - Rule package for this loader
 * @param context - Optional processing context (material loaders pass MaterialProcessingContext)
 * @returns Array of React nodes for rendering
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
