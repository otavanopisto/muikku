import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  ActivityLogEntry,
  CourseMatrix,
  GuidanceCounselorContact,
  PedagogyFormAccess,
  Student,
  StudyActivity,
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
} from "~/generated/client/models";
import { CurriculumConfig } from "~/util/curriculum-config";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { MuikkuEvents } from "~/reducers/base/muikku-events";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * Contact group interface
 */
interface ContactGroup {
  status: ReducerStateType;
  list: GuidanceCounselorContact[];
}

/**
 * Dependant study data interface
 */
export interface DependantStudyData {
  studyActivity: StudyActivity | null;
  studyActivityStatus: ReducerStateType;
  courseMatrix: CourseMatrix | null;
  courseMatrixStatus: ReducerStateType;
  curriculumConfig: CurriculumConfig | null;
  curriculumConfigStatus: ReducerStateType;
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
  dependantInfo: Student | null;
  dependantInfoStatus: ReducerStateType;
  dependantContactGroups: DependantContactGroups;
  dependantActivityGraphData: DependantActivityGraphData;
  dependantActivityGraphDataStatus: ReducerStateType;
  dependantPedagogyFormAccess: PedagogyFormAccess | null;
  dependantPedagogyFormAccessStatus: ReducerStateType;

  dependantEducationTypes: string[] | null;
  dependantEducationTypesStatus: ReducerStateType;
  dependantDefaultEducationTypeCode: string | null;
  dependantSelectedEducationTypeCode: string | null;
  dependantStudyDataByEducationTypeCode: Record<string, DependantStudyData>;
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
  absencesByDependantId: Record<number, MuikkuEvents>;
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

    dependantEducationTypes: null,
    dependantEducationTypesStatus: "IDLE",
    dependantDefaultEducationTypeCode: null,
    dependantSelectedEducationTypeCode: null,
    dependantStudyDataByEducationTypeCode: {},
  },
  workspacesByDependantIdentifier: {},
  absencesByDependantId: {},
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

    case "GUARDIAN_UPDATE_DEPENDANT_ABSENCES_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantAbsencesStatus: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_DEPENDANT_ABSENCES":
      return {
        ...state,
        absencesByDependantId: {
          ...state.absencesByDependantId,
          [action.payload.dependantId]: {
            events: action.payload.absences,
            state: "READY",
          },
        },
      };

    case "GUARDIAN_UPDATE_DEPENDANT_ABSENCE_PROPERTY":
      return {
        ...state,
        absencesByDependantId: {
          ...state.absencesByDependantId,
          [action.payload.userEntityId]: {
            events: state.absencesByDependantId[
              action.payload.userEntityId
            ]?.events.map((event) => {
              if (event.id === action.payload.eventId) {
                return {
                  ...event,
                  properties: [action.payload],
                };
              }
              return event;
            }),
            state: "READY",
          },
        },
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

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantEducationTypesStatus: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES": {
      const newDependantStudyDataByEducationTypeCode = action.payload.reduce<
        Record<string, DependantStudyData>
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
        currentDependant: {
          ...state.currentDependant,
          dependantEducationTypes: action.payload,
          dependantStudyDataByEducationTypeCode:
            newDependantStudyDataByEducationTypeCode,
        },
      };
    }

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_DEFAULT_EDUCATION_TYPE_CODE":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantDefaultEducationTypeCode: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_SELECTED_EDUCATION_TYPE_CODE":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantSelectedEducationTypeCode: action.payload,
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyDataByEducationTypeCode: {
            ...state.currentDependant.dependantStudyDataByEducationTypeCode,
            [action.payload.key]: {
              ...state.currentDependant.dependantStudyDataByEducationTypeCode[
                action.payload.key
              ],
              curriculumConfigStatus: action.payload.status,
            },
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyDataByEducationTypeCode: {
            ...state.currentDependant.dependantStudyDataByEducationTypeCode,
            [action.payload.key]: {
              ...state.currentDependant.dependantStudyDataByEducationTypeCode[
                action.payload.key
              ],
              curriculumConfig: action.payload.curriculumConfig,
            },
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyDataByEducationTypeCode: {
            ...state.currentDependant.dependantStudyDataByEducationTypeCode,
            [action.payload.key]: {
              ...state.currentDependant.dependantStudyDataByEducationTypeCode[
                action.payload.key
              ],
              studyActivityStatus: action.payload.status,
            },
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyDataByEducationTypeCode: {
            ...state.currentDependant.dependantStudyDataByEducationTypeCode,
            [action.payload.key]: {
              ...state.currentDependant.dependantStudyDataByEducationTypeCode[
                action.payload.key
              ],
              studyActivity: action.payload.studyActivity,
            },
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyDataByEducationTypeCode: {
            ...state.currentDependant.dependantStudyDataByEducationTypeCode,
            [action.payload.key]: {
              ...state.currentDependant.dependantStudyDataByEducationTypeCode[
                action.payload.key
              ],
              courseMatrixStatus: action.payload.status,
            },
          },
        },
      };

    case "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX":
      return {
        ...state,
        currentDependant: {
          ...state.currentDependant,
          dependantStudyDataByEducationTypeCode: {
            ...state.currentDependant.dependantStudyDataByEducationTypeCode,
            [action.payload.key]: {
              ...state.currentDependant.dependantStudyDataByEducationTypeCode[
                action.payload.key
              ],
              courseMatrix: action.payload.courseMatrix,
            },
          },
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

          dependantEducationTypes: null,
          dependantEducationTypesStatus: "IDLE",
          dependantDefaultEducationTypeCode: null,
          dependantSelectedEducationTypeCode: null,
          dependantStudyDataByEducationTypeCode: {},
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

          dependantEducationTypes: null,
          dependantEducationTypesStatus: "IDLE",
          dependantDefaultEducationTypeCode: null,
          dependantSelectedEducationTypeCode: null,
          dependantStudyDataByEducationTypeCode: {},
        },
      };
    default:
      return state;
  }
};
