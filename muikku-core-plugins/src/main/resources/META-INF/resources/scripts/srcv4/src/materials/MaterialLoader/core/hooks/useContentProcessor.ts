// srcv4/src/materials/MaterialLoader/core/hooks/useContentProcessor.ts
import { useMemo } from "react";
import { HTMLProcessor } from "../processors/HTMLProcessor";
import { type ProcessingRule } from "../processors/HTMLProcessor";
import { defaultProcessingRules } from "../processors/ProcessingRules";

/**
 * useContentProcessor
 * @param html html
 * @param processingRules processingRules
 */
export function useContentProcessor(
  html?: string,
  processingRules: ProcessingRule[] = defaultProcessingRules
) {
  return useMemo(() => {
    if (!html) return null;

    const processor = new HTMLProcessor(processingRules);
    return processor.process(html);
  }, [html, processingRules]);
}
