import type { MaterialLoaderConfig } from "../core/types";
import type { MaterialContentNode } from "~/generated/client";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { createProcessingRules } from "../core/processors/ProcessingRules";

/**
 * Props for SimpleMaterialLoader
 */
export interface SimpleMaterialLoaderProps {
  html?: string;
  material?: Partial<MaterialContentNode>;
  config?: Partial<MaterialLoaderConfig>;
  modifiers?: string | string[];
  className?: string;
}

/**
 * SimpleMaterialLoader - Replaces ckeditor-loader functionality
 * For basic rich content rendering without assignment features
 */
export function SimpleMaterialLoader({
  html,
  material,
}: SimpleMaterialLoaderProps) {
  const processingRules = createProcessingRules("simple");
  const processedContent = useContentProcessor(
    html ?? material?.html ?? null,
    processingRules
  );

  return (
    <div className="material-page__content rich-text">{processedContent}</div>
  );
}
