import * as React from "react";
import { sleep } from "~/helper-functions/shared";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { StudentCourseChoice } from "~/generated/client";

/**
 * UpdateStudentChoicesParams
 */
export interface UpdateStudentChoicesParams {
  courseNumber: number;
  subject: string;
  studentId: string;
}

/**
 * UseStudentActivityState
 */
export interface UseStudentChoiceState {
  isLoading: boolean;
  studentChoices: StudentCourseChoice[];
}

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to handle student course choices
 * @param studentId studentId
 * @param websocketState websocketState
 * @param displayNotification displayNotification
 * @returns student course choices
 */
export const useStudentChoices = (
  studentId: string,
  websocketState: WebsocketStateType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [studentChoices, setStudentChoices] =
    React.useState<UseStudentChoiceState>({
      isLoading: true,
      studentChoices: [],
    });

  const componentMounted = React.useRef(true);

  /**
   * State ref to containging studentChoices state data
   * when ever student activity state changes, so does this ref
   * This is because when websocket handler catches, it always have latest
   * state changes to use
   */
  const ref = React.useRef(studentChoices);

  React.useEffect(() => {
    ref.current = studentChoices;
  }, [studentChoices]);

  React.useEffect(() => {
    /**
     * loadStudentChoiceData
     * Loads student choice data
     * @param studentId of student
     */
    const loadStudentChoiceData = async (studentId: string) => {
      setStudentChoices((studentChoices) => ({
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
        const [loadedStudentChoices] = await Promise.all([
          (async () => {
            const studentChoicesList = await hopsApi.getStudentCourseChoices({
              studentIdentifier: studentId,
            });

            return studentChoicesList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudentChoices((studentChoices) => ({
            ...studentChoices,
            isLoading: false,
            studentChoices: loadedStudentChoices,
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(err.message, "error");
          setStudentChoices((studentChoices) => ({
            ...studentChoices,
            isLoading: false,
          }));
        }
      }
    };

    loadStudentChoiceData(studentId);

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
    const onAnswerSavedAtServer = (data: StudentCourseChoice) => {
      const { studentChoices } = ref.current;

      const arrayOfStudentChoices = studentChoices;

      /**
       * Finding possible existing selection
       */
      const indexOfCourse = studentChoices.findIndex(
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

      setStudentChoices((studentChoices) => ({
        ...studentChoices,
        isLoading: false,
        studentChoices: arrayOfStudentChoices,
      }));
    };

    /**
     * Adding event callback to handle changes when ever
     * there has happened some changes with that message
     */
    websocketState.websocket.addEventCallback(
      "hops:studentchoice-updated",
      onAnswerSavedAtServer
    );

    return () => {
      /**
       * Remove callback when unmounting
       */
      websocketState.websocket.removeEventCallback(
        "hops:studentchoice-updated",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  /**
   * updateStudentChoice
   * @param params params
   */
  const updateStudentChoice = async (params: UpdateStudentChoicesParams) => {
    const { subject, courseNumber, studentId } = params;

    try {
      await hopsApi.saveStudentCourseChoices({
        studentIdentifier: studentId,
        saveStudentCourseChoicesRequest: {
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
    studentChoices,
    /**
     * updateStudentChoice
     * @param params params
     */
    updateStudentChoice: (params: UpdateStudentChoicesParams) =>
      updateStudentChoice(params),
  };
};
