// srcv4/src/materials/MaterialLoaderV2/components/MaterialLoaderContent.tsx

import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialLoaderContent component
 * Displays the processed material content
 */
export function MaterialLoaderContent() {
  const { processedContent } = useMaterialLoaderContext();

  return (
    <div className="material-page__content rich-text">{processedContent}</div>
  );
}
