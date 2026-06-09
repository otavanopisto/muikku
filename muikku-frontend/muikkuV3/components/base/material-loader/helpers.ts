import {
  FieldSnapshotPolicyContext,
  FieldSnapshotCapabilities,
  StateConfig,
} from "./types";

//These represent the states assignments and exercises can be in
export const STATES: StateConfig[] = [
  {
    assignmentType: "EXERCISE",
    //usually exercises cannot be withdrawn but they might be in extreme cases when a evaluated has
    //been modified
    states: ["UNANSWERED", "ANSWERED", "WITHDRAWN"],

    //when an exercise is in the state unanswered answered or withdrawn then it doesn't
    //display this button
    displaysHideShowAnswersButton: false,
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
    displaysHideShowAnswersButton: true,
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
    displaysHideShowAnswersButton: true,
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

// Default field snapshot capabilities
export const DEFAULT_FIELD_SNAPSHOT_CAPABILITIES: FieldSnapshotCapabilities = {
  snapshotEnabled: false,
  snapshotCanView: false,
  snapshotCanTake: false,
  snapshotCanDelete: false,
};

/**
 * Resolves the field snapshot capabilities for an evaluation
 * @param ctx ctx
 * @returns FieldSnapshotCapabilities
 */
export function resolveEvaluationFieldSnapshotCapabilities(
  ctx: FieldSnapshotPolicyContext
): FieldSnapshotCapabilities {
  const { compositeReply, usedAs } = ctx;

  // If not an evaluation tool or no composite reply, return disabled
  if (usedAs !== "evaluationTool" || !compositeReply) {
    return DEFAULT_FIELD_SNAPSHOT_CAPABILITIES;
  }

  // Check the composite reply state
  const state = compositeReply.state;
  const isSubmitted = state === "SUBMITTED";
  const isIncomplete = state === "INCOMPLETE";

  const canTake = isSubmitted || isIncomplete;

  const view = true; // hide history until student has submitted something meaningful
  const canDelete = canTake;
  return {
    snapshotEnabled: view || canTake,
    snapshotCanView: view,
    snapshotCanTake: canTake,
    snapshotCanDelete: canDelete,
  };
}
