import { createContext, use } from "react";
import type { ContentProductionKind } from "./kinds";

/**
 * Context value for the content production layout.
 */
export interface ContentProductionLayoutContextValue {
  onClose: () => void;
  kind: ContentProductionKind | null;
}

const ContentProductionLayoutContext =
  createContext<ContentProductionLayoutContextValue | null>(null);

export const ContentProductionLayoutProvider =
  ContentProductionLayoutContext.Provider;

/**
 * Access production layout context from header / kind pages.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useContentProductionLayout() {
  const value = use(ContentProductionLayoutContext);
  if (!value) {
    throw new Error(
      "useContentProductionLayout must be used within ContentProductionLayout"
    );
  }
  return value;
}
