import { useMaterialContentContext } from "./MaterialContentProvider";

/**
 * Shared processed rich content
 */
export function MaterialContent() {
  const { processedContent } = useMaterialContentContext();

  return (
    <div className="material-page__content rich-text">{processedContent}</div>
  );
}
