// srcv4/src/materials/MaterialLoader/components/MaterialContent.tsx
import * as React from "react";
import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialContentProps type
 */
interface MaterialLoaderContentProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * MaterialContent
 * @param className className
 * @returns MaterialContent
 */
export function MaterialLoaderContent({
  className,
}: MaterialLoaderContentProps) {
  const { processedContent, config } = useMaterialLoaderContext();

  if (!config.layoutConfig?.showContent) {
    return null;
  }

  return (
    <div className={`material-page__content rich-text ${className ?? ""}`}>
      {processedContent}
    </div>
  );
}
