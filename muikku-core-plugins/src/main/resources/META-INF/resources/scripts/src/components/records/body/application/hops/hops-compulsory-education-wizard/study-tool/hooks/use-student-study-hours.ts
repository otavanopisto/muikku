import * as React from "react";
import { WebsocketStateType } from "~/reducers/util/websocket";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { sleep } from "~/helper-functions/shared";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

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

/**
 * useFollowUpGoal
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
      setStudyHours({ ...studyHours, isLoading: true });

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
            const studentHours = (await promisify(
              mApi().hops.student.studyHours.read(studentId),
              "callback"
            )()) as number;

            return studentHours;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudyHours({
            ...studyHours,
            isLoading: false,
            studyHourValue:
              loadedStudentHours !== undefined ? loadedStudentHours : 0,
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Hups errori, ${err.message}`, "error");
          setStudyHours({
            ...studyHours,
            isLoading: false,
          });
        }
      }
    };

    loadStudentActivityListData(studentId);

    return () => {
      componentMounted.current = false;
    };
  }, [studentId]);

  React.useEffect(() => {
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
  }, []);

  /**
   * onAnswerSavedAtServer
   * @param data
   */
  const onAnswerSavedAtServer = (data: {
    id: number;
    studentIdentifier: string;
    studyHours: number;
  }) => {
    if (data.studyHours !== ref.current.studyHourValue) {
      setStudyHours({ ...studyHours, studyHourValue: data.studyHours });
    }
  };

  /**
   * updateStudyHours
   * @param studentId
   */
  const updateStudyHours = async (studentId: string, hours: number) => {
    try {
      await promisify(
        mApi().hops.student.studyHours.create(studentId, {
          studyHours: hours,
        }),
        "callback"
      )();
    } catch (err) {
      displayNotification(`Hups errori, ${err.message}`, "error");
    }
  };

  return {
    studyHours,
    updateStudyHours: (studentId: string, hours: number) =>
      updateStudyHours(studentId, hours),
  };
};
