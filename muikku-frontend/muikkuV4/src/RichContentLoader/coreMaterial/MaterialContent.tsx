import { useMaterialContentContext } from "./MaterialContentProvider";
import "./rich-text.css";

/**
 * Shared processed rich content
 */
export function MaterialContent() {
  const { processedContent } = useMaterialContentContext();

  return (
    <div className="material-page__content rich-text">{processedContent}</div>
  );
}
