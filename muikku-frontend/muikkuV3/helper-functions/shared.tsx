import { WorkspaceAssessmentState } from "~/generated/client";

/**
 * sleep
 * @param m milliseconds
 * @returns Promise
 */
export const sleep = (m: number) => new Promise((r) => setTimeout(r, m));

/**
 * Checks if string is valid html
 * @param str str
 * @returns boolean
 */
export const isStringHTML = (str: string) => {
  // Creates div helper element and inserts checkable string inside of it
  const helperElement = document.createElement("div");
  helperElement.innerHTML = str;

  // Check if string is not empty/null/undefined and nodeType is 1.
  // Number 1 is elements like divs or p tags etc.
  // First nodeType tells if the str is not valid html
  return (
    str !== null &&
    str !== undefined &&
    str !== "" &&
    helperElement.childNodes[0].nodeType == 1
  );
};

/**
 * getAssessmentData
 * @param assessment assessment
 */
export const getAssessmentData = (assessment: WorkspaceAssessmentState) => {
  let evalStateClassName = "";
  let evalStateIcon = "";
  let assessmentIsPending = false;
  let assessmentIsIncomplete = false;
  let assessmentIsUnassessed = false;
  let assessmentIsInterim = false;

  switch (assessment.state) {
    case "pass":
      evalStateClassName = "workspace-assessment--passed";
      evalStateIcon = "icon-thumb-up";
      break;
    case "pending":
    case "pending_pass":
    case "pending_fail":
      evalStateClassName = "workspace-assessment--pending";
      evalStateIcon = "icon-assessment-pending";
      assessmentIsPending = true;
      break;
    case "fail":
      evalStateClassName = "workspace-assessment--failed";
      evalStateIcon = "icon-thumb-down";
      break;
    case "incomplete":
      evalStateClassName = "workspace-assessment--incomplete";
      assessmentIsIncomplete = true;
      break;

    case "interim_evaluation_request":
      assessmentIsPending = true;
      assessmentIsInterim = true;
      evalStateClassName = "workspace-assessment--interim-evaluation-request";
      evalStateIcon = "icon-assessment-pending";
      break;
    case "interim_evaluation":
      assessmentIsInterim = true;
      evalStateClassName = "workspace-assessment--interim-evaluation";
      evalStateIcon = "icon-thumb-up";
      break;

    case "unassessed":
    default:
      assessmentIsUnassessed = true;
  }

  const literalAssessment =
    assessment && assessment.text ? assessment.text : null;

  return {
    evalStateClassName,
    evalStateIcon,
    assessmentIsPending,
    assessmentIsUnassessed,
    assessmentIsIncomplete,
    assessmentIsInterim,
    literalAssessment,
  };
};
