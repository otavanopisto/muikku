import { createContext, use, type ReactNode } from "react";
import type { MaterialContentLoaderValue } from "./types";

const MaterialContentContext = createContext<MaterialContentLoaderValue | null>(
  null
);

/**
 * Shared provider for MaterialLoader and EvaluationMaterialLoader chrome
 */
export function MaterialContentProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MaterialContentLoaderValue;
}) {
  return (
    <MaterialContentContext value={value}>{children}</MaterialContentContext>
  );
}

/**
 * Hook to read shared material content loader context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMaterialContentContext(): MaterialContentLoaderValue {
  const context = use(MaterialContentContext);
  if (!context) {
    throw new Error(
      "useMaterialContentContext must be used within a MaterialContentProvider"
    );
  }
  return context;
}
