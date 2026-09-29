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
 * - HTML preprocessing (HTMLPreprocessor) — only when `html` changes
 * - Applying processing rules (HTMLtoReactComponent)
 *
 * Does not own:
 * - Which rules to use (caller passes them)
 * - Assignment/answer/field state (optional context)
 *
 * Invariant: jQuery preprocess is gated on html identity (V3 Base behavior).
 * React conversion may still re-run when `context` changes until Fix 2.
 */
export function useContentProcessor(
  html: string | null,
  processingRules: EnhancedHTMLToReactComponentRule[],
  context?: RichContentProcessingContext
): React.ReactNode[] {
  // A) Preprocess only when HTML changes
  const preprocessedElements = useMemo(() => {
    if (!html) return [] as HTMLElement[];
    const $html = $(html);
    return HTMLPreprocessor.preprocess($html).toArray();
  }, [html]);
  // B) Convert cached elements → React
  return useMemo(
    () =>
      preprocessedElements.map((element, index) =>
        HTMLtoReactComponent(element, processingRules, index, context)
      ),
    [preprocessedElements, processingRules, context]
  );
}
