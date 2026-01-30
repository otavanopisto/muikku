import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { CourseMatrix, StudyActivity } from "~/generated/client";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * StudyActivityState
 */
export interface StudyActivityState {
  // Current logged in user's study activity (student)
  userStudyActivity: StudyActivity | null;
  userStudyActivityStatus: ReducerStateType;

  courseMatrix: CourseMatrix | null;
  courseMatrixStatus: ReducerStateType;
}

const initialStudyActivityState: StudyActivityState = {
  userStudyActivity: null,
  userStudyActivityStatus: "IDLE",
  courseMatrix: null,
  courseMatrixStatus: "IDLE",
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
        userStudyActivity: {
          ...state.userStudyActivity,
          items: action.payload,
        },
      };

    case "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX":
      return {
        ...state,
        courseMatrix: action.payload,
      };
    case "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS":
      return {
        ...state,
        courseMatrixStatus: action.payload,
      };

    default:
      return state;
  }
};
