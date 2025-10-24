// srcv4/src/materials/MaterialLoaderV2/core/MaterialLoaderCore.tsx

import type { ReactNode } from "react";
import type { Workspace, MaterialLoaderConfig } from "./types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { useMaterialLoader } from "./hooks/useMaterialLoader";
import { MaterialLoaderProvider } from "./MaterialLoaderProvider";

/**
 * Props for MaterialLoaderCore
 */
export interface MaterialLoaderCoreProps {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  config?: MaterialLoaderConfig;
  onModification?: () => void;
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
  config = {},
  onModification,
  children,
}: MaterialLoaderCoreProps) {
  // Use the main hook to get all functionality
  const materialLoaderData = useMaterialLoader(
    material,
    workspace,
    compositeReplies,
    assignment,
    config,
    onModification
  );

  return (
    <MaterialLoaderProvider value={materialLoaderData}>
      {children}
    </MaterialLoaderProvider>
  );
}
