import {
  CourseMatrix,
  StudyActivity,
  StudyActivityItem,
} from "~/generated/client";
import { AnyActionType, SpecificActionType } from "..";
import { ReducerStatusType } from "~/reducers/types";
import { Action, Dispatch } from "redux";
import { StateType } from "~/reducers";
import MApi, { isMApiError } from "~/api/api";
import {
  CurriculumConfig,
  getCurriculumConfig,
} from "~/util/curriculum-config";

const hopsApi = MApi.getHopsApi();
const userApi = MApi.getUserApi();

// user study activity status actions types

export type STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
    { key: string; status: ReducerStatusType }
  >;

export type STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY",
  { key: string; studyActivity: StudyActivity }
>;

export type STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS",
    { key: string; items: StudyActivityItem[] }
  >;

export type STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
  { key: string; status: ReducerStatusType }
>;

export type STUDY_ACTIVITY_UPDATE_COURSE_MATRIX = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX",
  { key: string; courseMatrix: CourseMatrix }
>;

export type STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG_STATUS = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG_STATUS",
  { key: string; status: ReducerStatusType }
>;

export type STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG",
  { key: string; curriculumConfig: CurriculumConfig }
>;

export type STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPES = SpecificActionType<
  "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPES",
  string[]
>;

export type STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS",
    ReducerStatusType
  >;

export type STUDY_ACTIVITY_UPDATE_DEFAULT_EDUCATION_TYPE_CODE =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_DEFAULT_EDUCATION_TYPE_CODE",
    string
  >;

export type STUDY_ACTIVITY_UPDATE_SELECTED_EDUCATION_TYPE_CODE =
  SpecificActionType<
    "STUDY_ACTIVITY_UPDATE_SELECTED_EDUCATION_TYPE_CODE",
    string
  >;

export type STUDY_ACTIVITY_RESET_STATE = SpecificActionType<
  "STUDY_ACTIVITY_RESET_STATE",
  undefined
>;

// STUDYACTIVITY

/**
 * Load user study activity trigger type
 */
export interface LoadUserStudyActivityTriggerType {
  (data: {
    educationTypeCode?: string;
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
    educationTypeCode?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

// EDUCATION TYPES

/**
 * Load user education types trigger type
 */
export interface LoadUserEducationTypesTriggerType {
  (data: {
    userIdentifier?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * Update selected education identifier trigger type
 */
export interface UpdateSelectedEducationTypeCodeTriggerType {
  (data: { educationTypeCode: string }): AnyActionType;
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
 * Reset study activity state trigger type
 */
export interface ResetStudyActivityStateTriggerType {
  (): AnyActionType;
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
      const { educationTypeCode, onSuccess, onFail } = data;
      const state = getState();

      const identifierToUse = state.status.userSchoolDataIdentifier;

      const hasPermissions = identifierToUse.startsWith("PYRAMUS-STUDENT-");

      if (!hasPermissions) {
        return;
      }

      const entry =
        state.studyActivity.userStudyDataByEducationTypeCode[educationTypeCode];

      if (!entry || entry.studyActivityStatus !== "IDLE") {
        return;
      }

      try {
        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
          payload: { key: educationTypeCode, status: "LOADING" },
        });

        const studyActivity = await hopsApi.getStudyActivity({
          studentIdentifier: identifierToUse,
          educationTypeCode: educationTypeCode,
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
          payload: { key: educationTypeCode, status: "READY" },
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY",
          payload: {
            key: educationTypeCode,
            studyActivity: studyActivity,
          },
        });

        onSuccess?.();
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
        }
        onFail?.();
        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS",
          payload: { key: educationTypeCode, status: "ERROR" },
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
    const { educationTypeCode, onSuccess, onFail } = data;
    const state = getState();

    const identifierToUse = state.status.userSchoolDataIdentifier;

    const hasPermissions = identifierToUse.startsWith("PYRAMUS-STUDENT-");

    if (!hasPermissions) {
      return;
    }

    const entry =
      state.studyActivity.userStudyDataByEducationTypeCode[educationTypeCode];

    if (!entry || entry.courseMatrixStatus !== "IDLE") {
      return;
    }

    try {
      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
        payload: { key: educationTypeCode, status: "LOADING" },
      });

      const courseMatrix = await hopsApi.getStudentCourseMatrix({
        studentIdentifier: identifierToUse,
        educationTypeCode: educationTypeCode,
      });

      const curriculumConfig = getCurriculumConfig(
        courseMatrix.type,
        courseMatrix
      );

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
        payload: { key: educationTypeCode, status: "READY" },
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX",
        payload: { key: educationTypeCode, courseMatrix: courseMatrix },
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG",
        payload: {
          key: educationTypeCode,
          curriculumConfig: curriculumConfig,
        },
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG_STATUS",
        payload: { key: educationTypeCode, status: "READY" },
      });

      onSuccess?.();
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }
      onFail?.();
      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS",
        payload: { key: educationTypeCode, status: "ERROR" },
      });
    }
  };
};

