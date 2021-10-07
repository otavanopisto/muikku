import * as React from "react";

interface UseStudentActivityState {
  isLoading: boolean;
  studentActivity: [];
}

const initialState: UseStudentActivityState = {
  isLoading: true,
  studentActivity: [],
};

/**
 * useStudentActivity
 * Custom hook to return student activity data
 * @param myRef element reference
 * @returns dimension values of width and height
 */
/* export const useStudentActivity = (studentId: string) => {
  const [studentActivity, setStudentActivity] = React.useState(undefined);

  React.useEffect(() => {
    const loadSuggestionListData = async (
      subjectCode: string,
      course: Course
    ) => {
      setSuggestins({ ...suggestions, isLoading: true });

      setTimeout(async () => {
        const suggestionListForSubject = (await promisify(
          mApi().hops.listWorkspaceSuggestions.read({
            subject: subjectCode,
            courseNumber: course.courseNumber,
          }),
          "callback"
        )()) as Suggestion[];

        setSuggestins({
          ...suggestions,
          isLoading: false,
          suggestionsList: suggestionListForSubject,
        });
      }, 3000);
    };

    loadSuggestionListData(subjectCode, course);
  }, [myRef]);

  return dimensions;
}; */
