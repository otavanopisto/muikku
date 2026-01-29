import {
  CourseMatrix,
  StudyActivity,
  StudyActivityItem,
} from "~/generated/client";
import { AnyActionType, SpecificActionType } from "..";
import { ReducerStateType } from "~/reducers/study-activity";
import { Action, Dispatch } from "redux";
import { StateType } from "~/reducers";
import MApi, { isMApiError } from "~/api/api";

const hopsApi = MApi.getHopsApi();

// user study activity status actions types

export type STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
    ReducerStateType
  >;

export type STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY",
  StudyActivity
>;

export type STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS",
    StudyActivityItem[]
  >;

export type STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
  ReducerStateType
>;

export type STUDY_ACTIVITY_UPDATE_COURSE_MATRIX = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX",
  CourseMatrix
>;

// STUDYACTIVITY

/**
 * Load user study activity trigger type
 */
export interface LoadUserStudyActivityTriggerType {
  (data: {
    userIdentifier?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * Update user study activity items trigger type
 */
export interface UpdateUserStudyActivityItemsTriggerType {
  (data: {
    courseId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

// COURSE MATRIX

/**
 * Load course matrix trigger type
 */
export interface LoadCourseMatrixTriggerType {
  (data: {
    userIdentifier?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

// WEBSOCKET UPDATERS

/**
 * Study activity workspace suggested websocket trigger type
 */
export interface StudyActivityWorkspaceSuggestedWebsocketTriggerType {
  (data: {
    websocketData: {
      id: number;
      name: string;
      subject: string;
      courseNumber: number;
      status: string;
      description: string | null;
      courseId: number;
      created: string;
      studentIdentifier: string;
    };
  }): AnyActionType;
}

/**
 * Study activity workspace signup websocket trigger type
 */
export interface StudyActivityWorkspaceSignupWebsocketTriggerType {
  (data: { websocketData: StudyActivityItem[] }): AnyActionType;
}

/**
 * Load user study activity thunk function
 * @param data data
 */
const loadUserStudyActivity: LoadUserStudyActivityTriggerType =
  function loadUserStudyActivity(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { userIdentifier, onSuccess, onFail } = data;
      const state = getState();

      const hasPermissions =
        state.status.userSchoolDataIdentifier.startsWith("PYRAMUS-STUDENT-") ||
        state.status.userSchoolDataIdentifier.startsWith(
          "PYRAMUS-STUDENTPARENT-"
        );

      if (!hasPermissions) {
        return;
      }

      if (
        state.studyActivity.userStudyActivityStatus === "READY" ||
        state.studyActivity.userStudyActivityStatus === "LOADING"
      ) {
        return;
      }

      const identifierToUse = userIdentifier
        ? userIdentifier
        : state.status.userSchoolDataIdentifier;

      if (!identifierToUse.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error(`Invalid student identifier ${identifierToUse}`);
      }

      try {
        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
          payload: "LOADING",
        });

        const studyActivity = await hopsApi.getStudyActivity({
          studentIdentifier: identifierToUse,
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
          payload: "READY",
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY",
          payload: studyActivity,
        });

        onSuccess?.();
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
        }
        onFail?.();
        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Load course matrix thunk function
 * @param data data
 */
const loadCourseMatrix: LoadCourseMatrixTriggerType = function loadCourseMatrix(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const { userIdentifier, onSuccess, onFail } = data;
    const state = getState();

    const hasPermissions =
      state.status.userSchoolDataIdentifier.startsWith("PYRAMUS-STUDENT-") ||
      state.status.userSchoolDataIdentifier.startsWith(
        "PYRAMUS-STUDENTPARENT-"
      );

    if (!hasPermissions) {
      return;
    }

    if (
      state.studyActivity.courseMatrixStatus === "READY" ||
      state.studyActivity.courseMatrixStatus === "LOADING"
    ) {
      return;
    }

    const identifierToUse = userIdentifier
      ? userIdentifier
      : state.status.userSchoolDataIdentifier;

    if (!identifierToUse.startsWith("PYRAMUS-STUDENT-")) {
      throw new Error(`Invalid student identifier ${identifierToUse}`);
    }

    try {
      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
        payload: "LOADING",
      });

      const courseMatrix = await hopsApi.getStudentCourseMatrix({
        studentIdentifier: identifierToUse,
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
        payload: "READY",
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX",
        payload: courseMatrix,
      });

      onSuccess?.();
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }
      onFail?.();
      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
        payload: "ERROR",
      });
    }
  };
};

/**
 * Study activity workspace suggested websocket thunk
 * @param data data
 */
const studyActivityWorkspaceSuggestedWebsocket: StudyActivityWorkspaceSuggestedWebsocketTriggerType =
  function studyActivityWorkspaceSuggestedWebsocket(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { websocketData } = data;
      const state = getState();

      const hasPermissions =
        state.status.userSchoolDataIdentifier.startsWith("PYRAMUS-STUDENT-") ||
        state.status.userSchoolDataIdentifier.startsWith(
          "PYRAMUS-STUDENTPARENT-"
        );

      if (!hasPermissions) {
        return;
      }

      if (state.studyActivity.userStudyActivityStatus !== "READY") {
        return;
      }

      if (!websocketData.courseId) {
        return;
      }

      const updatedStudyActivityByWorkspaceId = await hopsApi.getStudyActivity({
        studentIdentifier: state.status.userSchoolDataIdentifier,
        workspaceEntityId: websocketData.courseId,
      });

      // If no items, meaning that delete existing activity course by
      // finding that specific course with subject code and course number and splice it out
      // It is possible that there are multiple items with the same courseId, so we need to remove all of them
      if (updatedStudyActivityByWorkspaceId.items.length === 0) {
        let updatedStudyActivityItems: StudyActivityItem[] = [].concat(
          state.studyActivity.userStudyActivity.items
        );

        updatedStudyActivityItems = updatedStudyActivityItems.filter(
          (item) => item.courseId !== websocketData.courseId
        );

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS",
          payload: updatedStudyActivityItems,
        });
      } else {
        // If there are items, meaning that add new activity course or update existing activity course
        // If there are multiple items with the same courseId, we need to update all of them
        const updatedStudyActivityItems: StudyActivityItem[] = [].concat(
          state.studyActivity.userStudyActivity.items
        );

        // Loop through all items and update matching items or add as new
        updatedStudyActivityByWorkspaceId.items.forEach((item) => {
          const indexOfItem = updatedStudyActivityItems.findIndex(
            (i) => i.courseId === item.courseId && i.subject === item.subject
          );

          if (indexOfItem !== -1) {
            updatedStudyActivityItems[indexOfItem] = item;
          } else {
            updatedStudyActivityItems.push(item);
          }
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS",
          payload: updatedStudyActivityItems,
        });
      }
    };
  };

