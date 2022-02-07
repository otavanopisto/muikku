import * as React from "react";
import mApi from "~/lib/mApi";
import { sleep } from "~/helper-functions/shared";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { CourseStatus, StudentActivityCourse } from "~/@types/shared";
import { Course } from "../course-carousel";
import { schoolCourseTable } from "~/mock/mock-data";
import { Suggestion } from "../../../../../../../@types/shared";

/**
 * UpdateSuggestionParams
 */
export interface UpdateSuggestionParams {
  goal: "add" | "remove";
  courseNumber: number;
  subjectCode: string;
  suggestionId?: number;
  studentId: string;
  type: "OPTIONAL" | "NEXT";
}

/**
 * UseStudentActivityState
 */
export interface UseCourseCarousel {
  isLoading: boolean;
  carouselItems: Course[];
}

/**
 * Custom hook to return student activity data
 * @param studentId studentId
 * @param displayNotification displayNotification
 * @returns array of course carousel items
 */
export const useCourseCarousel = (
  studentId: string,
  displayNotification: DisplayNotificationTriggerType
) => {
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
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loadeds course carousel data
         */
        const [loadedCourseCarouselData] = await Promise.all([
          (async () => {
            /**
             * Loaded student activity list
             */
            const studentActivityList = (await promisify(
              mApi().hops.student.studyActivity.read(studentId),
              "callback"
            )()) as StudentActivityCourse[];

            /**
             * courses list. Initialized with empty array. This list will be looped
             * with server calls that returns suggested courses which will eventually go
             * to course carousel. For now there is atleast one course per subject. Might be changed later.
             */
            const courses: { subjectCode: string; courseNumber: number }[] = [];

            /**
             * Iterate course matrix
             */
            for (const sCourseItem of schoolCourseTable) {
              for (const aCourse of sCourseItem.availableCourses) {
                /**
                 * If transfered, graded or ongoing...
                 */
                if (
                  studentActivityList.find(
                    (sItem) =>
                      sItem.subject === sCourseItem.subjectCode &&
                      sItem.courseNumber === aCourse.courseNumber &&
                      (sItem.status === CourseStatus.TRANSFERRED ||
                        sItem.status === CourseStatus.GRADED ||
                        sItem.status === CourseStatus.ONGOING)
                  )
                ) {
                  /**
                   * skip
                   */
                  continue;
                } else {
                  /**
                   * Otherwise push to courses list
                   */
                  courses.push({
                    subjectCode: sCourseItem.subjectCode,
                    courseNumber: aCourse.courseNumber,
                  });
                  break;
                }
              }
            }

            /**
             * Initialized suggestions list
             */
            let allSuggestions: Suggestion[] = [];

            try {
              /**
               * Now fetching all suggested data with course list data
               */
              await Promise.all(
                courses.map(async (cItem) => {
                  const suggestionListForSubject = (await promisify(
                    mApi().hops.listWorkspaceSuggestions.read({
                      subject: cItem.subjectCode,
                      courseNumber: cItem.courseNumber,
                    }),
                    "callback"
                  )()) as Suggestion[];

                  allSuggestions = allSuggestions.concat(
                    suggestionListForSubject
                  );
                })
              );
            } catch (err) {
              displayNotification(`Hups errori ${err}`, "error");
            }

            return allSuggestions;
          })(),
        ]);

        setCourseCarousel((courseCarousel) => ({
          ...courseCarousel,
          isLoading: false,
          carouselItems: loadedCourseCarouselData.map(
            (item) => ({ ...item } as Course)
          ),
        }));
      } catch (err) {
        displayNotification(`Hups errori, ${err.message}`, "error");
        setCourseCarousel((courseCarousel) => ({
          ...courseCarousel,
          isLoading: false,
        }));
      }
    };

    loadStudentActivityListData(studentId);
  }, [studentId, displayNotification]);

  return {
    courseCarousel,
  };
};
