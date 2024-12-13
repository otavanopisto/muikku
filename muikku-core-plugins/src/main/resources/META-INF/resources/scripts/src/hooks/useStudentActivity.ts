import * as React from "react";
import { sleep } from "~/helper-functions/shared";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { StudentActivityByStatus } from "~/@types/shared";
import MApi, { isMApiError } from "~/api/api";
import { StudentStudyActivity } from "~/generated/client";

export const SKILL_AND_ART_SUBJECTS: string[] = ["mu", "li", "ks", "ku", "ko"];

export const OTHER_SUBJECT_OUTSIDE_HOPS: string[] = ["MUU"];

export const LANGUAGE_SUBJECTS: string[] = ["rab", "sab", "eab2", "lab"];

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
 * UseStudentActivityState
 */
export interface UseStudentActivityState extends StudentActivityByStatus {
  isLoading: boolean;
}

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to return student activity data
 * @param studentId studentId
 * @param websocketState websocketState
 * @param displayNotification displayNotification
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
      skillsAndArt: {},
      otherLanguageSubjects: {},
      otherSubjects: {},
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
      setStudentActivity((studentActivity) => ({
        ...studentActivity,
        isLoading: true,
      }));

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
            const studentActivityList = await hopsApi.getStudentStudyActivity({
              studentIdentifier: studentId,
            });

            const skillAndArtCourses = filterActivityBySubjects(
              SKILL_AND_ART_SUBJECTS,
              studentActivityList
            );

            const otherLanguageSubjects = filterActivityBySubjects(
              LANGUAGE_SUBJECTS,
              studentActivityList
            );

            const otherSubjects = filterActivityBySubjects(
              OTHER_SUBJECT_OUTSIDE_HOPS,
              studentActivityList
            );

            const studentActivityByStatus = filterActivity(studentActivityList);

            return {
              otherSubjects: otherSubjects,
              otherLanguageSubjects: otherLanguageSubjects,
              skillAndArtCourses: skillAndArtCourses,
              studentActivityByStatus: studentActivityByStatus,
            };
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudentActivity((studentActivity) => ({
            ...studentActivity,
            isLoading: false,
            suggestedNextList:
              loadedStudentActivity.studentActivityByStatus.suggestedNextList,
            onGoingList:
              loadedStudentActivity.studentActivityByStatus.onGoingList,
            gradedList:
              loadedStudentActivity.studentActivityByStatus.gradedList,
            transferedList:
              loadedStudentActivity.studentActivityByStatus.transferedList,
            skillsAndArt: { ...loadedStudentActivity.skillAndArtCourses },
            otherLanguageSubjects: {
              ...loadedStudentActivity.otherLanguageSubjects,
            },
            otherSubjects: { ...loadedStudentActivity.otherSubjects },
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(err.message, "error");
          setStudentActivity((studentActivity) => ({
            ...studentActivity,
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
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (
      data: StudentStudyActivity & { studentIdentifier: string }
    ) => {
      const { suggestedNextList, onGoingList, gradedList, transferedList } =
        ref.current;

      /**
       * Concated list of different suggestions
       */
      let arrayOfStudentActivityCourses: StudentStudyActivity[] = [].concat(
        suggestedNextList
      );

      /**
       * If course id is null, meaning that delete existing activity course by
       * finding that specific course with subject code and course number and splice it out
       */
      if (data.courseId) {
        const indexOfCourse = arrayOfStudentActivityCourses.findIndex(
          (item) => item.courseId === data.courseId
        );

        if (indexOfCourse !== -1) {
          arrayOfStudentActivityCourses.splice(indexOfCourse, 1);
        } else {
          /**
           * Add new
           */
          arrayOfStudentActivityCourses.push(data);
        }
      }

      /**
       * After possible suggestion checking is done, then concat other lists also
       */
      arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.concat(
        onGoingList,
        gradedList,
        transferedList
      );

      const skillAndArtCourses = filterActivityBySubjects(
        SKILL_AND_ART_SUBJECTS,
        arrayOfStudentActivityCourses
      );

      const otherLanguageSubjects = filterActivityBySubjects(
        LANGUAGE_SUBJECTS,
        arrayOfStudentActivityCourses
      );

      const otherSubjects = filterActivityBySubjects(
        OTHER_SUBJECT_OUTSIDE_HOPS,
        arrayOfStudentActivityCourses
      );

      /**
       * Filtered activity courses by status
       */
      const studentActivityByStatus = filterActivity(
        arrayOfStudentActivityCourses
      );

      setStudentActivity((studentActivity) => ({
        ...studentActivity,
        isLoading: false,
        suggestedNextList: studentActivityByStatus.suggestedNextList,
        onGoingList: studentActivityByStatus.onGoingList,
        gradedList: studentActivityByStatus.gradedList,
        transferedList: studentActivityByStatus.transferedList,
        skillsAndArt: { ...skillAndArtCourses },
        otherLanguageSubjects: { ...otherLanguageSubjects },
        otherSubjects: { ...otherSubjects },
      }));
    };

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
  }, [websocketState.websocket]);

  /**
   * updateSuggestion
   * @param params params
   */
  const updateSuggestionForNext = async (params: UpdateSuggestionParams) => {
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
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(`Update add suggestion:, ${err.message}`, "error");
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

        displayNotification(
          `Update remove suggestion:, ${err.message}`,
          "error"
        );
      }
    }
  };

  return {
    studentActivity,
    /**
     * updateSuggestion
     * @param params params
     */
    updateSuggestionNext: (params: UpdateSuggestionParams) =>
      updateSuggestionForNext(params),
  };
};

/**
 * filterActivity
 * @param list of studentactivity courses
 * @returns Object containing lists filttered by status.
 * Lists are Ongoing, Suggested next, Suggested optional, Transfered and graded
 */
const filterActivity = (
  list: StudentStudyActivity[]
): Omit<
  StudentActivityByStatus,
  "skillsAndArt" | "otherLanguageSubjects" | "otherSubjects"
> => {
  const onGoingList = list.filter((item) => item.status === "ONGOING");
  const suggestedNextList = list.filter(
    (item) => item.status === "SUGGESTED_NEXT"
  );

  const transferedList = list.filter((item) => item.status === "TRANSFERRED");
  const gradedList = list.filter((item) => item.status === "GRADED");

  return {
    onGoingList,
    suggestedNextList,
    transferedList,
    gradedList,
  };
};

/**
 * filterSkillAndArtSubject
 * @param subjectsList of studentactivity courses
 * @param list of studentactivity courses
 */
const filterActivityBySubjects = (
  subjectsList: string[],
  list: StudentStudyActivity[]
) =>
  subjectsList.reduce(
    (a, v) => ({
      ...a,
      [v]: list
        .filter((c) => c.subject === v)
        .sort((a, b) => a.courseNumber - b.courseNumber),
    }),
    {}
  );
