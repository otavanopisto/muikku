import {
  MaterialAssigmentType,
  MaterialCompositeReplyStateType,
} from "~/generated/client";
import { StateConfig } from "../types";

/**
 * Cleaned up state configuration (replaces the complex STATES array)
 * Groups states by behavior instead of duplicating logic
 */
export const STATE_CONFIGS: StateConfig[] = [
  // EXERCISE - States where user can answer and submit
  {
    assignmentType: "EXERCISE",
    states: ["UNANSWERED", "ANSWERED", "WITHDRAWN"],
    button: {
      className: "muikku-submit-exercise",
      text: "actions.send_exercise",
      disabled: false,
      action: "submit",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: false,
      canModify: true,
    },
    transitions: {
      successState: "SUBMITTED",
    },
  },

  // EXERCISE - Submitted state (can review and modify)
  {
    assignmentType: "EXERCISE",
    states: ["SUBMITTED"],
    button: {
      className: "muikku-submit-exercise",
      text: "actions.cancel_exercise",
      disabled: false,
      action: "cancel",
    },
    behavior: {
      checksAnswers: true,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: true,
      canModify: true,
    },
    transitions: {
      successState: "ANSWERED",
      modifyState: "ANSWERED",
    },
  },

  // EXERCISE - Final evaluated states
  {
    assignmentType: "EXERCISE",
    states: ["PASSED", "FAILED", "INCOMPLETE"],
    button: {
      className: "muikku-submit-exercise",
      text: "actions.sent",
      disabled: false,
      action: "none",
    },
    behavior: {
      checksAnswers: true,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: true,
      canModify: true,
    },
    transitions: {
      successState: "ANSWERED",
      modifyState: "ANSWERED",
    },
  },

  // EVALUATED - States where user can submit assignment
  {
    assignmentType: "EVALUATED",
    states: ["UNANSWERED", "ANSWERED"],
    button: {
      className: "muikku-submit-assignment",
      text: "actions.send_assignment",
      disabled: false,
      action: "submit",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: false,
      canModify: true,
    },
    transitions: {
      successState: "SUBMITTED",
      successText: "notifications.assignmentSubmitted",
    },
  },

  // EVALUATED - Submitted state
  {
    assignmentType: "EVALUATED",
    states: ["SUBMITTED"],
    button: {
      className: "muikku-withdraw-assignment",
      text: "actions.cancel_assignment",
      disabled: false,
      action: "withdraw",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "WITHDRAWN",
      successText: "notifications.assignmentWithdrawn",
    },
  },

  // EVALUATED - Failed state
  {
    assignmentType: "EVALUATED",
    states: ["FAILED"],
    button: {
      className: "muikku-withdraw-assignment",
      text: "actions.cancel_assignment",
      disabled: true,
      action: "none",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "WITHDRAWN",
      successText: "notifications.assignmentWithdrawn",
    },
  },

  // EVALUATED - Incomplete state
  {
    assignmentType: "EVALUATED",
    states: ["INCOMPLETE"],
    button: {
      className: "muikku-withdraw-assignment",
      text: "actions.cancel_assignment",
      disabled: false,
      action: "withdraw",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "WITHDRAWN",
      successText: "notifications.assignmentWithdrawn",
    },
  },

  // EVALUATED - Withdrawn state
  {
    assignmentType: "EVALUATED",
    states: ["WITHDRAWN"],
    button: {
      className: "muikku-update-assignment",
      text: "actions.update",
      disabled: false,
      action: "update",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: false,
      canModify: true,
    },
    transitions: {
      successState: "SUBMITTED",
      successText: "notifications.assignmentUpdated",
    },
  },

  // EVALUATED - Passed state
  {
    assignmentType: "EVALUATED",
    states: ["PASSED"],
    button: {
      className: "muikku-evaluated-assignment",
      text: "actions.evaluated",
      disabled: true,
      action: "none",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "SUBMITTED",
    },
  },

  // JOURNAL - Editable states
  {
    assignmentType: "JOURNAL",
    states: ["UNANSWERED", "ANSWERED"],
    button: {
      className: "muikku-submit-journal",
      text: "actions.save",
      disabled: false,
      action: "save",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: false,
      canModify: true,
    },
    transitions: {
      successState: "SUBMITTED",
    },
  },

  // JOURNAL - Submitted state
  {
    assignmentType: "JOURNAL",
    states: ["SUBMITTED"],
    button: {
      className: "muikku-submit-journal",
      text: "actions.edit",
      disabled: false,
      action: "edit",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "ANSWERED",
    },
  },

  // INTERIM_EVALUATION - Editable states
  {
    assignmentType: "INTERIM_EVALUATION",
    states: ["UNANSWERED", "ANSWERED"],
    button: {
      className: "muikku-submit-interim-evaluation",
      text: "actions.send_interimEvaluationRequest",
      disabled: false,
      action: "submit",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: false,
      displaysHideShowAnswersButton: false,
      canModify: true,
    },
    transitions: {
      successState: "SUBMITTED",
    },
  },

  // INTERIM_EVALUATION - Submitted state
  {
    assignmentType: "INTERIM_EVALUATION",
    states: ["SUBMITTED"],
    button: {
      className: "muikku-submit-interim-evaluation",
      text: "actions.cancel_interimEvaluationRequest",
      disabled: false,
      action: "cancel",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "ANSWERED",
    },
  },

  // INTERIM_EVALUATION - Passed state
  {
    assignmentType: "INTERIM_EVALUATION",
    states: ["PASSED"],
    button: {
      className: "muikku-evaluated-assignment",
      text: "actions.evaluated",
      disabled: true,
      action: "none",
    },
    behavior: {
      checksAnswers: false,
      fieldsReadOnly: true,
      displaysHideShowAnswersButton: false,
      canModify: false,
    },
    transitions: {
      successState: "SUBMITTED",
    },
  },
];

/**
 * Helper function to find state configuration
 * @param assignmentType assignment type
 * @param state state
 * @returns state configuration
 */
export function findStateConfig(
  assignmentType: MaterialAssigmentType,
  state: MaterialCompositeReplyStateType
): StateConfig | undefined {
  return STATE_CONFIGS.find(
    (config) =>
      config.assignmentType === assignmentType && config.states.includes(state)
  );
}

/**
 * Helper function to get all configs for an assignment type
 * @param assignmentType assignment type
 * @returns state configurations
 */
export function getStateConfigsForType(
  assignmentType: MaterialAssigmentType
): StateConfig[] {
  return STATE_CONFIGS.filter(
    (config) => config.assignmentType === assignmentType
  );
}
