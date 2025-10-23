// srcv4/src/materials/MaterialLoaderV2/core/hooks/useAssignmentState.ts

import { useMemo, useCallback } from "react";
import { AssignmentStateManager } from "../state/AssignmentStateManager";
import { type AssignmentStateReturn, type ButtonConfig } from "../types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";

/**
 * Hook for managing assignment state logic
 * Extracted from MaterialLoader component
 */
export function useAssignmentState(
  material: MaterialContentNode,
  compositeReplies?: MaterialCompositeReply
): AssignmentStateReturn {
  const currentState = compositeReplies?.state ?? "UNANSWERED";

  const stateConfig = useMemo(
    () =>
      AssignmentStateManager.getStateConfiguration(
        material.assignmentType ?? "",
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

    return {
      className: stateConfig.buttonClass ?? "",
      text: stateConfig.buttonText ?? "",
      disabled: stateConfig.buttonDisabled ?? false,
      successState: stateConfig.successState,
      successText: stateConfig.successText,
    };
  }, [stateConfig]);

  /**
   * handleStateTransition
   * @param newState newState
   */
  const handleStateTransition = useCallback(
    (newState: string) => {
      // This will be implemented in Phase 3 when we add API integration
      // eslint-disable-next-line no-console
      console.log(`Transitioning from ${currentState} to ${newState}`);
    },
    [currentState]
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
