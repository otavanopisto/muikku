import { useCallback, type ReactNode } from "react";
import type {
  Workspace,
  MaterialLoaderConfig,
  MaterialEditingHandlers,
  MaterialEditingConfig,
} from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { MaterialContentProvider } from "../coreMaterial/MaterialContentProvider";
import { useMaterialsLoader } from "./useMaterialsLoader";
import { useAtomValue, useSetAtom } from "jotai";
import {
  patchCompositeReplyAtom,
  updateWorkspaceAssignmentStateAtom,
} from "~/src/atoms/workspaceContent";
import { userAtom } from "~/src/atoms/auth";

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
  const user = useAtomValue(userAtom);

  const updateAssignmentStateAtom = useSetAtom(
    updateWorkspaceAssignmentStateAtom
  );
  const patchReply = useSetAtom(patchCompositeReplyAtom);

  /**
   * Update the assignment state
   */
  const updateAssignmentState = useCallback(
    (
      newState: MaterialCompositeReplyStateType,
      localOnly: boolean,
      workspaceId: number,
      workspaceMaterialId: number,
      successText?: string,
      callback?: () => void
    ) => {
      void updateAssignmentStateAtom({
        newState,
        localOnly,
        workspaceId,
        workspaceMaterialId,
        successText,
        callback,
      });
    },
    [updateAssignmentStateAtom]
  );

  /**
   * On field answer saved
   */
  const onFieldAnswerSaved = useCallback(
    (fieldName: string, value: string) => {
      if (material.workspaceMaterialId == null) return;
      patchReply({
        workspaceMaterialId: material.workspaceMaterialId,
        answer: { fieldName, value },
      });
    },
    [material.workspaceMaterialId, patchReply]
  );

  // Use the main hook to get all functionality
  const materialLoaderData = useMaterialsLoader(
    material,
    workspace,
    compositeReplies,
    assignment,
    config ?? EMPTY_CONFIG,
    updateAssignmentState,
    undefined, // <-- TODO: add onAssignmentStateModified
    editing?.config,
    editing?.handlers,
    user?.id,
    onFieldAnswerSaved
  );

  return (
    <MaterialContentProvider value={materialLoaderData}>
      {children}
    </MaterialContentProvider>
  );
}
