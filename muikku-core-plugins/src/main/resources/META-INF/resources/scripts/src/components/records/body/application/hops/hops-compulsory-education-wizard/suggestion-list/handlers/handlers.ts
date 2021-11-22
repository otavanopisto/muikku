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
  studentId: string,
  type: "OPTIONAL" | "NEXT"
) => {
  if (goal === "add") {
    try {
      const savedValues = (await promisify(
        mApi().hops.student.toggleSuggestion.create(studentId, {
          id: suggestionId,
          subject: subjectCode,
          courseNumber: courseNumber,
          type: type,
        }),
        "callback"
      )()) as StudentActivityCourse;

      setSuggestedList((prevState) => {
        let updatedList =
          type === "NEXT"
            ? [...prevState.suggestedNextList]
            : [...prevState.suggestedOptionalList];

        updatedList.push(savedValues);

        if (type === "NEXT") {
          return {
            ...prevState,
            suggestedNextList: updatedList,
          };
        } else {
          return {
            ...prevState,
            suggestedOptionalList: updatedList,
          };
        }
      });
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

      setSuggestedList((prevState) => {
        let updatedList =
          type === "NEXT"
            ? [...prevState.suggestedNextList]
            : [...prevState.suggestedOptionalList];

        updatedList = updatedList.filter(
          (item) => item.courseNumber !== courseNumber
        );

        if (type === "NEXT") {
          return {
            ...prevState,
            suggestedNextList: updatedList,
          };
        } else {
          return {
            ...prevState,
            suggestedOptionalList: updatedList,
          };
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
};
