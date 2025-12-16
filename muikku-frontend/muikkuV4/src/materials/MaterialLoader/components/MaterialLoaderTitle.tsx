import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialLoaderTitle component
 * Displays the material title
 */
export function MaterialLoaderTitle() {
  const { material } = useMaterialLoaderContext();

  if (!material.title) {
    return null;
  }

  return <h1 className="material-page__title">{material.title}</h1>;
}
