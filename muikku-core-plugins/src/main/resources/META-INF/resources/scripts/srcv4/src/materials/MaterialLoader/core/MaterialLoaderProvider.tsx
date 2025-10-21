// srcv4/src/materials/MaterialLoader/core/MaterialLoaderProvider.tsx
import * as React from "react";
import type { MaterialLoaderRenderProps } from "./MaterialLoaderCore";

const MaterialLoaderContext =
  React.createContext<MaterialLoaderRenderProps | null>(null);

/**
 * MaterialLoaderProviderProps type
 */
export interface MaterialLoaderProviderProps {
  value: MaterialLoaderRenderProps;
  children: React.ReactNode;
}

/**
 * MaterialLoaderProvider
 * @param value value
 * @param children children
 * @returns MaterialLoaderProvider
 */
export function MaterialLoaderProvider({
  value,
  children,
}: MaterialLoaderProviderProps) {
  return (
    <MaterialLoaderContext value={value}>{children}</MaterialLoaderContext>
  );
}

/**
 * useMaterialLoaderContext
 * @returns useMaterialLoaderContext
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMaterialLoaderContext() {
  const context = React.use(MaterialLoaderContext);
  if (!context) {
    throw new Error(
      "useMaterialLoaderContext must be used within MaterialLoaderProvider"
    );
  }
  return context;
}
