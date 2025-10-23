// srcv4/src/materials/MaterialLoaderV2/core/MaterialLoaderProvider.tsx

import { createContext, use, type ReactNode } from "react";
import type { MaterialLoaderReturn } from "./types";

const MaterialLoaderContext = createContext<MaterialLoaderReturn | null>(null);

/**
 * Provider for MaterialLoader context
 */
export function MaterialLoaderProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MaterialLoaderReturn;
}) {
  return (
    <MaterialLoaderContext value={value}>{children}</MaterialLoaderContext>
  );
}

/**
 * Hook to use MaterialLoader context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMaterialLoaderContext(): MaterialLoaderReturn {
  const context = use(MaterialLoaderContext);
  if (!context) {
    throw new Error(
      "useMaterialLoaderContext must be used within a MaterialLoaderProvider"
    );
  }
  return context;
}
