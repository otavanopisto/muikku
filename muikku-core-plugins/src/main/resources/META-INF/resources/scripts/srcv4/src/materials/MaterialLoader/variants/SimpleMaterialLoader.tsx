// srcv4/src/materials/MaterialLoader/variants/SimpleMaterialLoader.tsx
import * as React from "react";
import { useMemo } from "react";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { type ProcessingRule } from "../core/HTMLProcessor";
import { defaultProcessingRules } from "../processors/ProcessingRules";

/**
 * SimpleMaterialLoaderProps
 */
interface SimpleMaterialLoaderProps {
  html?: string;
  material?: { html: string; title?: string };
  processingRules?: ProcessingRule[];
  modifiers?: string | string[];
  children?: (props: { processedContent: React.ReactNode }) => React.ReactNode;
}

/**
 *
 * @param param0
 * @returns
 */
export function SimpleMaterialLoader(props: SimpleMaterialLoaderProps) {
  const {
    html,
    material,
    processingRules = defaultProcessingRules,
    modifiers,
    children,
  } = props;

  const contentToProcess = html ?? material?.html;
  const processedContent = useContentProcessor(
    contentToProcess,
    processingRules
  );

  console.log("processedContent", processedContent);

  /* const className = useMemo(() => {
    const baseClass = "rich-text";
    const modifierClasses = modifiers
      ? Array.isArray(modifiers)
        ? modifiers.map((m) => `material-page--${m}`).join(" ")
        : `material-page--${modifiers}`
      : "";
    return `${baseClass} ${modifierClasses}`.trim();
  }, [modifiers]); */

  /* if (children) {
    return <>{children({ processedContent })}</>;
  } */

  return (
    <div className="material-page__content rich-text">{processedContent}</div>
  );
}
