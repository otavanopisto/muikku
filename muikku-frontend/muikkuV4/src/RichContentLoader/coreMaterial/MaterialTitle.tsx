import { useMaterialContentContext } from "./MaterialContentProvider";

/**
 * Shared material title
 */
export function MaterialTitle() {
  const { material } = useMaterialContentContext();

  if (!material.title) {
    return null;
  }

  return <h1 className="material-page__title">{material.title}</h1>;
}
