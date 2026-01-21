import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { SuggestedCourse } from "~/@types/shared";
import MApi, { isMApiError } from "~/api/api";
import { CourseMatrix, WorkspaceSuggestion } from "~/generated/client";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";

/**
 * UseCourseCarousel
 */
export interface UseCourseCarousel {
  isLoading: boolean;
  carouselItems: SuggestedCourse[] | null;
}

/**
 * CarouselSuggestion
 */
interface CarouselSuggestion {
  subjectCode: string;
  courseNumber: number;
}

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to return student activity data
 *
 * @param studentId studentId
 * @param userEntityId userEntityId
 * @param matrix matrix
 * @param displayNotification displayNotification
 * @returns array of course carousel items
 */
export const useCourseCarousel = (
  studentId: string,
  userEntityId: number,
  matrix: CourseMatrix,
  displayNotification: DisplayNotificationTriggerType
) => {
  // This hook cannot be called for anyone else but students (without an error)
  // And Rules of Hooks say "Don’t call Hooks inside loops, conditions, or nested functions"
  // So there can't be any conditions inside a component that calls this hook

  const [courseCarousel, setCourseCarousel] = React.useState<UseCourseCarousel>(
    {
      isLoading: true,
      carouselItems: [],
    }
  );

  const studyActivity = useSelector(
    (state: StateType) => state.studyActivity.userStudyActivity
  );

  React.useEffect(() => {
    /**
     * Loads student activity data
     */
    const loadStudentActivityListData = async () => {
      // If matrix is not found, cancel function and return
      if (!matrix || !studyActivity) {
        setCourseCarousel((courseCarousel) => ({
          ...courseCarousel,
          carouselItems: null,
          isLoading: false,
        }));
        return;
      }

      setCourseCarousel((courseCarousel) => ({
        ...courseCarousel,
        isLoading: true,
      }));

      try {
        // Loadeds course carousel data
        const [loadedCourseCarouselData] = await Promise.all([
          (async () => {
            // Initialized with empty array. This list will be looped
            // with server calls that returns suggested courses which will eventually go
            // to course carousel. For now there is atleast one course per subject. Might be changed later.
            let courses: CarouselSuggestion[] = [];

            // This list only contains courses suggested as next. Will do same procedure as
            // first list
            const coursesAsNext: CarouselSuggestion[] = [];

            // Ids of supervisor suggestions
            const suggestedNextIdList: number[] = [];

            // Iterate course matrix
            for (const sCourseItem of matrix.subjects) {
              for (const aCourse of sCourseItem.modules) {
                // If transfered, graded, ongoing
                if (
                  studyActivity.items.find(
                    (sItem) =>
                      sItem.subject === sCourseItem.code &&
                      sItem.courseNumber === aCourse.courseNumber &&
                      (sItem.state === "TRANSFERRED" ||
                        sItem.state === "GRADED" ||
                        sItem.state === "ONGOING")
                  )
                ) {
                  // Skip
                  continue;
                } else {
                  // Otherwise push to courses list
                  courses.push({
                    subjectCode: sCourseItem.code,
                    courseNumber: aCourse.courseNumber,
                  });
                  break;
                }
              }
            }

            // Iterate studentActivity and pick only suggested next courses
            for (const a of studyActivity.items) {
              if (a.state === "SUGGESTED_NEXT") {
                suggestedNextIdList.push(a.courseId);

                coursesAsNext.push({
                  subjectCode: a.subject,
                  courseNumber: a.courseNumber,
                });
              }
            }

            // Remove duplicated objects from main array based on
            // what suggested as next array contains
            courses = courses.filter((b) => {
              const indexFound = coursesAsNext.findIndex((a) =>
                compareAll(a, b)
              );
              return indexFound == -1;
            });

            // Initialized normal suggestions list
            let suggestions: WorkspaceSuggestion[] = [];

            // Initialized supervisor suggestions
            let suggestionsAsNext: WorkspaceSuggestion[] = [];

            // Now fetching all suggested data with course list data
            try {
              await Promise.all(
                courses.map(async (cItem) => {
                  const suggestionListForSubject =
                    await hopsApi.listWorkspaceSuggestions({
                      subject: cItem.subjectCode,
                      courseNumber: cItem.courseNumber,
                      userEntityId: userEntityId,
                    });

                  suggestions = suggestions.concat(suggestionListForSubject);
                })
              );

              await Promise.all(
                coursesAsNext.map(async (cItem) => {
                  const suggestionListForSubject =
                    await hopsApi.listWorkspaceSuggestions({
                      subject: cItem.subjectCode,
                      courseNumber: cItem.courseNumber,
                      userEntityId: userEntityId,
                    });

                  suggestionsAsNext = suggestionsAsNext.concat(
                    suggestionListForSubject
                  );
                })
              );
            } catch (err) {
              if (!isMApiError(err)) {
                throw err;
              }

              displayNotification(err.message, "error");
            }

            // Suggestions as Courses, sorted by alphabetically
            // These cannot be suggested as next
            const suggestedCourses = suggestions
              .map((s) => ({ ...s, suggestedAsNext: false }) as SuggestedCourse)
              .sort((a, b) => a.name.localeCompare(b.name));

            // Suggested as next courses, sorted by alphabetically
            // Only return those which are suggested as next
            const suggestedNextCourses = suggestionsAsNext
              .filter(
                (sNext) =>
                  suggestedNextIdList.find((id) => id === sNext.id) !==
                  undefined
              )
              .map((s) => ({ ...s, suggestedAsNext: true }) as SuggestedCourse)
              .sort((a, b) => a.name.localeCompare(b.name));

            // Here merge two previous arrays and return it
            return suggestedNextCourses.concat(suggestedCourses);
          })(),
        ]);

        setCourseCarousel((courseCarousel) => ({
          ...courseCarousel,
          isLoading: false,
          carouselItems: loadedCourseCarouselData,
        }));
      } catch (err) {
        displayNotification(err.message, "error");
        setCourseCarousel((courseCarousel) => ({
          ...courseCarousel,
          isLoading: false,
        }));
      }
    };

    loadStudentActivityListData();
  }, [userEntityId, displayNotification, matrix, studyActivity]);

  return {
    courseCarousel,
  };
};

/**
 * compareAll
 * @param obj1 obj1
 * @param obj2 obj2
 * @returns boolean
 */
const compareAll = (obj1: CarouselSuggestion, obj2: CarouselSuggestion) =>
  obj1.subjectCode === obj2.subjectCode &&
  obj1.courseNumber === obj2.courseNumber;

/**
 * carouselMatrixByStudyProgrammeAndCurriculum
 * @param studyProgrammeName studyProgrammeName
 * @param matrix matrix
 * @returns Matrix or null if matrix is not found
 */
export const carouselMatrixByStudyProgramme = (
  studyProgrammeName: string,
  matrix: CourseMatrix
) => {
  switch (studyProgrammeName) {
    case "Nettiperuskoulu":
    case "Nettiperuskoulu/yksityisopiskelu":
    case "Aineopiskelu/perusopetus":
    case "Aineopiskelu/oppivelvolliset/korottajat (pk)":
      return matrix;

    default:
      return null;
  }
};
