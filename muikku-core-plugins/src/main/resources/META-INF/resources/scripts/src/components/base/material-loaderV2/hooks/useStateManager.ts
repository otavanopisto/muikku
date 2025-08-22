import * as React from "react";
import { useCallback, useMemo } from "react";
import { MaterialCompositeReplyStateType } from "~/generated/client";
import { StateConfig, DataProvider } from "../types";
import { findStateConfig } from "../state/StateConfig";

/**
 * Hook for managing assignment state logic
 * Replaces the StateManager class with React hooks
 * @param dataProvider data provider
 * @param readOnly read only
 * @returns StateManager
 */
export function useStateManager(
  dataProvider: DataProvider,
  readOnly: boolean = false
) {
  const currentState = dataProvider.currentState;
  const assignmentType = dataProvider.assignmentType;

  // Current state configuration
  const currentConfig = useMemo(
    (): StateConfig | undefined =>
      findStateConfig(assignmentType, currentState),
    [assignmentType, currentState]
  );

  // Simple computed values - use useMemo
  const canEdit = useMemo(
    (): boolean => currentConfig?.behavior.canModify ?? false,
    [currentConfig]
  );

  const canSubmit = useMemo((): boolean => {
    if (readOnly) return false;
    return (
      currentConfig?.button.action !== "none" && !currentConfig?.button.disabled
    );
  }, [readOnly, currentConfig]);

  const shouldCheckAnswers = useMemo(
    (): boolean => currentConfig?.behavior.checksAnswers ?? false,
    [currentConfig]
  );

  /**
   * Check if current state should show answers
   */
  const shouldShowAnswers = useMemo(
    (): boolean =>
      currentConfig?.behavior.displaysHideShowAnswersButton ?? false,
    [currentConfig]
  );

  /**
   * Check if fields should be read-only
   */
  const areFieldsReadOnly = useMemo(
    (): boolean => currentConfig?.behavior.fieldsReadOnly ?? false,
    [currentConfig]
  );

  /**
   * Get button configuration for current state
   */
  const buttonConfig = useMemo(
    (): StateConfig["button"] | undefined => currentConfig?.button,
    [currentConfig]
  );

  /**
   * Get available actions for current state
   */
  const availableActions = useMemo((): string[] => {
    const config = currentConfig;
    const actions: string[] = [];

    if (config?.button.action && config.button.action !== "none") {
      actions.push(config.button.action);
    }

    if (config?.transitions.modifyState) {
      actions.push("modify");
    }

    return actions;
  }, [currentConfig]);

  // Only use useCallback for methods that need parameters or conditional execution
  const canPerformAction = useCallback(
    (action: string): boolean => currentConfig?.button.action === action,
    [currentConfig]
  );

  /**
   * Get next state for an action
   */
  const getNextState = useCallback(
    (action: string): MaterialCompositeReplyStateType | undefined => {
      const config = currentConfig;

      if (
        action === "submit" ||
        action === "save" ||
        action === "update" ||
        action === "cancel" ||
        action === "withdraw"
      ) {
        return config?.transitions.successState;
      }

      if (action === "modify") {
        return config?.transitions.modifyState;
      }

      return undefined;
    },
    [currentConfig]
  );

  /**
   * Check if state transition is valid
   */
  const canTransitionTo = useCallback(
    (newState: MaterialCompositeReplyStateType): boolean => {
      const nextState = getNextState("submit");
      return nextState === newState;
    },
    [getNextState]
  );

  /**
   * Get success text for current state (if any)
   */
  const getSuccessText = useCallback(
    (): string | undefined => currentConfig?.transitions.successText,
    [currentConfig]
  );

  return React.useMemo(
    () => ({
      // Simple values
      currentConfig,
      currentState,
      assignmentType,
      readOnly,
      canEdit,
      canSubmit,
      shouldCheckAnswers,
      shouldShowAnswers,
      areFieldsReadOnly,
      buttonConfig,
      availableActions,

      // Methods (only where needed)
      canPerformAction,
      getNextState,
      canTransitionTo,
      getSuccessText,

      // Simple computed values
      isHidden: dataProvider.material.hidden,
      isContentHiddenForUser: dataProvider.material.contentHiddenForUser,
      materialLanguage:
        dataProvider.material.titleLanguage || dataProvider.workspace.language,
      hasAIContent: !!dataProvider.material.ai,
    }),
    [
      areFieldsReadOnly,
      assignmentType,
      availableActions,
      buttonConfig,
      canEdit,
      canPerformAction,
      canSubmit,
      canTransitionTo,
      currentConfig,
      currentState,
      dataProvider.material.ai,
      dataProvider.material.contentHiddenForUser,
      dataProvider.material.hidden,
      dataProvider.material.titleLanguage,
      dataProvider.workspace.language,
      getNextState,
      getSuccessText,
      readOnly,
      shouldCheckAnswers,
      shouldShowAnswers,
    ]
  );
}
