import type { ReactNode } from "react";
import type { Workspace, MaterialLoaderConfig } from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { MaterialContentProvider } from "../coreMaterial/MaterialContentProvider";
import { useEvaluationMaterialsLoader } from "./useEvaluationLoader";

/**
 * Props for MaterialLoaderCore
 */
export interface EvaluationMaterialLoaderCoreProps {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  config?: MaterialLoaderConfig;
  children: ReactNode;
}

/**
 * Main EvaluationMaterialLoaderCore component
 * Orchestrates all MaterialLoader functionality and provides context
 */
export function EvaluationMaterialLoaderCore({
  material,
  workspace,
  compositeReplies,
  assignment,
  // eslint-disable-next-line react-x/no-unstable-default-props
  config = {},
  children,
}: EvaluationMaterialLoaderCoreProps) {
  // Use the main hook to get all functionality
  const materialLoaderData = useEvaluationMaterialsLoader(
    material,
    workspace,
    compositeReplies,
    assignment,
    config
  );

  return (
    <MaterialContentProvider value={materialLoaderData}>
      {children}
    </MaterialContentProvider>
  );
}
