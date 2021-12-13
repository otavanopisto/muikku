import * as React from "react";
import mApi from "~/lib/mApi";
import { sleep } from "~/helper-functions/shared";
import { StudentCourseChoice } from "~/@types/shared";
import { WebsocketStateType } from "~/reducers/util/websocket";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

export interface UpdateStudentChoicesParams {
  courseNumber: number;
  subject: string;
  studentId: string;
}

/**
 * UseStudentActivityState
 */
export interface UseStudentActivityState {
  isLoading: boolean;
  studentChoices: StudentCourseChoice[];
}

/**
 * useStudentActivity
 * Custom hook to return student activity data
 */
export const useStudentChoices = (
  studentId: string,
  websocketState: WebsocketStateType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [studentChoices, setStudentChoices] =
    React.useState<UseStudentActivityState>({
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
      setStudentChoices({ ...studentChoices, isLoading: true });

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
            const studentChoicesList = (await promisify(
              mApi().hops.student.studentChoices.read(studentId),
              "callback"
            )()) as StudentCourseChoice[];

            return studentChoicesList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudentChoices({
            ...studentChoices,
            isLoading: false,
            studentChoices: loadedStudentChoices,
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Hups errori, ${err.message}`, "error");
          setStudentChoices({
            ...studentChoices,
            isLoading: false,
          });
        }
      }
    };

    loadStudentChoiceData(studentId);

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
  }, []);

  /**
   * onAnswerSavedAtServer
   * Websocket event callback to handle answer from server when
   * something is saved/changed
   * @param data Websocket data
   */
  const onAnswerSavedAtServer = (data: StudentCourseChoice) => {
    const { studentChoices } = ref.current;

    let arrayOfStudentChoices = studentChoices;

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

    setStudentChoices({
      ...studentChoices,
      isLoading: false,
      studentChoices: arrayOfStudentChoices,
    });
  };

  /**
   * updateStudentChoice
   * @param params
   */
  const updateStudentChoice = async (params: UpdateStudentChoicesParams) => {
    const { subject, courseNumber, studentId } = params;

    try {
      await promisify(
        mApi().hops.student.studentChoices.create(studentId, {
          subject: subject,
          courseNumber: courseNumber,
        }),
        "callback"
      )();
    } catch (err) {
      displayNotification(`Hups päivitys errori, ${err.message}`, "error");
    }
  };

  return {
    studentChoices,
    updateStudentChoice: (params: UpdateStudentChoicesParams) =>
      updateStudentChoice(params),
  };
};