/**
 * Load user education types thunk function
 * @param data data
 */
const loadUserEducationTypes: LoadUserEducationTypesTriggerType =
  function loadUserEducationTypes(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { onSuccess, onFail } = data;
      const state = getState();

      if (
        state.studyActivity.userEducationTypesStatus === "READY" ||
        state.studyActivity.userEducationTypesStatus === "LOADING"
      ) {
        return;
      }

      const identifierToUse = state.status.userSchoolDataIdentifier;
      const educationTypeCodeToUse = state.status.profile.educationTypeCode;

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_DEFAULT_EDUCATION_TYPE_CODE",
        payload: educationTypeCodeToUse,
      });

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_SELECTED_EDUCATION_TYPE_CODE",
        payload: educationTypeCodeToUse,
      });

      try {
        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS",
          payload: "LOADING",
        });

        const educationTypes = await userApi.getStudentEducationTypes({
          studentIdentifier: identifierToUse,
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPES",
          payload: educationTypes,
        });

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS",
          payload: "READY",
        });

        onSuccess?.();
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
        }
        onFail?.();
        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Update selected education identifier thunk action creator
 * This action creator will update the selected education identifier and load the user study activity and course matrix
 * @param data data
 */
const updateSelectedEducationTypeCode: UpdateSelectedEducationTypeCodeTriggerType =
  function updateSelectedEducationTypeCode(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { educationTypeCode } = data;

      dispatch({
        type: "STUDY_ACTIVITY_UPDATE_SELECTED_EDUCATION_TYPE_CODE",
        payload: educationTypeCode,
      });

      dispatch(
        loadUserStudyActivity({
          educationTypeCode,
        })
      );
      dispatch(
        loadCourseMatrix({
          educationTypeCode,
        })
      );
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

      const identifierToUse = state.status.userSchoolDataIdentifier;

      const hasPermissions = identifierToUse.startsWith("PYRAMUS-STUDENT-");

      if (!hasPermissions) {
        return;
      }

      const defaultEducationTypeCode =
        state.studyActivity.defaultEducationTypeCode;

      const entry =
        state.studyActivity.userStudyDataByEducationTypeCode[
          defaultEducationTypeCode
        ];

      if (entry?.studyActivityStatus !== "READY") {
        return;
      }

      if (!websocketData.courseId) {
        return;
      }

      const updatedStudyActivityByWorkspaceId = await hopsApi.getStudyActivity({
        studentIdentifier: identifierToUse,
        workspaceEntityId: websocketData.courseId,
        educationTypeCode: defaultEducationTypeCode,
      });

      // If no items, meaning that delete existing activity course by
      // finding that specific course with subject code and course number and splice it out
      // It is possible that there are multiple items with the same courseId, so we need to remove all of them
      if (updatedStudyActivityByWorkspaceId.items.length === 0) {
        let updatedStudyActivityItems: StudyActivityItem[] = [].concat(
          entry?.studyActivity?.items ?? []
        );

        updatedStudyActivityItems = updatedStudyActivityItems.filter(
          (item) => item.courseId !== websocketData.courseId
        );

        dispatch({
          type: "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS",
          payload: {
            key: defaultEducationTypeCode,
            items: updatedStudyActivityItems,
          },
        });
      } else {
        // If there are items, meaning that add new activity course or update existing activity course
        // If there are multiple items with the same courseId, we need to update all of them
        const updatedStudyActivityItems: StudyActivityItem[] = [].concat(
          entry?.studyActivity?.items ?? []
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
          payload: {
            key: defaultEducationTypeCode,
            items: updatedStudyActivityItems,
          },
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

      const identifierToUse = state.status.userSchoolDataIdentifier;

      const hasPermissions = identifierToUse.startsWith("PYRAMUS-STUDENT-");

      if (!hasPermissions) {
        return;
      }

      const defaultEducationTypeCode =
        state.studyActivity.defaultEducationTypeCode;

      const entry =
        state.studyActivity.userStudyDataByEducationTypeCode[
          defaultEducationTypeCode
        ];

      if (entry?.studyActivityStatus !== "READY") {
        return;
      }

      const updatedStudyActivityItems: StudyActivityItem[] = [].concat(
        entry?.studyActivity?.items ?? []
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
        payload: {
          key: defaultEducationTypeCode,
          items: updatedStudyActivityItems,
        },
      });
    };
  };

/**
 * Reset study activity state thunk function
 */
const resetStudyActivityState: ResetStudyActivityStateTriggerType =
  function resetStudyActivityState() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "STUDY_ACTIVITY_RESET_STATE",
        payload: undefined,
      });
    };
  };

export {
  loadUserStudyActivity,
  loadCourseMatrix,
  loadUserEducationTypes,
  updateSelectedEducationTypeCode,

  // WEBSOCKET UPDATERS
  studyActivityWorkspaceSuggestedWebsocket,
  studyActivityWorkspaceSignupWebsocket,

  // RESET STATE
  resetStudyActivityState,
};
