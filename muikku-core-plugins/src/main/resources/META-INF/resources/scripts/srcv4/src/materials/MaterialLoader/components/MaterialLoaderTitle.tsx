import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialTitleProps type
 */
interface MaterialLoaderTitleProps {
  className?: string;
}

/**
 * MaterialTitle
 * @param children children
 * @param className className
 * @returns MaterialTitle
 */
export function MaterialLoaderTitle({ className }: MaterialLoaderTitleProps) {
  const { material, config } = useMaterialLoaderContext();

  if (!config.layoutConfig?.showTitle) {
    return null;
  }

  return (
    <h2 className={`material-page__title ${className ?? ""}`}>
      {material.title}
    </h2>
  );
}
