import mApi from "~/lib/mApi";
import promisify from "../../../../../../../../util/promisify";
import { StudentActivityCourse } from "~/@types/shared";
import { UseStudentActivityState } from "../../study-tool/hooks/useStudentActivity";

type SetSuggestedList = React.Dispatch<
  React.SetStateAction<UseStudentActivityState>
>;

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
 *
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
    console.log("lisätään", type);
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
    console.log("Poistetaan/korvataan", type);
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
