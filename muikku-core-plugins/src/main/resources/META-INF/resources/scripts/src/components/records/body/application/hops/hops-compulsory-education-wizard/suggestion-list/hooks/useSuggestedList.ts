import { Suggestion, Course } from "../../../../../../../../@types/shared";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";

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
 * useSuggestionList custom hook
 * @param subjectCode
 * @param course
 * @param loadData
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
     * @param subjectCode
     * @param course
     */
    const loadSuggestionListData = async (
      subjectCode: string,
      course: Course
    ) => {
      setSuggestins({ ...suggestions, isLoading: true });

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

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
          setSuggestins({
            ...suggestions,
            isLoading: false,
            suggestionsList: loadedSuggestionListCourses,
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Hups errori ${err}`, "error");
          setSuggestins({ ...suggestions, isLoading: false });
        }
      }
    };

    if (loadData) {
      loadSuggestionListData(subjectCode, course);
    }

    return () => {
      componentMounted.current = false;
    };
  }, [course, subjectCode, loadData]);

  return suggestions;
};
