import { MaterialCompositeReply, WorkspaceMaterial } from "~/generated/client";

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
): Array<{
  title: string;
  grade?: string | null;
  points?: number;
  maxPoints?: number;
}> => {
  if (!compositeReplies || !assignments) {
    return [];
  }

  const assignmentInfoArray: Array<{
    title: string;
    grade?: string | null;
    points?: number | null;
    maxPoints?: number | null;
  }> = [];

  // Iterate through all assigments and find composite reply pair for each
  assignments.forEach((a) => {
    const compositeReply = compositeReplies.find(
      (r) => r.workspaceMaterialId === a.id
    );

    let grade = compositeReply?.evaluationInfo?.grade || null;

    if (
      compositeReply?.evaluationInfo?.evaluationType ===
      "SUPPLEMENTATIONREQUEST"
    ) {
      grade = "T";
    }

    if (a.maxPoints && a.maxPoints !== null) {
      assignmentInfoArray.push({
        title: a.title,
        grade: grade,
        points: compositeReply?.evaluationInfo?.points || 0,
        maxPoints: a.maxPoints,
      });
    } else {
      assignmentInfoArray.push({
        title: a.title,
        grade: grade,
        points: compositeReply?.evaluationInfo?.points || null,
        maxPoints: null,
      });
    }
  });

  return assignmentInfoArray;
};
