import * as React from "react";
import { sleep } from "~/helper-functions/shared";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  OptionalCourseSuggestion,
  StudentCourseChoice,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

/**
 * UpdateStudentChoicesParams
 */
export interface UpdateSupervisorOptionalSuggestionParams {
  courseNumber: number;
  subject: string;
  studentId: string;
}

/**
 * UseStudentActivityState
 */
export interface UseSupervisorOptionalSuggestionState {
  isLoading: boolean;
  supervisorOptionalSuggestions: OptionalCourseSuggestion[];
}

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to return supervisor optional suggestions
 * @param studentId studentId
 * @param websocketState websocketState
 * @param displayNotification displayNotification
 * @returns student course choices
 */
export const useSupervisorOptionalSuggestions = (
  studentId: string,
  websocketState: WebsocketStateType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [supervisorOptionalSuggestions, setSupervisorOptionalSuggestions] =
    React.useState<UseSupervisorOptionalSuggestionState>({
      isLoading: true,
      supervisorOptionalSuggestions: [],
    });

  const componentMounted = React.useRef(true);

  /**
   * State ref to containging studentChoices state data
   * when ever student activity state changes, so does this ref
   * This is because when websocket handler catches, it always have latest
   * state changes to use
   */
  const ref = React.useRef(supervisorOptionalSuggestions);

  React.useEffect(() => {
    ref.current = supervisorOptionalSuggestions;
  }, [supervisorOptionalSuggestions]);

  React.useEffect(() => {
    /**
     * loadStudentChoiceData
     * Loads student choice data
     * @param studentId of student
     */
    const loadSupervisorOptionalSuggestionsData = async (studentId: string) => {
      setSupervisorOptionalSuggestions((studentChoices) => ({
        ...studentChoices,
        isLoading: true,
      }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded student choises
         */
        const [loadedSupervisorOptionalSuggestions] = await Promise.all([
          (async () => {
            const supervisorOptionalSuggestionList =
              await hopsApi.getStudentOptionalSuggestions({
                studentIdentifier: studentId,
              });

            return supervisorOptionalSuggestionList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setSupervisorOptionalSuggestions((supervisorOptionalSuggestions) => ({
            ...supervisorOptionalSuggestions,
            isLoading: false,
            supervisorOptionalSuggestions: loadedSupervisorOptionalSuggestions,
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(err.message, "error");
          setSupervisorOptionalSuggestions((supervisorOptionalSuggestions) => ({
            ...supervisorOptionalSuggestions,
            isLoading: false,
          }));
        }
      }
    };

    loadSupervisorOptionalSuggestionsData(studentId);

    return () => {
      componentMounted.current = false;
    };
  }, [studentId, displayNotification]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (
      data: StudentCourseChoice & { studentIdentifier: string }
    ) => {
      const { supervisorOptionalSuggestions } = ref.current;

      const arrayOfStudentChoices = supervisorOptionalSuggestions;

      /**
       * Finding possible existing selection
       */
      const indexOfCourse = supervisorOptionalSuggestions.findIndex(
        (sItem) =>
          sItem.subject === data.subject &&
          sItem.courseNumber === data.courseNumber
      );

      /**
       * If found, then delete it otherwise add it
       */
      if (indexOfCourse !== -1) {
        arrayOfStudentChoices.splice(indexOfCourse, 1);
      } else {
        arrayOfStudentChoices.push(data);
      }

      setSupervisorOptionalSuggestions((supervisorOptionalSuggestions) => ({
        ...supervisorOptionalSuggestions,
        isLoading: false,
        supervisorOptionalSuggestions: arrayOfStudentChoices,
      }));
    };

    /**
     * Adding event callback to handle changes when ever
     * there has happened some changes with that message
     */
    websocketState.websocket.addEventCallback(
      "hops:optionalsuggestion-updated",
      onAnswerSavedAtServer
    );

    return () => {
      /**
       * Remove callback when unmounting
       */
      websocketState.websocket.removeEventCallback(
        "hops:optionalsuggestion-updated",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  /**
   * updateStudentChoice
   * @param params params
   */
  const updateSupervisorOptionalSuggestion = async (
    params: UpdateSupervisorOptionalSuggestionParams
  ) => {
    const { subject, courseNumber, studentId } = params;

    try {
      await hopsApi.createOptionalSuggestion({
        studentIdentifier: studentId,
        createOptionalSuggestionRequest: {
          subject: subject,
          courseNumber: courseNumber,
        },
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      displayNotification(err.message, "error");
    }
  };

  return {
    supervisorOptionalSuggestions,
    /**
     * updateStudentChoice
     * @param params params
     */
    updateSupervisorOptionalSuggestion: (
      params: UpdateSupervisorOptionalSuggestionParams
    ) => updateSupervisorOptionalSuggestion(params),
  };
};
