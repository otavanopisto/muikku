import * as React from "react";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { sleep } from "~/helper-functions/shared";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";

/**
 * UseFollowUpGoalsState
 */
export interface UseStudentStudyHourState {
  isLoading: boolean;
  studyHourValue: number;
}

/**
 * Intial state
 */
const initialState: UseStudentStudyHourState = {
  isLoading: false,
  studyHourValue: 0,
};

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook for student study hours
 * @param studentId studentId
 * @param websocketState websocketState
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useStudentStudyHour = (
  studentId: string,
  websocketState: WebsocketStateType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [studyHours, setStudyHours] = React.useState(initialState);

  /**
   * State ref to containging studentActivity state data
   * when ever student activity state changes, so does this ref
   * This is because when websocket handler catches, it always have latest
   * state changes to use
   */
  const ref = React.useRef(studyHours);
  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    ref.current = studyHours;
  }, [studyHours]);

  React.useEffect(() => {
    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param studentId of student
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setStudyHours((studyHours) => ({ ...studyHours, isLoading: true }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded and filtered student activity
         */
        const [loadedStudentHours] = await Promise.all([
          (async () => {
            const studentHours = await hopsApi.getStudentStudyHours({
              studentIdentifier: studentId,
            });

            return studentHours;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudyHours((studyHours) => ({
            ...studyHours,
            isLoading: false,
            studyHourValue:
              loadedStudentHours !== undefined ? loadedStudentHours : 0,
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(err.message, "error");
          setStudyHours((studyHours) => ({
            ...studyHours,
            isLoading: false,
          }));
        }
      }
    };

    loadStudentActivityListData(studentId);

    return () => {
      componentMounted.current = false;
    };
  }, [studentId, displayNotification]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * @param data data
     * @param data.id id
     * @param data.studentIdentifier studentIdentifier
     * @param data.studyHours studyHours
     */
    const onAnswerSavedAtServer = (data: {
      id: number;
      studentIdentifier: string;
      studyHours: number;
    }) => {
      if (data.studyHours !== ref.current.studyHourValue) {
        setStudyHours((studyHours) => ({
          ...studyHours,
          studyHourValue: data.studyHours,
        }));
      }
    };

    /**
     * Adding event callback to handle changes when ever
     * there has happened some changes with that message
     */
    websocketState.websocket.addEventCallback(
      "hops:studyhours",
      onAnswerSavedAtServer
    );

    return () => {
      /**
       * Remove callback when unmounting
       */
      websocketState.websocket.removeEventCallback(
        "hops:studyhours",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  /**
   * updateStudyHours
   * @param studentId studentId
   * @param hours hours
   */
  const updateStudyHours = async (studentId: string, hours: number) => {
    try {
      await hopsApi.saveStudentStudyHours({
        studentIdentifier: studentId,
        saveStudentStudyHoursRequest: {
          studyHours: hours,
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
    studyHours,
    /**
     * updateStudyHours
     * @param studentId studentId
     * @param hours hours
     */
    updateStudyHours: (studentId: string, hours: number) =>
      updateStudyHours(studentId, hours),
  };
};
