import type {
  EnhancedHTMLToReactComponentRule,
  MaterialLoaderConfig,
} from "../core/types";
import type { MaterialContentNode } from "~/generated/client";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { createProcessingRules } from "../core/processors/ProcessingRules";
import { useMemo } from "react";
import MathRenderer from "../components/static/Math";

/**
 * Props for SimpleMaterialLoader
 */
export interface SimpleMaterialLoaderProps {
  html?: string;
  material?: Partial<MaterialContentNode>;
  config?: Partial<MaterialLoaderConfig>;
  mathEngine?: "mathlive" | "katex" | "mathjax";
  modifiers?: string | string[];
  className?: string;
}

/**
 * SimpleMaterialLoader - Replaces ckeditor-loader functionality
 * For basic rich content rendering without assignment features
 * @param html - The HTML to render
 * @param material - The material to render
 * @param mathEngine - The math engine to use
 * @returns The SimpleMaterialLoader
 */
export function SimpleMaterialLoader({
  html,
  material,
  mathEngine,
}: SimpleMaterialLoaderProps) {
  const processingRules = createProcessingRules("simple");

  const modifiedProcessingRules = useMemo(
    () =>
      mathEngine
        ? processingRules.map<EnhancedHTMLToReactComponentRule>((rule) => {
            if (rule.id === "math-rule") {
              return {
                ...rule,
                processingFunction: (
                  _tag,
                  props,
                  children,
                  _element,
                  _context
                ) => (
                  <MathRenderer
                    key={props.key}
                    engine={mathEngine}
                    invisible={false}
                  >
                    {children}
                  </MathRenderer>
                ),
              };
            }
            return rule;
          })
        : processingRules,
    [processingRules, mathEngine]
  );

  const processedContent = useContentProcessor(
    html ?? material?.html ?? null,
    modifiedProcessingRules
  );

  return (
    <div className="material-page__content rich-text">{processedContent}</div>
  );
}
