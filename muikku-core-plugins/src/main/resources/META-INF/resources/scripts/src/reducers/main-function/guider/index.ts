import { ActionType } from "~/actions";
import { UserFileType } from "~/reducers/user-index";
import { WorkspaceDataType, ActivityLogType } from "~/reducers/workspaces";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { PurchaseType, PurchaseProductType } from "../profile";
import { LoadingState } from "~/@types/shared";
import { Reducer } from "redux";
import {
  UserStudentFlag,
  UserFlag,
  UserGroup,
  UserStudentAddress,
  UserStudentEmail,
  UserStudentPhoneNumber,
  UserWithSchoolData,
} from "~/generated/client";

export type GuiderUserGroupListType = UserGroup[];
export type GuiderWorkspaceType = WorkspaceDataType;

/**
 * GuiderFiltersType
 */
export interface GuiderFiltersType {
  labels: UserFlag[];
  userGroups: GuiderUserGroupListType;
  workspaces: WorkspaceDataType[];
}

export type GuiderStudentsStateType =
  | "LOADING"
  | "LOADING_MORE"
  | "ERROR"
  | "READY";
export type GuiderCurrentStudentStateType = "LOADING" | "ERROR" | "READY";

/**
 * GuiderActiveFiltersType
 */
export interface GuiderActiveFiltersType {
  workspaceFilters: Array<number>;
  labelFilters: Array<number>;
  userGroupFilters: Array<number>;
  query: string;
}

/**
 * GuiderStudentType
 */
export interface GuiderStudentType extends UserWithSchoolData {
  flags: UserStudentFlag[];
}
export type GuiderStudentListType = Array<GuiderStudentType>;

//These are actually dates, might be present or not
//studytime = Notification about study time ending
//nopassedcourses = Notification about low number of finished courses in a year
//assessmentrequest = Notification about inactivity in the first 2 months

/**
 * GuiderNotificationStudentsDataType
 */
export interface GuiderNotificationStudentsDataType {
  studytime?: string;
  nopassedcourses?: string;
  assessmentrequest?: string;
}

/**
 * ContactTypesArray for dropdowns etc.
 */
export const contactTypesArray = [
  "OTHER",
  "LETTER",
  "EMAIL",
  "PHONE",
  "CHATLOG",
  "ONLINE",
  "FACE2FACE",
  "ABSENCE",
  "MUIKKU",
] as const;

/**
 *  ContactTypes created from the ContactTypesArray
 */
export type ContactTypes = typeof contactTypesArray[number];

/**
 * ContactLogEvent
 */
export interface ContactLogEvent {
  id: number;
  entryDate: string;
  type: ContactTypes;
  creatorId: number;
  creatorName: string;
  hasImage: boolean;
  text: string;
  comments?: ContactLogEventComment[];
}

/**
 * ContactLogData
 */
export interface ContactLogData {
  totalHitCount: number;
  allPrivileges: boolean;
  firstResult: number;
  results: ContactLogEvent[];
}

/**
 * contactEventComment
 */
export type ContactLogEventComment = {
  id: number;
  entry: number;
  commentDate: string;
  creatorId: number;
  creatorName: string;
  hasImage: boolean;
  text: string;
};

/**
 * PedagogyFormAvailability
 */
export interface PedagogyFormAvailability {
  accessible: boolean;
  courseTeacher: boolean;
  specEdTeacher: boolean;
  guidanceCounselor: boolean;
}

/**
 * GuiderStudentUserProfileType
 */
export interface GuiderStudentUserProfileType {
  contactLogState: LoadingState;
  currentWorkspacesState: LoadingState;
  pastWorkspacesState: LoadingState;
  activityLogState: LoadingState;
  basic: GuiderStudentType;
  labels: UserStudentFlag[];
  emails: UserStudentEmail[];
  phoneNumbers: UserStudentPhoneNumber[];
  addresses: UserStudentAddress[];
  files: Array<UserFileType>;
  usergroups: Array<UserGroup>;
  // Disabled until it really works
  //  vops: VOPSDataType,
  hops: HOPSDataType;
  notifications: GuiderNotificationStudentsDataType;
  contactLogs: ContactLogData;
  currentWorkspaces: WorkspaceDataType[];
  pastWorkspaces: WorkspaceDataType[];
  activityLogs: ActivityLogType[];
  purchases: PurchaseType[];
  hopsPhase?: string;
  hopsAvailable: boolean;
  pedagogyFormAvailable: PedagogyFormAvailability;
}

