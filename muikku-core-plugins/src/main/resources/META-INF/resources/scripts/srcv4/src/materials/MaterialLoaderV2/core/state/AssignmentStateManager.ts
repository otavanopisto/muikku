import type {
  MaterialAssigmentType,
  MaterialCompositeReplyStateType,
} from "~/generated/client";
import type { AssignmentStateConfig } from "../types";

/**
 * AssignmentStateManager - Manages assignment state configurations
 * Extracted from the original STATES array in MaterialLoader
 */
export class AssignmentStateManager {
  private static readonly STATES: AssignmentStateConfig[] = [
    {
      assignmentType: "EXERCISE",
      //usually exercises cannot be withdrawn but they might be in extreme cases when a evaluated has
      //been modified
      states: ["UNANSWERED", "ANSWERED", "WITHDRAWN"],

      //when an exercise is in the state unanswered answered or withdrawn then it doesn't
      //display this button
      displaysHideShowAnswersOnRequestButtonIfAllowed: false,
      buttonClass: "muikku-submit-exercise",

      //This is what by default appears on the button
      buttonText: "actions.send_exercise",

      //Buttons are not disabled
      buttonDisabled: false,

      //When the button is pressed, the composite reply will change state to this one
      successState: "SUBMITTED",

      //Whether or not the fields are read only
      fieldsReadOnly: false,
    },
    {
      assignmentType: "EXERCISE",
      states: ["SUBMITTED"],

      //With this property active whenever in this state the answers will be checked
      checksAnswers: true,
      displaysHideShowAnswersOnRequestButtonIfAllowed: true,
      buttonClass: "muikku-submit-exercise",
      buttonText: "actions.cancel_exercise",
      buttonDisabled: false,
      successState: "ANSWERED",
      //This is for when the fields are modified, the exercise rolls back to be answered rather than submitted
      modifyState: "ANSWERED",
    },
    {
      assignmentType: "EXERCISE",
      states: ["PASSED", "FAILED", "INCOMPLETE"],

      //With this property active whenever in this state the answers will be checked
      checksAnswers: true,
      displaysHideShowAnswersOnRequestButtonIfAllowed: true,
      buttonClass: "muikku-submit-exercise",
      buttonText: "actions.sent",
      buttonDisabled: false,

      //This is for when the fields are modified, the exercise rolls back to be answered rather than submitted
      modifyState: "ANSWERED",
    },
    {
      assignmentType: "EVALUATED",
      states: ["UNANSWERED", "ANSWERED"],
      buttonClass: "muikku-submit-assignment",
      buttonText: "actions.send_assignment",
      //Represents a message that will be shown once the state changes to the success state
      successText: "notifications.assignmentSubmitted",
      buttonDisabled: false,
      successState: "SUBMITTED",
      fieldsReadOnly: false,
    },
    {
      assignmentType: "EVALUATED",
      states: "SUBMITTED",
      buttonClass: "muikku-withdraw-assignment",
      buttonText: "actions.cancel_assignment",
      successText: "notifications.assignmentWithdrawn",
      buttonDisabled: false,
      successState: "WITHDRAWN",
      fieldsReadOnly: true,
    },
    {
      assignmentType: "EVALUATED",
      states: ["FAILED"],
      buttonClass: "muikku-withdraw-assignment",
      buttonText: "actions.cancel_assignment",
      successText: "notifications.assignmentWithdrawn",
      buttonDisabled: true,
      fieldsReadOnly: true,
    },
    {
      assignmentType: "EVALUATED",
      states: ["INCOMPLETE"],
      buttonClass: "muikku-withdraw-assignment",
      buttonText: "actions.cancel_assignment",
      successText: "notifications.assignmentWithdrawn",
      buttonDisabled: false,
      successState: "WITHDRAWN",
      fieldsReadOnly: true,
    },
    {
      assignmentType: "EVALUATED",
      states: "WITHDRAWN",
      buttonClass: "muikku-update-assignment",
      buttonText: "actions.update",
      successText: "notifications.assignmentUpdated",
      buttonDisabled: false,
      successState: "SUBMITTED",
      fieldsReadOnly: false,
    },
    {
      assignmentType: "EVALUATED",
      states: "PASSED",
      buttonClass: "muikku-evaluated-assignment",
      buttonText: "actions.evaluated",
      buttonDisabled: true,
      fieldsReadOnly: true,
    },
    {
      assignmentType: "JOURNAL",
      states: ["UNANSWERED", "ANSWERED"],
      buttonClass: "muikku-submit-journal",
      buttonText: "actions.save",
      successState: "SUBMITTED",
      buttonDisabled: false,
      fieldsReadOnly: false,
    },
    {
      assignmentType: "JOURNAL",
      states: "SUBMITTED",
      buttonClass: "muikku-submit-journal",
      buttonText: "actions.edit",
      successState: "ANSWERED",
      buttonDisabled: false,
      fieldsReadOnly: true,
    },
    {
      assignmentType: "INTERIM_EVALUATION",
      states: ["UNANSWERED", "ANSWERED"],
      buttonClass: "muikku-submit-interim-evaluation",
      buttonText: "actions.send_interimEvaluationRequest",
      successState: "SUBMITTED",
      buttonDisabled: false,
      fieldsReadOnly: false,
    },
    {
      assignmentType: "INTERIM_EVALUATION",
      states: "SUBMITTED",
      buttonClass: "muikku-submit-interim-evaluation",
      buttonText: "actions.cancel_interimEvaluationRequest",
      successState: "ANSWERED",
      buttonDisabled: false,
      fieldsReadOnly: true,
    },
    {
      assignmentType: "INTERIM_EVALUATION",
      states: "PASSED",
      buttonClass: "muikku-evaluated-assignment",
      buttonText: "actions.evaluated",
      buttonDisabled: true,
      fieldsReadOnly: true,
    },
  ];

  /**
   * Get state configuration for a specific assignment type and current state
   * @param assignmentType - The assignment type to get the state configuration for
   * @param currentState - The current state
   * @returns The state configuration
   */
  static getStateConfiguration(
    assignmentType: MaterialAssigmentType | null,
    currentState: MaterialCompositeReplyStateType
  ): AssignmentStateConfig | null {
    return (
      this.STATES.find(
        (config) =>
          config.assignmentType === assignmentType &&
          (config.states === currentState ||
            (Array.isArray(config.states) &&
              config.states.includes(currentState)))
      ) ?? null
    );
  }

  /**
   * Get all available states for an assignment type
   * @param assignmentType - The assignment type to get the available states for
   * @returns The available states
   */
  static getAvailableStates(
    assignmentType: MaterialAssigmentType | null
  ): MaterialCompositeReplyStateType[] {
    return this.STATES.filter(
      (config) => config.assignmentType === assignmentType
    ).flatMap((config) =>
      Array.isArray(config.states) ? config.states : [config.states]
    );
  }

  /**
   * Check if a state transition is valid
   * @param assignmentType - The assignment type to check the transition for
   * @param _fromState - The current state
   * @param toState - The state to transition to
   * @returns True if the transition is valid, false otherwise
   */
  static isValidTransition(
    assignmentType: MaterialAssigmentType | null,
    _fromState: MaterialCompositeReplyStateType,
    toState: MaterialCompositeReplyStateType
  ): boolean {
    const availableStates = this.getAvailableStates(assignmentType);
    return availableStates.includes(toState);
  }
}
