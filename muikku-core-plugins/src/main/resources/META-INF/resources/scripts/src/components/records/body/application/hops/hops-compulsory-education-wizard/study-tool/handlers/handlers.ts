import mApi from "~/lib/mApi";
import promisify from "../../../../../../../../util/promisify";

/**
 * UpdateSuggestionParams
 */
export interface UpdateStudentChoicesParams {
  goal: "add" | "remove";
  courseNumber: number;
  subject: string;
  studentId: string;
}

/**
 * updateStudentChoice
 * @param goal
 * @param courseNumber
 * @param subjectCode
 * @param suggestionId
 * @param studentId
 * @param type
 */
export const updateStudentChoice = async (
  params: UpdateStudentChoicesParams
) => {
  const { goal, subject, courseNumber, studentId } = params;

  console.log(goal);

  if (goal === "add") {
    try {
      await promisify(
        mApi().hops.student.studentChoices.create(studentId, {
          subject: subject,
          courseNumber: courseNumber,
        }),
        "callback"
      )();
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      await promisify(
        mApi().hops.student.studentChoices.create(studentId, {
          subject: subject,
          courseNumber: courseNumber,
        }),
        "callback"
      )();
    } catch (error) {
      console.error(error);
    }
  }
};
