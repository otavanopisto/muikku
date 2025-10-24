/* eslint-disable no-console */
// srcv4/src/materials/MaterialLoaderV2/core/hooks/useAssignmentState.ts

import { useMemo, useCallback } from "react";
import { AssignmentStateManager } from "../state/AssignmentStateManager";
import { type AssignmentStateReturn, type ButtonConfig } from "../types";
import type {
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialContentNode,
} from "~/generated/client";

/**
 * Hook for managing assignment state logic
 * Extracted from MaterialLoader component
 */
export function useAssignmentState(
  material: MaterialContentNode,
  compositeReplies?: MaterialCompositeReply,
  onAssignmentStateModified?: () => void,
  updateAssignmentState?: (
    newState: MaterialCompositeReplyStateType,
    localOnly: boolean,
    workspaceId: number,
    workspaceMaterialId: number,
    workspaceMaterialReplyId?: number,
    successText?: string,
    callback?: () => void
  ) => void
): AssignmentStateReturn {
  const currentState = compositeReplies?.state ?? "UNANSWERED";

  const stateConfig = useMemo(
    () =>
      AssignmentStateManager.getStateConfiguration(
        material.assignmentType,
        currentState
      ),
    [material.assignmentType, currentState]
  );

  const readOnly = useMemo(() => {
    if (compositeReplies?.lock !== "NONE") return true;
    return stateConfig?.fieldsReadOnly ?? false;
  }, [compositeReplies?.lock, stateConfig]);

  const answerable = useMemo(() => {
    if (compositeReplies?.lock !== "NONE") return false;
    return material.assignmentType !== null;
  }, [compositeReplies?.lock, material.assignmentType]);

  const buttonConfig = useMemo((): ButtonConfig | null => {
    if (!stateConfig) return null;

    const displaysHideShowAnswersOnRequestButtonIfAllowed =
      stateConfig.displaysHideShowAnswersOnRequestButtonIfAllowed &&
      material.correctAnswers === "ON_REQUEST";

    return {
      className: stateConfig.buttonClass ?? "",
      text: stateConfig.buttonText ?? "",
      disabled: stateConfig.buttonDisabled ?? false,
      successState: stateConfig.successState,
      successText: stateConfig.successText,
      displaysHideShowAnswersOnRequestButtonIfAllowed,
    };
  }, [material.correctAnswers, stateConfig]);

  /**
   * Handle state transition with full API integration
   */
  const handleStateTransition = useCallback(
    (newState: MaterialCompositeReplyStateType) => {
      if (!stateConfig) {
        console.error("No state configuration available for transition");
        return;
      }

      // Validate transition
      /* if (
        !AssignmentStateManager.isValidTransition(
          material.assignmentType,
          currentState,
          newState
        )
      ) {
        console.error(`Invalid transition from ${currentState} to ${newState}`);
        return;
      } */

      // If we have an updateAssignmentState function, use it
      if (updateAssignmentState) {
        updateAssignmentState(
          newState,
          false, // localOnly = false (update server)
          0, // This should come from workspace prop
          material.workspaceMaterialId ?? 0,
          compositeReplies?.workspaceMaterialReplyId,
          stateConfig.successText,
          onAssignmentStateModified
        );
      }
    },
    [
      stateConfig,
      updateAssignmentState,
      material.workspaceMaterialId,
      compositeReplies?.workspaceMaterialReplyId,
      onAssignmentStateModified,
    ]
  );

  return {
    currentState,
    stateConfig,
    readOnly,
    answerable,
    buttonConfig,
    handleStateTransition,
  };
}
