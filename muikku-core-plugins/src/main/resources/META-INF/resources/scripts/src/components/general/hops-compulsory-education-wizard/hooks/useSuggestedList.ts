import mApi from "~/lib/mApi";
import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import { Course, Suggestion } from "~/@types/shared";
import promisify from "~/util/promisify";

/**
 * UseSuggestion
 */
export interface UseSuggestion {
  isLoading: boolean;
  suggestionsList: Suggestion[];
}

/**
 * initialState
 */
const initialState: UseSuggestion = {
  isLoading: true,
  suggestionsList: [],
};

/**
 * Custom hook for suggestion list
 * @param subjectCode subjectCode
 * @param course course
 * @param displayNotification displayNotification
 * @param loadData loadData
 * @returns suggestion list
 */
export const useSuggestionList = (
  subjectCode: string,
  course: Course,
  displayNotification: DisplayNotificationTriggerType,
  loadData?: boolean
) => {
  const [suggestions, setSuggestins] =
    React.useState<UseSuggestion>(initialState);
  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * loadSuggestionListData
     * @param subjectCode subjectCode
     * @param course course
     */
    const loadSuggestionListData = async (
      subjectCode: string,
      course: Course
    ) => {
      setSuggestins((suggestions) => ({ ...suggestions, isLoading: true }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(500);

        const [loadedSuggestionListCourses] = await Promise.all([
          (async () => {
            const suggestionListForSubject = (await promisify(
              mApi().hops.listWorkspaceSuggestions.read({
                subject: subjectCode,
                courseNumber: course.courseNumber,
              }),
              "callback"
            )()) as Suggestion[];

            return suggestionListForSubject;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setSuggestins((suggestions) => ({
            ...suggestions,
            isLoading: false,
            suggestionsList: loadedSuggestionListCourses,
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(err.message, "error");
          setSuggestins((suggestions) => ({
            ...suggestions,
            isLoading: false,
          }));
        }
      }
    };

    if (loadData) {
      loadSuggestionListData(subjectCode, course);
    }
  }, [course, subjectCode, loadData, displayNotification]);

  React.useEffect(
    () => () => {
      componentMounted.current = false;
    },
    []
  );

  return suggestions;
};