/**
 * GuiderType
 */
export interface GuiderType {
  students: GuiderStudentListType;
  studentsState: GuiderStudentsStateType;
  activeFilters: GuiderActiveFiltersType;
  availablePurchaseProducts: PurchaseProductType[];
  availableFilters: GuiderFiltersType;
  hasMore: boolean;
  toolbarLock: boolean;
  currentStudent: GuiderStudentUserProfileType | null;
  currentStudentState: GuiderCurrentStudentStateType;
  selectedStudents: GuiderStudentListType;
  selectedStudentsIds: Array<string>;
  toggleAllStudentsActive: boolean;
}

/**
 * GuiderPatchType
 */
export interface GuiderPatchType {
  students?: GuiderStudentListType;
  studentsState?: GuiderStudentsStateType;
  activeFilters?: GuiderActiveFiltersType;
  availableFilters?: GuiderFiltersType;

  hasMore?: boolean;
  toolbarLock?: boolean;
  currentStudent?: GuiderStudentUserProfileType;
  selectedStudents?: GuiderStudentListType;
  selectedStudentsIds?: Array<string>;
  currentState?: GuiderCurrentStudentStateType;
}

/**
 * GuiderStudentUserProfileLabelType
 */
export interface GuiderStudentUserProfileLabelType {
  id: number;
  flagId: number;
  flagName: string;
  flagColor: string;
  studentIdentifier: string;
}

/**
 * sortLabels
 * @param labelA labelA
 * @param labelB labelB
 */
function sortLabels(labelA: UserFlag, labelB: UserFlag) {
  const labelAUpperCase = labelA.name.toUpperCase();
  const labelBUpperCase = labelB.name.toUpperCase();
  return labelAUpperCase < labelBUpperCase
    ? -1
    : labelAUpperCase > labelBUpperCase
    ? 1
    : 0;
}
/**
 * Sort for ceepos orders
 * @param a a type of purchase
 * @param b a second type of purchas
 * @returns sorted orders by date
 */
function sortOrders(a: PurchaseType, b: PurchaseType) {
  const dateA = new Date(a.created).getTime();
  const dateB = new Date(b.created).getTime();
  return dateA > dateB ? -1 : 1;
}

/**
 * InitialGuiderState
 */
const initialGuiderState: GuiderType = {
  studentsState: "LOADING",
  currentStudentState: "LOADING",
  availableFilters: {
    labels: [],
    workspaces: [],
    userGroups: [],
  },
  activeFilters: {
    workspaceFilters: [],
    labelFilters: [],
    userGroupFilters: [],
    query: "",
  },
  availablePurchaseProducts: [],
  students: [],
  hasMore: false,
  toolbarLock: false,
  selectedStudents: [],
  selectedStudentsIds: [],
  toggleAllStudentsActive: false,
  currentStudent: {
    contactLogState: "LOADING",
    currentWorkspacesState: "LOADING",
    pastWorkspacesState: "LOADING",
    activityLogState: "LOADING",
    basic: null,
    labels: [],
    emails: [],
    phoneNumbers: [],
    addresses: [],
    files: [],
    usergroups: [],
    hops: null,
    notifications: null,
    contactLogs: null,
    currentWorkspaces: [],
    pastWorkspaces: [],
    activityLogs: [],
    purchases: [],
    hopsAvailable: false,
    pedagogyFormAvailable: {
      accessible: false,
      courseTeacher: false,
      specEdTeacher: false,
      guidanceCounselor: false,
    },
  },
};

/**
 * guider2
 * @param state state
 * @param action action
 * @returns Guider state
 */
