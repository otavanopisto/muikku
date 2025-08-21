import {
  MaterialAssigmentType,
  MaterialCompositeReplyStateType,
} from "~/generated/client";
import { StateConfig, DataProvider } from "../types";
import { findStateConfig } from "./StateConfig";

/**
 * StateManager handles all state logic and transitions
 * Replaces the complex state logic from the current MaterialLoader
 */
export class StateManager {
  private currentState: MaterialCompositeReplyStateType;
  private assignmentType: MaterialAssigmentType;
  private stateConfigs: StateConfig[];
  private dataProvider: DataProvider;
  private readOnly: boolean;

  /**
   * Constructor
   * @param dataProvider data provider
   * @param stateConfigs state configurations
   * @param readOnly read only
   */
  constructor(
    dataProvider: DataProvider,
    stateConfigs: StateConfig[],
    readOnly: boolean
  ) {
    this.dataProvider = dataProvider;
    this.stateConfigs = stateConfigs;
    this.currentState = dataProvider.currentState;
    this.assignmentType = dataProvider.assignmentType;
    this.readOnly = readOnly;
  }

  /**
   * Get current state configuration
   */
  getCurrentConfig(): StateConfig | undefined {
    return findStateConfig(this.assignmentType, this.currentState);
  }

  /**
   * Get current state
   */
  getCurrentState(): MaterialCompositeReplyStateType {
    return this.currentState;
  }

  /**
   * Get assignment type
   */
  getAssignmentType(): MaterialAssigmentType {
    return this.assignmentType;
  }

  /**
   * Get read only
   */
  isReadOnly(): boolean {
    return this.readOnly;
  }

  /**
   * Check if current state allows editing
   */
  canEdit(): boolean {
    const config = this.getCurrentConfig();
    return config?.behavior.canModify ?? false;
  }

  /**
   * Check if current state allows submitting
   */
  canSubmit(): boolean {
    if (this.readOnly) {
      return false;
    }

    const config = this.getCurrentConfig();
    return (
      config?.button.action !== "none" &&
      !config?.button.disabled &&
      !this.readOnly
    );
  }

  /**
   * Check if current state should check answers
   */
  shouldCheckAnswers(): boolean {
    const config = this.getCurrentConfig();
    return config?.behavior.checksAnswers ?? false;
  }

  /**
   * Check if current state should show answers
   */
  shouldShowAnswers(): boolean {
    const config = this.getCurrentConfig();
    return config?.behavior.displaysHideShowAnswersButton ?? false;
  }

  /**
   * Check if fields should be read-only
   */
  areFieldsReadOnly(): boolean {
    const config = this.getCurrentConfig();
    return config?.behavior.fieldsReadOnly ?? false;
  }

  /**
   * Get button configuration for current state
   */
  getButtonConfig() {
    const config = this.getCurrentConfig();
    return config?.button;
  }

  /**
   * Get available actions for current state
   */
  getAvailableActions(): string[] {
    const config = this.getCurrentConfig();
    const actions: string[] = [];

    if (config?.button.action && config.button.action !== "none") {
      actions.push(config.button.action);
    }

    if (config?.transitions.modifyState) {
      actions.push("modify");
    }

    return actions;
  }

  /**
   * Check if action is available
   * @param action action
   * @returns true if action is available
   */
  canPerformAction(action: string): boolean {
    return this.getAvailableActions().includes(action);
  }

  /**
   * Get next state for an action
   * @param action action
   * @returns next state
   */
  getNextState(action: string): MaterialCompositeReplyStateType | undefined {
    const config = this.getCurrentConfig();

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
  }

  /**
   * Check if state transition is valid
   * @param newState new state
   * @returns true if state transition is valid
   */
  canTransitionTo(newState: MaterialCompositeReplyStateType): boolean {
    const nextState = this.getNextState("submit");
    return nextState === newState;
  }

  /**
   * Update current state (called when state changes externally)
   * @param newState new state
   */
  updateState(newState: MaterialCompositeReplyStateType): void {
    this.currentState = newState;
  }

  /**
   * Get success text for current state (if any)
   */
  getSuccessText(): string | undefined {
    const config = this.getCurrentConfig();
    return config?.transitions.successText;
  }

  /**
   * Check if material is hidden
   */
  isHidden(): boolean {
    return this.dataProvider.material.hidden;
  }

  /**
   * Check if content is hidden for user
   */
  isContentHiddenForUser(): boolean {
    return this.dataProvider.material.contentHiddenForUser;
  }

  /**
   * Get material language
   */
  getMaterialLanguage(): string {
    return (
      this.dataProvider.material.titleLanguage ||
      this.dataProvider.workspace.language
    );
  }

  /**
   * Check if material has AI content
   */
  hasAIContent(): boolean {
    return !!this.dataProvider.material.ai;
  }
}

/**
 * Hook for using StateManager in React components
 * @param dataProvider data provider
 * @param stateConfigs state configurations
 * @param readOnly read only
 * @returns StateManager
 */
export function useStateManager(
  dataProvider: DataProvider,
  stateConfigs: StateConfig[],
  readOnly: boolean = false
): StateManager {
  return new StateManager(dataProvider, stateConfigs, readOnly);
}
