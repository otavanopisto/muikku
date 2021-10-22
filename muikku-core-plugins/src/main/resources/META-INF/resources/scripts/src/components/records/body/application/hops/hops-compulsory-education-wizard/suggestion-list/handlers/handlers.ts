import mApi from "~/lib/mApi";
import promisify from "../../../../../../../../util/promisify";
import { StudentActivityCourse } from "~/@types/shared";
import { UseStudentActivityState } from "../../study-tool/hooks/useStudentActivity";

type SetSuggestedList = React.Dispatch<
  React.SetStateAction<UseStudentActivityState>
>;

export const updateSuggestion = async (
  setSuggestedList: SetSuggestedList,
  goal: "add" | "remove",
  courseNumber: number,
  subjectCode: string,
  suggestionId: number,
  studentId: string
) => {
  if (goal === "add") {
    try {
      const savedValues = (await promisify(
        mApi().hops.student.toggleSuggestion.create(studentId, {
          id: suggestionId,
          subject: subjectCode,
          courseNumber: courseNumber,
        }),
        "callback"
      )()) as StudentActivityCourse;

      setSuggestedList((prevState) => {
        let updatedList = [...prevState.suggestedList];

        updatedList.push(savedValues);

        return {
          ...prevState,
          suggestedList: updatedList,
        };
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      await promisify(
        mApi().hops.student.toggleSuggestion.create(studentId, {
          subject: subjectCode,
          courseNumber: courseNumber,
        }),
        "callback"
      )();

      setSuggestedList((prevState) => {
        let updatedList = [...prevState.suggestedList];

        updatedList = updatedList.filter(
          (item) => item.courseNumber !== courseNumber
        );

        return {
          ...prevState,
          studentActivitySuggestionList: updatedList,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }
};
