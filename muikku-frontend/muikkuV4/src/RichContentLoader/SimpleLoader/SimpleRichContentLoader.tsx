import { useMemo } from "react";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { createSimpleRules } from "./simpleRules";
import type { MathEngine } from "../core/types";

/**
 * SimpleRichContentLoaderProps
 */
export interface SimpleRichContentLoaderProps {
  html?: string | null;
  mathEngine?: MathEngine;
  className?: string;
}

/**
 * Renders rich HTML with the simple rule set (math, image, link).
 * No material/assignment features.
 */
export function SimpleRichContentLoader({
  html,
  mathEngine = "mathjax",
  className = "rich-text",
}: SimpleRichContentLoaderProps) {
  const processingRules = useMemo(
    () => createSimpleRules(mathEngine),
    [mathEngine]
  );

  const processedContent = useContentProcessor(html ?? null, processingRules);

  return <div className={className}>{processedContent}</div>;
}
