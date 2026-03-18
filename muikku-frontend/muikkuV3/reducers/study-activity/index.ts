import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { CourseMatrix, StudyActivity } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * EducationTypeStudyData
 */
export interface UserStudyData {
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
  userEducationTypes: string[];
  userEducationTypesStatus: ReducerStateType;
  // Default education type code
  defaultEducationTypeCode: string | null;
  // Selected education type code, which data is currently being displayed in the records UI
  selectedEducationTypeCode: string | null;

  // Per-education cache
  userStudyDataByEducationTypeCode: Record<string, UserStudyData>;
}

const initialStudyActivityState: StudyActivityState = {
  defaultEducationTypeCode: null,
  selectedEducationTypeCode: null,
  userEducationTypes: null,
  userEducationTypesStatus: "IDLE",
  userStudyDataByEducationTypeCode: {},
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
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            studyActivityStatus: action.payload.status,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY":
      return {
        ...state,
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            studyActivity: action.payload.studyActivity,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_USER_STUDY_ACTIVITY_ITEMS":
      return {
        ...state,
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            studyActivity: {
              ...state.userStudyDataByEducationTypeCode[action.payload.key]
                ?.studyActivity,
              items: action.payload.items,
            },
          },
        },
      };

    case "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX":
      return {
        ...state,
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            courseMatrix: action.payload.courseMatrix,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_COURSE_MATRIX_STATUS":
      return {
        ...state,
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            courseMatrixStatus: action.payload.status,
          },
        },
      };

    case "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG":
      return {
        ...state,
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            curriculumConfig: action.payload.curriculumConfig,
          },
        },
      };
    case "STUDY_ACTIVITY_UPDATE_CURRICULUM_CONFIG_STATUS":
      return {
        ...state,
        userStudyDataByEducationTypeCode: {
          ...state.userStudyDataByEducationTypeCode,
          [action.payload.key]: {
            ...state.userStudyDataByEducationTypeCode[action.payload.key],
            curriculumConfigStatus: action.payload.status,
          },
        },
      };

    case "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPES": {
      // Initialize new education type data based on the list of education types
      const newUserStudyData = action.payload.reduce<
        Record<string, UserStudyData>
      >((acc, educationTypeCode) => {
        acc[educationTypeCode] = {
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
        userStudyDataByEducationTypeCode: newUserStudyData,
      };
    }
    case "STUDY_ACTIVITY_UPDATE_USER_EDUCATION_TYPE_STATUS":
      return {
        ...state,
        userEducationTypesStatus: action.payload,
      };

    case "STUDY_ACTIVITY_UPDATE_DEFAULT_EDUCATION_TYPE_CODE":
      return {
        ...state,
        defaultEducationTypeCode: action.payload,
      };

    case "STUDY_ACTIVITY_UPDATE_SELECTED_EDUCATION_TYPE_CODE":
      return {
        ...state,
        selectedEducationTypeCode: action.payload,
      };

    case "STUDY_ACTIVITY_RESET_STATE":
      return {
        ...initialStudyActivityState,
      };

    default:
      return state;
  }
};
