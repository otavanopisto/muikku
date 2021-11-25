import mApi from "~/lib/mApi";
import promisify from "../../../../../../../../util/promisify";
import { UseStudentActivityState } from "../../study-tool/hooks/use-student-activity";

/**
 * UpdateSuggestionParams
 */
export interface UpdateSuggestionParams {
  goal: "add" | "remove";
  courseNumber: number;
  subjectCode: string;
  suggestionId: number;
  studentId: string;
  type: "OPTIONAL" | "NEXT";
}

/**
 * updateSuggestion
 * @param goal
 * @param courseNumber
 * @param subjectCode
 * @param suggestionId
 * @param studentId
 * @param type
 */
export const updateSuggestion = async (params: UpdateSuggestionParams) => {
  const { goal, type, suggestionId, subjectCode, courseNumber, studentId } =
    params;

  if (goal === "add") {
    try {
      await promisify(
        mApi().hops.student.toggleSuggestion.create(studentId, {
          id: suggestionId,
          subject: subjectCode,
          courseNumber: courseNumber,
          type: type,
        }),
        "callback"
      )();
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      await promisify(
        mApi().hops.student.toggleSuggestion.create(studentId, {
          id: suggestionId,
          subject: subjectCode,
          courseNumber: courseNumber,
          type: type,
        }),
        "callback"
      )();
    } catch (error) {
      console.error(error);
    }
  }
};
