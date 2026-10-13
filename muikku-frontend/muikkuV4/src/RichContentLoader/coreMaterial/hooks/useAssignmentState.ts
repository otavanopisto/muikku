/* eslint-disable no-console */
import { useMemo, useCallback } from "react";
import { AssignmentStateManager } from "../state/AssignmentStateManager";
import {
  type AssignmentStateReturn,
  type ButtonConfig,
  type Workspace,
} from "../types";
import type {
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialContentNode,
} from "~/generated/client";

/**
 * Derives assignment/exercise reply UI state from composite reply + AssignmentStateManager.
 *
 * Owns:
 * - Resolving stateConfig for current assignmentType + reply state
 * - Derived readOnly / answerable (including lock)
 * - Button config for submit/withdraw/etc.
 * - handleStateTransition → calls updateAssignmentState (typically with server update)
 *
 * Does not own:
 * - Local-only transitions on field edit/sync (orchestrator: handleModification / handleAnswerSynced)
 * - Answer correctness registry (useAnswerManager)
 * - Websocket field saves (useFieldManager)
 * - Persisting state (injected updateAssignmentState)
 *
 * @param material - Material content node
 * @param compositeReplies - Current composite reply, if any
 * @param updateAssignmentState - App-provided updater (Redux/API adapter)
 * @param onAssignmentStateModified - Callback to call when the assignment state is modified
 * @returns Array of React nodes for rendering
 */
export function useAssignmentState(
  workspace: Workspace,
  material: MaterialContentNode,
  compositeReplies?: MaterialCompositeReply,
  updateAssignmentState?: (
    newState: MaterialCompositeReplyStateType,
    localOnly: boolean,
    workspaceId: number,
    workspaceMaterialId: number,
    successText?: string,
    callback?: () => void
  ) => void,
  onAssignmentStateModified?: () => void
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
   * @param newState - newState
   */
  const handleStateTransition = useCallback(
    (newState: MaterialCompositeReplyStateType) => {
      if (!stateConfig) {
        console.error("No state configuration available for transition");
        return;
      }

      // Update assignment state locally
      if (updateAssignmentState) {
        updateAssignmentState(
          newState,
          false, // localOnly = false (update server)
          workspace.id,
          material.workspaceMaterialId ?? 0,
          stateConfig.successText,
          onAssignmentStateModified
        );
      }
    },
    [
      stateConfig,
      updateAssignmentState,
      workspace.id,
      material.workspaceMaterialId,
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
