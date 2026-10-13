import type { ReactNode } from "react";
import type {
  Workspace,
  MaterialLoaderConfig,
  MaterialEditingHandlers,
  MaterialEditingConfig,
} from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { MaterialContentProvider } from "../coreMaterial/MaterialContentProvider";
import { useMaterialsLoader } from "./useMaterialsLoader";

const EMPTY_CONFIG: MaterialLoaderConfig = {};

/**
 * Props for MaterialLoaderCore
 */
export interface MaterialLoaderCoreProps {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  config?: MaterialLoaderConfig;
  editing?: {
    config?: Partial<MaterialEditingConfig>;
    handlers?: MaterialEditingHandlers;
  };
  children: ReactNode;
}

/**
 * Main MaterialLoaderCore component
 * Orchestrates all MaterialLoader functionality and provides context
 */
export function MaterialLoaderCore({
  material,
  workspace,
  compositeReplies,
  assignment,
  config,
  editing,
  children,
}: MaterialLoaderCoreProps) {
  // Use the main hook to get all functionality
  const materialLoaderData = useMaterialsLoader(
    material,
    workspace,
    compositeReplies,
    assignment,
    config ?? EMPTY_CONFIG,
    undefined, // <-- TODO: add updateAssignmentState
    undefined, // <-- TODO: add onAssignmentStateModified
    editing?.config,
    editing?.handlers
  );

  return (
    <MaterialContentProvider value={materialLoaderData}>
      {children}
    </MaterialContentProvider>
  );
}
