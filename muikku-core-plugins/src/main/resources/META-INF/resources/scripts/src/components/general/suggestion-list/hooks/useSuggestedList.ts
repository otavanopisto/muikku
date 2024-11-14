import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import { WorkspaceSuggestion } from "~/generated/client";
import { Course } from "~/@types/shared";
import MApi, { isMApiError } from "~/api/api";

/**
 * UpdateSuggestionParams
 */
export interface UpdateSuggestionParams {
  actionType: "add" | "remove";
  courseNumber: number;
  subjectCode: string;
  courseId?: number;
  studentId: string;
}

/**
 * UseSuggestion
 */
export interface UseSuggestion {
  isLoading: boolean;
  suggestionsList: WorkspaceSuggestion[];
}

/**
 * initialState
 */
const initialState: UseSuggestion = {
  isLoading: true,
  suggestionsList: [],
};

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook for suggestion list
 * @param subjectCode subjectCode
 * @param course course
 * @param userEntityId userEntityId
 * @param displayNotification displayNotification
 * @param loadData loadData
 * @returns suggestion list
 */
export const useSuggestionList = (
  subjectCode: string,
  course: Course,
  userEntityId: number,
  displayNotification: DisplayNotificationTriggerType,
  loadData?: boolean
) => {
  const [suggestions, setSuggestions] =
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
      setSuggestions((suggestions) => ({ ...suggestions, isLoading: true }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(500);

        const [loadedSuggestionListCourses] = await Promise.all([
          (async () => {
            const suggestionListForSubject =
              await hopsApi.listWorkspaceSuggestions({
                subject: subjectCode,
                courseNumber: course.courseNumber,
                userEntityId: userEntityId,
              });

            return suggestionListForSubject;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setSuggestions((suggestions) => ({
            ...suggestions,
            isLoading: false,
            suggestionsList: loadedSuggestionListCourses,
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(err.message, "error");
          setSuggestions((suggestions) => ({
            ...suggestions,
            isLoading: false,
          }));
        }
      }
    };

    if (loadData) {
      loadSuggestionListData(subjectCode, course);
    }
  }, [course, subjectCode, userEntityId, loadData, displayNotification]);

  /**
   * updateSuggestion
   * @param params params
   */
  const updateSuggestionForNext = React.useCallback(
    async (params: UpdateSuggestionParams) => {
      const { actionType, courseId, subjectCode, courseNumber, studentId } =
        params;

      if (actionType === "add") {
        try {
          await hopsApi.toggleSuggestion({
            studentIdentifier: studentId,
            toggleSuggestionRequest: {
              courseId: courseId,
              subject: subjectCode,
              courseNumber: courseNumber,
            },
          });
        } catch (err) {
          // TODO: lokalisointi
          displayNotification(
            `Update add suggestion:, ${err.message}`,
            "error"
          );
        }
      } else {
        try {
          await hopsApi.updateToggleSuggestion({
            studentIdentifier: studentId,
            updateToggleSuggestionRequest: {
              courseId: courseId,
              subject: subjectCode,
              courseNumber: courseNumber,
            },
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          // TODO: lokalisointi
          displayNotification(
            `Update remove suggestion:, ${err.message}`,
            "error"
          );
        }
      }
    },
    [displayNotification]
  );

  React.useEffect(
    () => () => {
      componentMounted.current = false;
    },
    []
  );

  return {
    suggestionList: suggestions.suggestionsList,
    isLoading: suggestions.isLoading,
    updateSuggestionForNext,
  };
};