/**
 * Study activity workspace signup websocket thunk
 * @param data data
 */
const studyActivityWorkspaceSignupWebsocket: StudyActivityWorkspaceSignupWebsocketTriggerType =
  function studyActivityWorkspaceSignupWebsocket(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { websocketData } = data;

      const state = getState();

      const hasPermissions =
        state.status.userSchoolDataIdentifier.startsWith("PYRAMUS-STUDENT-") ||
        state.status.userSchoolDataIdentifier.startsWith(
          "PYRAMUS-STUDENTPARENT-"
        );

      if (!hasPermissions) {
        return;
      }

      if (state.studyActivity.userStudyActivityStatus !== "READY") {
        return;
      }

      const updatedStudyActivityItems: StudyActivityItem[] = [].concat(
        state.studyActivity.userStudyActivity.items
      );

      websocketData.forEach((item) => {
        const indexOfItem = updatedStudyActivityItems.findIndex(
          (i) => i.courseId === item.courseId && i.subject === item.subject
        );

        if (indexOfItem !== -1) {
          updatedStudyActivityItems[indexOfItem] = item;
        } else {
          updatedStudyActivityItems.push(item);
        }
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS",
        payload: updatedStudyActivityItems,
      });
    };
  };
export {
  loadUserStudyActivity,
  loadCourseMatrix,

  // WEBSOCKET UPDATERS
  studyActivityWorkspaceSuggestedWebsocket,
  studyActivityWorkspaceSignupWebsocket,
};
