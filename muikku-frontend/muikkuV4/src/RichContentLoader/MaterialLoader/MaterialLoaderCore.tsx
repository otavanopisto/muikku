import type { ReactNode } from "react";
import type { Workspace, MaterialLoaderConfig } from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { MaterialContentProvider } from "../coreMaterial/MaterialContentProvider";
import { useMaterialsLoader } from "./useMaterialsLoader";

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
  // eslint-disable-next-line react-x/no-unstable-default-props
  config = {},
  onModification,
  children,
}: MaterialLoaderCoreProps) {
  // Use the main hook to get all functionality
  const materialLoaderData = useMaterialsLoader(
    material,
    workspace,
    compositeReplies,
    assignment,
    config,
    onModification
  );

  return (
    <MaterialContentProvider value={materialLoaderData}>
      {children}
    </MaterialContentProvider>
  );
}
