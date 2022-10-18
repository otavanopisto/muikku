import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { CourseStatus, StudentActivityCourse } from "~/@types/shared";
import { Suggestion, SuggestedCourse } from "~/@types/shared";

/**
 * NextCourseSuggestions
 */
export interface NextCourseSuggestions {
  isLoading: boolean;
  nextCourses: SuggestedCourse[];
}

/**
 * NextCourse
 */
interface NextCourse {
  subjectCode: string;
  courseNumber: number;
}

/**
 * Custom hook to return next courses suggested by the councelor
 *
 * @param studentId studentId
 * @param userEntityId userEntityId
 * @param displayNotification displayNotification
 * @returns array of course carousel items
 */
export const useNextCourseSuggestions = (
  studentId: string,
  userEntityId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  // This hook cannot be called for anyone else but students (without an error)
  // And Rules of Hooks say "Don’t call Hooks inside loops, conditions, or nested functions"
  // So there can't be any conditions inside a component that calls this hook

  const [nextSuggestions, setNextSuggestions] =
    React.useState<NextCourseSuggestions>({
      isLoading: true,
      nextCourses: [],
    });

  React.useEffect(() => {
    /**
     * Loads student activity data
     * @param studentId of student
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setNextSuggestions((nextSuggestions) => ({
        ...nextSuggestions,
        isLoading: true,
      }));

      try {
        /**
         * nextSuggestionsData
         * @returns Course[]
         */
        const nextSuggestionsData = async () => {
          //Loaded student activity list
          const studentActivityList = (await promisify(
            mApi().hops.student.studyActivity.read(studentId),
            "callback"
          )()) as StudentActivityCourse[];

          // Courses suggested as next.
          const coursesAsNext: NextCourse[] = [];

          // Ids of supervisor suggestions
          const suggestedNextIdList: number[] = [];

          // Iterate studentActivity and pick only suggested next courses
          for (const a of studentActivityList) {
            if (a.status === CourseStatus.SUGGESTED_NEXT) {
              suggestedNextIdList.push(a.courseId);

              coursesAsNext.push({
                subjectCode: a.subject,
                courseNumber: a.courseNumber,
              });
            }
          }

          // Initialized supervisor suggestions
          const suggestions: Suggestion[] = [];

          // Now fetching all suggested data with course list data
          try {
            await Promise.all(
              coursesAsNext.map(async (cItem) => {
                const suggestionListForSubject = (await promisify(
                  mApi().hops.listWorkspaceSuggestions.read({
                    subject: cItem.subjectCode,
                    courseNumber: cItem.courseNumber,
                    userEntityId: userEntityId,
                  }),
                  "callback"
                )()) as Suggestion[];

                for (const suggestion of suggestionListForSubject) {
                  suggestions.push(suggestion);
                }
              })
            );
          } catch (err) {
            displayNotification(`Hups errori ${err}`, "error");
          }

          // Suggested as next courses, sorted by alphabetically
          // Only return those which are suggested as next
          const suggestedNextCourses = suggestions
            .filter(
              (sNext) =>
                suggestedNextIdList.find((id) => id === sNext.id) !== undefined
            )
            .map((s) => ({ ...s, suggestedAsNext: true } as SuggestedCourse))
            .sort((a, b) => a.name.localeCompare(b.name));

          // Here merge two previous arrays and return it
          return suggestedNextCourses;
        };

        const suggestions = await nextSuggestionsData();

        setNextSuggestions((nextSuggestions) => ({
          ...nextSuggestions,
          isLoading: false,
          nextCourses: suggestions,
        }));
      } catch (err) {
        displayNotification(`Hups errori, ${err.message}`, "error");
        setNextSuggestions((nextSuggestions) => ({
          ...nextSuggestions,
          isLoading: false,
        }));
      }
    };

    loadStudentActivityListData(studentId);
  }, [studentId, userEntityId, displayNotification]);

  return {
    nextSuggestions,
  };
};
