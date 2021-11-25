import * as React from "react";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import {
  updateSuggestion,
  UpdateSuggestionParams,
} from "../../suggestion-list/handlers/handlers";
import { WebsocketStateType } from "../../../../../../../../reducers/util/websocket";
import { sleep } from "~/helper-functions/shared";
import {
  CourseStatus,
  StudentActivityByStatus,
  StudentActivityCourse,
} from "~/@types/shared";

/**
 * UseStudentActivityState
 */
export interface UseStudentActivityState extends StudentActivityByStatus {
  isLoading: boolean;
}

/**
 * useStudentActivity
 * Custom hook to return student activity data
 */
export const useStudentActivity = (
  studentId: string,
  websocketState: WebsocketStateType
) => {
  const [studentActivity, setStudentActivity] =
    React.useState<UseStudentActivityState>({
      isLoading: true,
      onGoingList: [],
      transferedList: [],
      gradedList: [],
      suggestedNextList: [],
      suggestedOptionalList: [],
    });

  /**
   * State ref to containging studentActivity state data
   * when ever student activity state changes, so does this ref
   * This is because when websocket handler catches, it always have latest
   * state changes to use
   */
  const ref = React.useRef(studentActivity);

  React.useEffect(() => {
    ref.current = studentActivity;
  }, [studentActivity]);

  React.useEffect(() => {
    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param studentId
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setStudentActivity({ ...studentActivity, isLoading: true });

      /**
       * Sleeper to delay data fetching if it happens faster than 1s
       */
      const sleepPromise = await sleep(1000);

      const [loadedStudentActivity] = await Promise.all([
        (async () => {
          const studentActivityList = (await promisify(
            mApi().hops.student.studyActivity.read(studentId),
            "callback"
          )()) as StudentActivityCourse[];

          const studentActivityByStatus = filterActivity(studentActivityList);

          return studentActivityByStatus;
        })(),
        sleepPromise,
      ]);

      setStudentActivity({
        ...studentActivity,
        isLoading: false,
        suggestedNextList: loadedStudentActivity.suggestedNextList,
        suggestedOptionalList: loadedStudentActivity.suggestedOptionalList,
        onGoingList: loadedStudentActivity.onGoingList,
        gradedList: loadedStudentActivity.gradedList,
        transferedList: loadedStudentActivity.transferedList,
      });
    };

    loadStudentActivityListData(studentId);
  }, [studentId]);

  React.useEffect(() => {
    console.log(studentActivity);

    /**
     * Adding event callback to handle changes when ever
     * there has happened some changes with that message
     */
    websocketState.websocket.addEventCallback(
      "hops:workspace-suggested",
      onAnswerSavedAtServer
    );

    return () => {
      /**
       * Remove callback when unmounting
       */
      websocketState.websocket.removeEventCallback(
        "hops:workspace-suggested",
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
  const onAnswerSavedAtServer = (data: StudentActivityCourse) => {
    console.log("stateref", ref.current);
    console.log("data", data);

    const {
      suggestedNextList,
      suggestedOptionalList,
      onGoingList,
      gradedList,
      transferedList,
    } = ref.current;

    /**
     * Concated list of different filter lists together
     */
    let arrayOfStudentActivityCourses: StudentActivityCourse[] = [].concat(
      suggestedNextList,
      suggestedOptionalList,
      onGoingList,
      gradedList,
      transferedList
    );

    /**
     * If course id is null, meaning that delete existing activity course by
     * filtering everything else out which subject and courseNumber don't match
     */
    if (data.courseId === null) {
      arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.filter(
        (aCourse) =>
          aCourse.subject !== data.subject &&
          aCourse.courseNumber !== data.courseNumber
      );
    } else {
      /**
       * Else we are replacing suggestion with another or just adding new alltogether
       */

      /**
       * Index of existing course
       */
      const indexOfCourse = arrayOfStudentActivityCourses.findIndex(
        (aCourse) =>
          aCourse.courseNumber === data.courseNumber &&
          aCourse.subject === data.subject
      );

      /**
       * Replace
       */
      if (indexOfCourse !== -1) {
        arrayOfStudentActivityCourses.splice(indexOfCourse, 1, data);
      } else {
        /**
         * Add new
         */
        arrayOfStudentActivityCourses.push(data);
      }
    }

    /**
     * Filtered activity courses by status
     */
    const studentActivityByStatus = filterActivity(
      arrayOfStudentActivityCourses
    );

    setStudentActivity({
      ...studentActivity,
      isLoading: false,
      suggestedNextList: studentActivityByStatus.suggestedNextList,
      suggestedOptionalList: studentActivityByStatus.suggestedOptionalList,
      onGoingList: studentActivityByStatus.onGoingList,
      gradedList: studentActivityByStatus.gradedList,
      transferedList: studentActivityByStatus.transferedList,
    });
  };

  return {
    studentActivity,
    updateSuggestion: (params: UpdateSuggestionParams) =>
      updateSuggestion(params),
  };
};

/**
 * filterActivity
 * @param list of studentactivity courses
 * @returns Object containing lists filttered by status.
 * Lists are Ongoing, Suggested next, Suggested optional, Transfered and graded
 */
const filterActivity = (
  list: StudentActivityCourse[]
): StudentActivityByStatus => {
  const onGoingList = list.filter(
    (item) => item.status === CourseStatus.ONGOING
  );
  const suggestedNextList = list.filter(
    (item) => item.status === CourseStatus.SUGGESTED_NEXT
  );
  const suggestedOptionalList = list.filter(
    (item) => item.status === CourseStatus.SUGGESTED_OPTIONAL
  );

  const transferedList = list.filter(
    (item) => item.status === CourseStatus.TRANSFERRED
  );
  const gradedList = list.filter((item) => item.status === CourseStatus.GRADED);

  return {
    onGoingList,
    suggestedNextList,
    suggestedOptionalList,
    transferedList,
    gradedList,
  };
};
