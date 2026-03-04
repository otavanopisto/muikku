import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { CourseMatrix, StudyActivity } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * EducationTypeStudyData
 */
export interface UserStudyData {
  educationTypeCode: string;
  studyActivity: StudyActivity | null;
  studyActivityStatus: ReducerStateType;
  courseMatrix: CourseMatrix | null;
  courseMatrixStatus: ReducerStateType;
  curriculumConfig: CurriculumConfig | null;
  curriculumConfigStatus: ReducerStateType;
}

/**
 * StudyActivityState
 */
export interface StudyActivityState {
  // Current logged in user's education types
  userEducationTypes: Record<string, string> | null;
  userEducationTypesStatus: ReducerStateType;
  // Default education type code
  defaultEducationIdentifier: string | null;
  // Selected education type code, which data is currently being displayed in the records UI
  selectedEducationIdentifier: string | null;

  // Per-education cache
  userStudyDataByUserIdentifier: Record<string, UserStudyData>;
}

const initialStudyActivityState: StudyActivityState = {
  defaultEducationIdentifier: null,
  selectedEducationIdentifier: null,
  userEducationTypes: null,
  userEducationTypesStatus: "IDLE",
  userStudyDataByUserIdentifier: {},
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
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            studyActivityStatus: action.payload.status,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY":
      return {
        ...state,
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            studyActivity: action.payload.studyActivity,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS":
      return {
        ...state,
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            studyActivity: {
              ...state.userStudyDataByUserIdentifier[
                action.payload.userIdentifier
              ]?.studyActivity,
              items: action.payload.items,
            },
          },
        },
      };

    case "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX":
      return {
        ...state,
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            courseMatrix: action.payload.courseMatrix,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS":
      return {
        ...state,
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            courseMatrixStatus: action.payload.status,
          },
        },
      };

    case "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG":
      return {
        ...state,
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            curriculumConfig: action.payload.curriculumConfig,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG_STATUS":
      return {
        ...state,
        userStudyDataByUserIdentifier: {
          ...state.userStudyDataByUserIdentifier,
          [action.payload.userIdentifier]: {
            ...state.userStudyDataByUserIdentifier[
              action.payload.userIdentifier
            ],
            curriculumConfigStatus: action.payload.status,
          },
        },
      };

    case "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPES": {
      const listOfEducationTypes = Object.entries(action.payload);

      // Initialize new education type data based on the list of education types
      const newUserStudyData = listOfEducationTypes.reduce<
        Record<string, UserStudyData>
      >((acc, [educationTypeCode, educationTypeDescription]) => {
        acc[educationTypeDescription] = {
          educationTypeCode: educationTypeCode,
          studyActivity: null,
          studyActivityStatus: "IDLE",
          courseMatrix: null,
          courseMatrixStatus: "IDLE",
          curriculumConfig: null,
          curriculumConfigStatus: "IDLE",
        };
        return acc;
      }, {});

      return {
        ...state,
        userEducationTypes: action.payload,
        userStudyDataByUserIdentifier: newUserStudyData,
      };
    }
    case "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS":
      return {
        ...state,
        userEducationTypesStatus: action.payload,
      };

    case "STUDY_ACTIVITY_UPDATE_DEFAULT_USER_IDENTIFIER":
      return {
        ...state,
        defaultEducationIdentifier: action.payload,
      };
    case "STUDY_ACTIVITY_UPDATE_SELECTED_USER_IDENTIFIER":
      return {
        ...state,
        selectedEducationIdentifier: action.payload,
      };

    case "STUDY_ACTIVITY_RESET_STATE":
      return {
        ...initialStudyActivityState,
      };

    default:
      return state;
  }
};
