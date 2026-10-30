import { createContext, use } from "react";

export type WorkspaceContentPanelMode = "drawer" | "overlay" | "docked";

/**
 * Controls for the workspace content layout (TOC + optional aside).
 */
export interface WorkspaceContentLayoutContextValue {
  panelMode: WorkspaceContentPanelMode;
  tocOpened: boolean;
  asideOpened: boolean;
  hasAside: boolean;
  openToc: () => void;
  closeToc: () => void;
  toggleToc: () => void;
  openAside: () => void;
  closeAside: () => void;
  toggleAside: () => void;
}

const WorkspaceContentLayoutContext =
  createContext<WorkspaceContentLayoutContextValue | null>(null);

export const WorkspaceContentLayoutProvider =
  WorkspaceContentLayoutContext.Provider;

/**
 * Access TOC/aside controls from nested content.
 * Must be used under WorkspaceContentLayout.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspaceContentLayout() {
  const value = use(WorkspaceContentLayoutContext);

  if (!value) {
    throw new Error(
      "useWorkspaceContentLayout must be used within WorkspaceContentLayout"
    );
  }

  return value;
}
