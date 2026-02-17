import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  ActivityLogEntry,
  CourseMatrix,
  GuidanceCounselorContact,
  PedagogyFormAccess,
  StudyActivity,
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
  UserWithSchoolData,
} from "~/generated/client/models";
import { CurriculumConfig } from "~/util/curriculum-config";
import { WorkspaceDataType } from "~/reducers/workspaces";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * Contact group interface
 */
interface ContactGroup {
  status: ReducerStateType;
  list: GuidanceCounselorContact[];
}

/**
 * Dependant contact groups interface
 */
export interface DependantContactGroups {
  counselors: ContactGroup;
}

export type ContactGroupNames = keyof DependantContactGroups;

/**
 * Dependant graph data interface
 */
export interface DependantActivityGraphData {
  activity: ActivityLogEntry[];
  workspaces: WorkspaceDataType[];
}

/**
 * Current dependant interface
 */
export interface CurrentDependant {
  /**
   * dependant user with school data
   */
  dependantInfo: UserWithSchoolData | null;
  dependantInfoStatus: ReducerStateType;
  dependantCurriculumConfig: CurriculumConfig | null;
  dependantCurriculumConfigStatus: ReducerStateType;
  dependantStudyActivity: StudyActivity | null;
  dependantStudyActivityStatus: ReducerStateType;
  dependantCourseMatrix: CourseMatrix | null;
  dependantCourseMatrixStatus: ReducerStateType;
  dependantContactGroups: DependantContactGroups;
  dependantActivityGraphData: DependantActivityGraphData;
  dependantActivityGraphDataStatus: ReducerStateType;
  dependantPedagogyFormAccess: PedagogyFormAccess | null;
  dependantPedagogyFormAccessStatus: ReducerStateType;
}

/**
 * Key value pair of dependant identifier and its workspaces and status
 */
export type WorkspacesByDependantIdentifier = Record<
  string,
  {
    workspaces: UserGuardiansDependantWorkspace[];
    status: ReducerStateType;
  }
>;

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface GuardianState {
  dependantsStatus: ReducerStateType;
  dependants: UserGuardiansDependant[];
  currentDependantIdentifier: string | null;
  currentDependant: CurrentDependant;
  workspacesByDependantIdentifier: WorkspacesByDependantIdentifier;
}

/**
 * initialUserGroupsState
 */
const initializeGuardianState: GuardianState = {
  dependantsStatus: "IDLE",
  dependants: [],
  currentDependantIdentifier: null,
  currentDependant: {
    dependantInfo: null,
    dependantInfoStatus: "IDLE",
    dependantCurriculumConfig: null,
    dependantCurriculumConfigStatus: "IDLE",
    dependantStudyActivity: null,
    dependantStudyActivityStatus: "IDLE",
    dependantCourseMatrix: null,
    dependantCourseMatrixStatus: "IDLE",
    dependantContactGroups: {
      counselors: {
        status: "IDLE",
        list: [],
      },
    },
    dependantActivityGraphData: {
      activity: [],
      workspaces: [],
    },
    dependantActivityGraphDataStatus: "IDLE",
    dependantPedagogyFormAccess: null,
    dependantPedagogyFormAccessStatus: "IDLE",
  },
  workspacesByDependantIdentifier: {},
};

/**
 * Reducer function for users
 *
 * @param state state
 * @param action action
 * @returns State of users
 */
export const guardian: Reducer<GuardianState> = (
  state = initializeGuardianState,
  action: ActionType
) => {
  switch (action.type) {
    case "GUARDIAN_UPDATE_DEPENDANTS_STATUS":
      return {
        ...state,
        dependantsStatus: action.payload,
      };
    case "GUARDIAN_UPDATE_DEPENDANTS":
      return {
        ...state,
        dependants: action.payload,
      };

    case "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS":
      return {
        ...state,
        workspacesByDependantIdentifier: {
          ...state.workspacesByDependantIdentifier,
          [action.payload.identifier]: {
            workspaces:
              state.workspacesByDependantIdentifier[action.payload.identifier]
                ?.workspaces || [],
            status: action.payload.status,
          },
        },
      };
    case "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES":
      return {
        ...state,
        workspacesByDependantIdentifier: {
          ...state.workspacesByDependantIdentifier,
          [action.payload.identifier]: {
            ...state.workspacesByDependantIdentifier[action.payload.identifier],
            workspaces: action.payload.workspaces,
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantInfoStatus: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantInfo: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantCurriculumConfigStatus: action.payload,
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantCurriculumConfig: action.payload,
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyActivityStatus: action.payload,
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyActivity: action.payload,
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantCourseMatrixStatus: action.payload,
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantCourseMatrix: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantContactGroups: {
            ...state.currentDependant.dependantContactGroups,
            [action.payload.groupName]: {
              ...state.currentDependant.dependantContactGroups[
                action.payload.groupName
              ],
              status: action.payload.status,
            },
          },
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantContactGroups: {
            ...state.currentDependant.dependantContactGroups,
            [action.payload.groupName]: {
              ...state.currentDependant.dependantContactGroups[
                action.payload.groupName
              ],
              list: action.payload.list,
            },
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantActivityGraphDataStatus: action.payload,
        },
      };
    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantActivityGraphData: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantPedagogyFormAccess: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantPedagogyFormAccessStatus: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER": {
      // If the current dependant identifier is the same as the action payload, return the state
      if (state.currentDependantIdentifier === action.payload) {
        return state;
      }

      // Update the current dependant identifier and reset the current dependant state
      return {
        ...state,
        currentDependantIdentifier: action.payload,
        currentDependant: {
          dependantInfo: null,
          dependantInfoStatus: "IDLE",
          dependantCurriculumConfig: null,
          dependantCurriculumConfigStatus: "IDLE",
          dependantStudyActivity: null,
          dependantStudyActivityStatus: "IDLE",
          dependantCourseMatrix: null,
          dependantCourseMatrixStatus: "IDLE",
          dependantContactGroups: {
            counselors: {
              status: "IDLE",
              list: [],
            },
          },
          dependantActivityGraphData: {
            activity: [],
            workspaces: [],
          },
          dependantActivityGraphDataStatus: "IDLE",
          dependantPedagogyFormAccess: null,
          dependantPedagogyFormAccessStatus: "IDLE",
        },
      };
    }

    case "GUARDIAN_RESET_CURRENT_DEPENDANT_STATE":
      return {
        ...state,
        currentDependantIdentifier: null,
        currentDependant: {
          dependantInfo: null,
          dependantInfoStatus: "IDLE",
          dependantCurriculumConfig: null,
          dependantCurriculumConfigStatus: "IDLE",
          dependantStudyActivity: null,
          dependantStudyActivityStatus: "IDLE",
          dependantCourseMatrix: null,
          dependantCourseMatrixStatus: "IDLE",
          dependantContactGroups: {
            counselors: {
              status: "IDLE",
              list: [],
            },
          },
          dependantActivityGraphData: {
            activity: [],
            workspaces: [],
          },
          dependantActivityGraphDataStatus: "IDLE",
          dependantPedagogyFormAccess: null,
          dependantPedagogyFormAccessStatus: "IDLE",
        },
      };
    default:
      return state;
  }
};