export const guider: Reducer<GuiderType> = (
  state = initialGuiderState,
  action: ActionType
) => {
  switch (action.type) {
    case "LOCK_TOOLBAR":
      return {
        ...state,
        toolbarLock: true,
      };

    case "UNLOCK_TOOLBAR":
      return {
        ...state,
        toolbarLock: false,
      };

    case "UPDATE_GUIDER_ACTIVE_FILTERS":
      return {
        ...state,
        activeFilters: action.payload,
      };

    case "UPDATE_GUIDER_ALL_PROPS":
      return Object.assign({}, state, action.payload);

    case "UPDATE_GUIDER_STATE":
      return {
        ...state,
        studentsState: action.payload,
      };

    case "ADD_TO_GUIDER_SELECTED_STUDENTS": {
      const student: GuiderStudentType = action.payload;

      return {
        ...state,
        selectedStudents: state.selectedStudents.concat([student]),
        selectedStudentsIds: state.selectedStudentsIds.concat([student.id]),
      };
    }
    case "REMOVE_FROM_GUIDER_SELECTED_STUDENTS": {
      const student: GuiderStudentType = action.payload;

      return {
        ...state,
        selectedStudents: state.selectedStudents.filter(
          (s) => s.id !== student.id
        ),
        selectedStudentsIds: state.selectedStudentsIds.filter(
          (id) => id !== student.id
        ),
      };
    }

    case "SET_CURRENT_GUIDER_STUDENT":
      return {
        ...state,
        currentStudent: action.payload,
      };

    case "SET_CURRENT_GUIDER_STUDENT_PROP": {
      const updatedCurrentStudent = {
        ...state.currentStudent,
        [action.payload.property]: action.payload.value,
      };

      return {
        ...state,
        currentStudent: updatedCurrentStudent,
      };
    }
    case "UPDATE_CURRENT_GUIDER_STUDENT_STATE":
      return {
        ...state,
        currentStudentState: action.payload,
      };

    case "ADD_GUIDER_LABEL_TO_USER": {
      const newCurrent: GuiderStudentUserProfileType =
        state.currentStudent && Object.assign({}, state.currentStudent);

      if (newCurrent && newCurrent.labels) {
        newCurrent.labels = newCurrent.labels.concat([action.payload.label]);
      }

      /**
       * mapFn
       * @param student student
       */
      const mapFn = function (student: GuiderStudentType) {
        if (student.id === action.payload.studentId) {
          return Object.assign({}, student, {
            flags: student.flags.concat([action.payload.label]),
          });
        }

        return student;
      };

      return {
        ...state,
        students: state.students.map(mapFn),
        selectedStudents: state.selectedStudents.map(mapFn),
        currentStudent: newCurrent,
      };
    }

    case "REMOVE_GUIDER_LABEL_FROM_USER": {
      const newCurrent: GuiderStudentUserProfileType =
        state.currentStudent && Object.assign({}, state.currentStudent);

      if (newCurrent && newCurrent.labels) {
        newCurrent.labels = newCurrent.labels.filter(
          (label) => label.id !== action.payload.label.id
        );
      }

      /**
       * mapFn
       * @param student student
       */
      const mapFn = function (student: GuiderStudentType) {
        if (student.id === action.payload.studentId) {
          return Object.assign({}, student, {
            flags: student.flags.filter(
              (label) => label.id !== action.payload.label.id
            ),
          });
        }
        return student;
      };

      return {
        ...state,
        students: state.students.map(mapFn),
        selectedStudents: state.selectedStudents.map(mapFn),
        currentStudent: newCurrent,
      };
    }

    case "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS": {
      /**
       * mapFnStudentLabel
       * @param label label
       */
      const mapFnStudentLabel = function (label: UserStudentFlag) {
        if (label.flagId === action.payload.labelId) {
          return Object.assign({}, label, action.payload.update);
        }
        return label;
      };

      /**
       * mapFn
       * @param student student
       */
      const mapFn = function (student: GuiderStudentType) {
        return Object.assign({}, student, {
          flags: student.flags.map(mapFnStudentLabel),
        });
      };

      let newCurrent = state.currentStudent;
      if (newCurrent) {
        newCurrent = Object.assign({}, state.currentStudent, {
          labels: state.currentStudent.labels.map(mapFnStudentLabel),
        });
      }

      return Object.assign({}, state, {
        students: state.students.map(mapFn),
        selectedStudents: state.selectedStudents.map(mapFn),
        currentStudent: newCurrent,
      });
    }

    case "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS": {
      /**
       * filterFnStudentLabel
       * @param label label
       */
      const filterFnStudentLabel = function (label: UserStudentFlag) {
        return label.flagId !== action.payload;
      };

      /**
       * mapFn
       * @param student student
       */
      const mapFn = function (student: GuiderStudentType) {
        return Object.assign({}, student, {
          flags: student.flags.filter(filterFnStudentLabel),
        });
      };

      let newCurrent = state.currentStudent;
      if (newCurrent) {
        newCurrent = Object.assign({}, state.currentStudent, {
          labels: state.currentStudent.labels.filter(filterFnStudentLabel),
        });
      }

      return {
        ...state,
        students: state.students.map(mapFn),
        selectedStudents: state.selectedStudents.map(mapFn),
        currentStudent: newCurrent,
      };
    }

    case "ADD_FILE_TO_CURRENT_STUDENT":
      return {
        ...state,
        currentStudent: Object.assign({}, state.currentStudent, {
          files: state.currentStudent.files.concat([action.payload]),
        }),
      };

    case "REMOVE_FILE_FROM_CURRENT_STUDENT":
      return {
        ...state,
        currentStudent: Object.assign({}, state.currentStudent, {
          files: state.currentStudent.files.filter(
            (f) => f.id !== action.payload.id
          ),
        }),
      };

    case "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          labels: action.payload.sort(sortLabels),
        }),
      };

    case "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          workspaces: action.payload,
        }),
      };

    case "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          userGroups: action.payload,
        }),
      };

    case "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          labels: state.availableFilters.labels
            .concat([action.payload])
            .sort(sortLabels),
        }),
      };

    case "UPDATE_GUIDER_AVAILABLE_FILTER_LABEL":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          labels: state.availableFilters.labels
            .map((label) => {
              if (label.id === action.payload.labelId) {
                return Object.assign({}, label, action.payload.update);
              }
              return label;
            })
            .sort(sortLabels),
        }),
      };

    case "DELETE_GUIDER_AVAILABLE_FILTER_LABEL":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          labels: state.availableFilters.labels.filter(
            (label) => label.id !== action.payload
          ),
        }),
      };

    case "UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE":
      return {
        ...state,
        currentStudent: {
          ...state.currentStudent,
          hopsPhase: action.payload.value,
        },
      };

    case "UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS":
      return {
        ...state,
        availablePurchaseProducts: action.payload,
      };

    case "UPDATE_GUIDER_INSERT_PURCHASE_ORDER": {
      const newOrders = [...state.currentStudent.purchases, action.payload];

      return {
        ...state,
        currentStudent: {
          ...state.currentStudent,
          purchases: newOrders.sort(sortOrders),
        },
      };
    }

    case "DELETE_GUIDER_PURCHASE_ORDER":
      return {
        ...state,
        currentStudent: {
          ...state.currentStudent,
          purchases: state.currentStudent.purchases.filter(
            (purchace: PurchaseType) => purchace.id !== action.payload.id
          ),
        },
      };

    case "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER":
      return {
        ...state,
        currentStudent: {
          ...state.currentStudent,
          purchases: state.currentStudent.purchases.map(
            (purchace: PurchaseType) => {
              if (purchace.id == action.payload.id) {
                return Object.assign({}, purchace, action.payload);
              }
              return purchace;
            }
          ),
        },
      };

    case "TOGGLE_ALL_STUDENTS":
      return {
        ...state,
        toggleAllStudentsActive: !state.toggleAllStudentsActive,
        selectedStudents: !state.toggleAllStudentsActive ? state.students : [],
        selectedStudentsIds: !state.toggleAllStudentsActive
          ? state.students.map((student) => student.id)
          : [],
      };

    case "DELETE_CONTACT_EVENT": {
      const contactLogs = state.currentStudent.contactLogs;
      const newContactLogsResults = contactLogs.results.filter(
        (log) => log.id !== action.payload
      );
      const newContactLogs = contactLogs;
      newContactLogs.results = newContactLogsResults;

      return {
        ...state,
        currentStudent: {
          ...state.currentStudent,
          contactLogs: newContactLogs,
        },
      };
    }

    case "DELETE_CONTACT_EVENT_COMMENT": {
      // Make a deep copy of the contact logs natively since there are no complex types involved

      const contactLogs = JSON.parse(
        JSON.stringify(state.currentStudent.contactLogs)
      ) as ContactLogData;

      const contactLogsResults = contactLogs.results;

      // Find the current contact log
      const currentContactLogResult = contactLogsResults.find(
        (log) => log.id === action.payload.contactLogEntryId
      );

      // Get the array index for the current contact log
      const currentContactLogIndex = contactLogsResults.findIndex(
        (log) => log.id === currentContactLogResult.id
      );
      // Get the index of the comment to be deleted from the current contact log
      const contactLogCommentIndex = currentContactLogResult.comments.findIndex(
        (comment) => comment.id === action.payload.commentId
      );

      // Remove the comment by index
      currentContactLogResult.comments.splice(contactLogCommentIndex, 1);

      // Replace the the contact log entry with the new one
      contactLogsResults.splice(
        currentContactLogIndex,
        1,
        currentContactLogResult
      );

      contactLogs.results = contactLogsResults;

      return {
        ...state,
        currentStudent: { ...state.currentStudent, contactLogs: contactLogs },
      };
    }

    default:
      return state;
  }
};
