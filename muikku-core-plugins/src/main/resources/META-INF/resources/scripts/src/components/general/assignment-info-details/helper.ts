import { MaterialCompositeReply, WorkspaceMaterial } from "~/generated/client";

/**
 * Assignment info interface
 */
export interface AssignmentInfo {
  title: string;
  grade?: string | null;
  points?: number | null;
  maxPoints?: number | null;
}

/**
 * Creates an array of assignment info objects containing title, grade, points and maxPoints
 *
 * @param compositeReplies MaterialCompositeReply[]
 * @param assignments WorkspaceMaterial[]
 * @returns Array of assignment info objects
 */
export const createAssignmentInfoArray = (
  compositeReplies?: MaterialCompositeReply[],
  assignments?: WorkspaceMaterial[]
): AssignmentInfo[] => {
  if (!compositeReplies || !assignments) {
    return [];
  }

  const assignmentInfoArray: Array<{
    title: string;
    grade?: string | null;
    points?: number | null;
    maxPoints?: number | null;
  }> = [];

  // Use only evaluated assignments
  const evaluatedAssignments = assignments.filter(
    (a) => a.assignmentType === "EVALUATED"
  );

  // Iterate through all assigments and find composite reply pair for each
  evaluatedAssignments.forEach((a) => {
    const compositeReply = compositeReplies.find(
      (r) => r.workspaceMaterialId === a.id
    );

    let doNotInclude = a.hidden;

    // If assignment is hidden and composite reply is found and it has been submitted or answered
    // then assignment should be included
    if (
      doNotInclude &&
      compositeReply &&
      (compositeReply.submitted !== null ||
        compositeReply.state === "ANSWERED" ||
        compositeReply.state === "SUBMITTED" ||
        compositeReply.state === "WITHDRAWN" ||
        compositeReply.state === "PASSED" ||
        compositeReply.state === "FAILED" ||
        compositeReply.state === "INCOMPLETE")
    ) {
      doNotInclude = false;
    }

    if (doNotInclude) {
      return;
    }

    const newAssignmentInfo: AssignmentInfo = {
      title: a.title,
      grade: null,
      points: null,
      maxPoints: null,
    };

    if (!compositeReply || !compositeReply.evaluationInfo) {
      assignmentInfoArray.push(newAssignmentInfo);
      return;
    }

    switch (compositeReply.evaluationInfo.evaluationType) {
      case "GRADED":
        newAssignmentInfo.grade = compositeReply?.evaluationInfo?.grade || null;
        break;
      case "SUPPLEMENTATIONREQUEST":
        newAssignmentInfo.grade = "T";
        break;

      case "POINTS":
        if (a.maxPoints && a.maxPoints !== null) {
          newAssignmentInfo.points =
            compositeReply?.evaluationInfo?.points || 0;
          newAssignmentInfo.maxPoints = a.maxPoints;
        } else {
          newAssignmentInfo.points =
            compositeReply?.evaluationInfo?.points || null;
          newAssignmentInfo.maxPoints = null;
        }
        break;
      default:
        break;
    }

    assignmentInfoArray.push(newAssignmentInfo);
  });

  return assignmentInfoArray;
};
