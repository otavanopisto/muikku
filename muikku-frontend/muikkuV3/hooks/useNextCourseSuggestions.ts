import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { SuggestedCourse } from "~/@types/shared";
import { WorkspaceSuggestion } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

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

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to return next courses suggested by the counselor
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
          const studentActivityList = await hopsApi.getStudyActivity({
            studentIdentifier: studentId,
          });

          // Courses suggested as next.
          const coursesAsNext: NextCourse[] = [];

          // Ids of supervisor suggestions
          const suggestedNextIdList: number[] = [];

          // Iterate studentActivity and pick only suggested next courses
          for (const a of studentActivityList.items) {
            if (a.state === "SUGGESTED_NEXT") {
              suggestedNextIdList.push(a.courseId);

              coursesAsNext.push({
                subjectCode: a.subject,
                courseNumber: a.courseNumber,
              });
            }
          }

          // Initialized supervisor suggestions
          const suggestions: WorkspaceSuggestion[] = [];

          // Now fetching all suggested data with course list data
          try {
            await Promise.all(
              coursesAsNext.map(async (cItem) => {
                const suggestionListForSubject =
                  await hopsApi.listWorkspaceSuggestions({
                    subject: cItem.subjectCode,
                    courseNumber: cItem.courseNumber,
                    userEntityId: userEntityId,
                  });

                for (const suggestion of suggestionListForSubject) {
                  suggestions.push(suggestion);
                }
              })
            );
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }

            displayNotification(err.message, "error");
          }

          // Suggested as next courses, sorted by alphabetically
          // Only return those which are suggested as next
          const suggestedNextCourses = suggestions
            .filter(
              (sNext) =>
                suggestedNextIdList.find((id) => id === sNext.id) !== undefined
            )
            .map((s) => ({ ...s, suggestedAsNext: true }) as SuggestedCourse)
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
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(err.message, "error");
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
