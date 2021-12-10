import * as React from "react";
import mApi from "~/lib/mApi";
import { sleep } from "~/helper-functions/shared";
import { WebsocketStateType } from "~/reducers/util/websocket";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  CourseStatus,
  StudentActivityByStatus,
  StudentActivityCourse,
} from "~/@types/shared";

/**
 * UpdateSuggestionParams
 */
export interface UpdateSuggestionParams {
  goal: "add" | "remove";
  courseNumber: number;
  subjectCode: string;
  suggestionId?: number;
  studentId: string;
  type: "OPTIONAL" | "NEXT";
}

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
  websocketState: WebsocketStateType,
  displayNotification: DisplayNotificationTriggerType
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

  const componentMounted = React.useRef(true);

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
     * @param studentId of student
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setStudentActivity({ ...studentActivity, isLoading: true });

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded and filtered student activity
         */
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

        if (componentMounted.current) {
          setStudentActivity({
            ...studentActivity,
            isLoading: false,
            suggestedNextList: loadedStudentActivity.suggestedNextList,
            suggestedOptionalList: loadedStudentActivity.suggestedOptionalList,
            onGoingList: loadedStudentActivity.onGoingList,
            gradedList: loadedStudentActivity.gradedList,
            transferedList: loadedStudentActivity.transferedList,
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Hups errori, ${err.message}`, "error");
          setStudentActivity({
            ...studentActivity,
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
     * finding that specific course with subject code and course number and splice it out
     */
    if (data.courseId === null) {
      const indexOfCourse = arrayOfStudentActivityCourses.findIndex(
        (item) =>
          item.subject === data.subject &&
          item.courseNumber === data.courseNumber
      );

      if (indexOfCourse !== -1) {
        arrayOfStudentActivityCourses.splice(indexOfCourse, 1);
      }
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

  /**
   * updateSuggestion
   * @param params
   */
  const updateSuggestion = async (params: UpdateSuggestionParams) => {
    const { goal, type, suggestionId, subjectCode, courseNumber, studentId } =
      params;

    if (goal === "add") {
      console.log("lisätään");
      try {
        await promisify(
          mApi().hops.student.toggleSuggestion.create(studentId, {
            id: suggestionId,
            subject: subjectCode,
            courseNumber: courseNumber,
            type: type,
          }),
          "callback"
        )();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("poistetaan");
      try {
        await promisify(
          mApi().hops.student.toggleSuggestion.create(studentId, {
            subject: subjectCode,
            courseNumber: courseNumber,
            type: type,
          }),
          "callback"
        )();
      } catch (error) {
        console.error(error);
      }
    }
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
