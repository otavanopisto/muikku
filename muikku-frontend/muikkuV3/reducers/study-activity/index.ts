import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { CourseMatrix, StudyActivity } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * StudyActivityState
 */
export interface StudyActivityState {
  // Current logged in user's study activity (student)
  userStudyActivity: StudyActivity | null;
  userStudyActivityStatus: ReducerStateType;

  // Current logged in user's course matrix
  courseMatrix: CourseMatrix | null;
  courseMatrixStatus: ReducerStateType;

  // Current logged in user's curriculum config
  curriculumConfig: CurriculumConfig | null;
  curriculumConfigStatus: ReducerStateType;
}

const initialStudyActivityState: StudyActivityState = {
  userStudyActivity: null,
  userStudyActivityStatus: "IDLE",
  courseMatrix: null,
  courseMatrixStatus: "IDLE",
  curriculumConfig: null,
  curriculumConfigStatus: "IDLE",
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

    case "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG":
      return {
        ...state,
        curriculumConfig: action.payload,
      };
    case "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG_STATUS":
      return {
        ...state,
        curriculumConfigStatus: action.payload,
      };

    case "STUDY_ACTIVITY_RESET_STATE":
      return {
        ...initialStudyActivityState,
      };

    default:
      return state;
  }
};
