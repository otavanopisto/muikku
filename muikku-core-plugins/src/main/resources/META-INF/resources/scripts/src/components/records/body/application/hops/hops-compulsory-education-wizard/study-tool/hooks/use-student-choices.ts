import * as React from "react";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { WebsocketStateType } from "../../../../../../../../reducers/util/websocket";
import { sleep } from "~/helper-functions/shared";
import { StudentActivityCourse, StudentCourseChoice } from "~/@types/shared";
import {
  UpdateStudentChoicesParams,
  updateStudentChoice,
} from "../handlers/handlers";

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
  websocketState: WebsocketStateType
) => {
  const [studentChoices, setStudentChoices] =
    React.useState<UseStudentActivityState>({
      isLoading: true,
      studentChoices: [],
    });

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
     * loadStudentActivityListData
     * Loads student activity data
     * @param studentId
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setStudentChoices({ ...studentChoices, isLoading: true });

      /**
       * Sleeper to delay data fetching if it happens faster than 1s
       */
      const sleepPromise = await sleep(1000);

      const [loadedStudentActivity] = await Promise.all([
        (async () => {
          const studentActivityList = (await promisify(
            mApi().hops.student.studentChoices.read(studentId),
            "callback"
          )()) as StudentCourseChoice[];

          return studentActivityList;
        })(),
        sleepPromise,
      ]);

      setStudentChoices({
        ...studentChoices,
        isLoading: false,
        studentChoices: loadedStudentActivity,
      });
    };

    loadStudentActivityListData(studentId);
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
    console.log("stateref", ref.current);
    console.log("data", data);

    const { studentChoices } = ref.current;

    let arrayOfStudentChoices = studentChoices;

    const indexOfCourse = studentChoices.findIndex(
      (sItem) =>
        sItem.subject === data.subject &&
        sItem.courseNumber === data.courseNumber
    );

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

  return {
    studentChoices,
    updateStudentChoice: (params: UpdateStudentChoicesParams) =>
      updateStudentChoice(params),
  };
};
