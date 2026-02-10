import { StudyActivityItem } from "~/generated/client";

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
 * getAssessmentDataNew
 * @param assessment assessment
 */
export const getAssessmentData = (assessment: StudyActivityItem) => {
  let evalStateClassName = "";
  let evalStateIcon = "";
  let assessmentIsPending = false;
  let assessmentIsIncomplete = false;
  let assessmentIsUnassessed = false;
  let assessmentIsInterim = false;

  switch (assessment.state) {
    case "GRADED":
      // For graded items, check if passing to determine pass or fail
      if (assessment.passing) {
        evalStateClassName = "workspace-assessment--passed";
        evalStateIcon = "icon-thumb-up";
      } else {
        evalStateClassName = "workspace-assessment--failed";
        evalStateIcon = "icon-thumb-down";
      }
      break;
    case "PENDING":
      evalStateClassName = "workspace-assessment--pending";
      evalStateIcon = "icon-assessment-pending";
      assessmentIsPending = true;
      break;
    case "SUPPLEMENTATIONREQUEST":
      evalStateClassName = "workspace-assessment--incomplete";
      assessmentIsIncomplete = true;
      break;
    case "INTERIM_EVALUATION_REQUEST":
      assessmentIsPending = true;
      assessmentIsInterim = true;
      evalStateClassName = "workspace-assessment--interim-evaluation-request";
      evalStateIcon = "icon-assessment-pending";
      break;
    case "INTERIM_EVALUATION":
      assessmentIsInterim = true;
      evalStateClassName = "workspace-assessment--interim-evaluation";
      evalStateIcon = "icon-thumb-up";
      break;
    case "ONGOING":
    case "TRANSFERRED":
    case "SUGGESTED_NEXT":
    default:
      assessmentIsUnassessed = true;
      break;
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
