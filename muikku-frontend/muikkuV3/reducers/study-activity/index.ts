import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { StudyActivity } from "~/generated/client";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * StudyActivityState
 */
export interface StudyActivityState {
  // Current logged in user's study activity (student)
  userStudyActivity: StudyActivity | null;
  userStudyActivityStatus: ReducerStateType;
}

const initialStudyActivityState: StudyActivityState = {
  userStudyActivity: null,
  userStudyActivityStatus: "IDLE",
};

/**
 * Study activity state
 * @param state state
 * @param action action
 */
export const studyActivity: Reducer<StudyActivityState> = (
  state = initialStudyActivityState,
  action: ActionType
) => {
  switch (action.type) {
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_STATUS":
      return {
        ...state,
        userStudyActivityStatus: action.payload,
      };
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY":
      return {
        ...state,
        userStudyActivity: action.payload,
      };
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS":
      return {
        ...state,
        userStudyActivityItems: action.payload,
      };

    default:
      return state;
  }
};
