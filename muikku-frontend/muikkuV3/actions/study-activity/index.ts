import { StudyActivity, StudyActivityItem } from "~/generated/client";
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

      if (!state.status.isStudent) {
        return;
      }
      if (state.studyActivity.userStudyActivityStatus === "READY") {
        return;
      }

      const identifierToUse = userIdentifier
        ? userIdentifier
        : state.status.userSchoolDataIdentifier;

      try {
        const studyActivity = await hopsApi.getStudyActivity({
          studentIdentifier: identifierToUse,
        });

        console.log("studyActivity new", studyActivity);

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
 * Update user study activity items thunk function
 * @param data data
 */
const updateUserStudyActivityItems: UpdateUserStudyActivityItemsTriggerType =
  function updateUserStudyActivityItems(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      //const { courseId, onSuccess, onFail } = data;
      //const state = getState();
    };
  };

export { loadUserStudyActivity, updateUserStudyActivityItems };
