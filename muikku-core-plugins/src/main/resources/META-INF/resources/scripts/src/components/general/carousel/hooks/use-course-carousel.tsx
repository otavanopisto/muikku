import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { SuggestedCourse } from "~/@types/shared";
import MApi, { isMApiError } from "~/api/api";
import { WorkspaceSuggestion } from "~/generated/client";
import { filterCompulsorySubjects } from "~/helper-functions/study-matrix";
import { schoolCourseTableCompulsory2018 } from "~/mock/mock-data";

/**
 * UseCourseCarousel
 */
export interface UseCourseCarousel {
  isLoading: boolean;
  carouselItems: SuggestedCourse[];
}

/**
 * CarouselSuggestion
 */
interface CarouselSuggestion {
  subjectCode: string;
  courseNumber: number;
}

/**
 * compareAll
 * @param obj1 obj1
 * @param obj2 obj2
 * @returns boolean
 */
const compareAll = (obj1: CarouselSuggestion, obj2: CarouselSuggestion) =>
  obj1.subjectCode === obj2.subjectCode &&
  obj1.courseNumber === obj2.courseNumber;

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to return student activity data
 *
 * @param studentId studentId
 * @param userEntityId userEntityId
 * @param displayNotification displayNotification
 * @returns array of course carousel items
 */
export const useCourseCarousel = (
  studentId: string,
  userEntityId: number,
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

  React.useEffect(() => {
    /**
     * Loads student activity data
     * @param studentId of student
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setCourseCarousel((courseCarousel) => ({
        ...courseCarousel,
        isLoading: true,
      }));

      try {
        // Loadeds course carousel data
        const [loadedCourseCarouselData] = await Promise.all([
          (async () => {
            // Student subject options
            const loadedStudentAlternativeOptions =
              await hopsApi.getStudentAlternativeStudyOptions({
                studentIdentifier: studentId,
              });

            //Loaded student activity list
            const studentActivityList = await hopsApi.getStudentStudyActivity({
              studentIdentifier: studentId,
            });

            // Initialized with empty array. This list will be looped
            // with server calls that returns suggested courses which will eventually go
            // to course carousel. For now there is atleast one course per subject. Might be changed later.
            let courses: CarouselSuggestion[] = [];

            // This list only contains courses suggested as next. Will do same procedure as
            // first list
            const coursesAsNext: CarouselSuggestion[] = [];

            // Ids of supervisor suggestions
            const suggestedNextIdList: number[] = [];

            const filteredSchoolCourseTable = filterCompulsorySubjects(
              schoolCourseTableCompulsory2018.subjectsTable,
              loadedStudentAlternativeOptions
            );

            // Iterate course matrix
            for (const sCourseItem of filteredSchoolCourseTable) {
              for (const aCourse of sCourseItem.availableCourses) {
                // If transfered, graded, ongoing
                if (
                  studentActivityList.find(
                    (sItem) =>
                      sItem.subject === sCourseItem.subjectCode &&
                      sItem.courseNumber === aCourse.courseNumber &&
                      (sItem.status === "TRANSFERRED" ||
                        sItem.status === "GRADED" ||
                        sItem.status === "ONGOING")
                  )
                ) {
                  // Skip
                  continue;
                } else {
                  // Otherwise push to courses list
                  courses.push({
                    subjectCode: sCourseItem.subjectCode,
                    courseNumber: aCourse.courseNumber,
                  });
                  break;
                }
              }
            }

            // Iterate studentActivity and pick only suggested next courses
            for (const a of studentActivityList) {
              if (a.status === "SUGGESTED_NEXT") {
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
              .map((s) => ({ ...s, suggestedAsNext: false } as SuggestedCourse))
              .sort((a, b) => a.name.localeCompare(b.name));

            // Suggested as next courses, sorted by alphabetically
            // Only return those which are suggested as next
            const suggestedNextCourses = suggestionsAsNext
              .filter(
                (sNext) =>
                  suggestedNextIdList.find((id) => id === sNext.id) !==
                  undefined
              )
              .map((s) => ({ ...s, suggestedAsNext: true } as SuggestedCourse))
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

    loadStudentActivityListData(studentId);
  }, [studentId, userEntityId, displayNotification]);

  return {
    courseCarousel,
  };
};
