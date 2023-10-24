import { ActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/workspaces";
import { LoadingState } from "~/@types/shared";
import { Reducer } from "redux";
import {
  ContactLog,
  Student,
  GuiderStudentNotification,
  UserFile,
  UserStudentFlag,
  ContactType,
  UserFlag,
  UserGroup,
  UserStudentAddress,
  UserStudentEmail,
  UserStudentPhoneNumber,
  CeeposOrder,
  CeeposPurchaseProduct,
  PedagogyFormAccess,
  HopsUppersecondary,
  ActivityLogEntry,
} from "~/generated/client";

/**
 * GuiderFiltersType
 */
export interface GuiderFiltersType {
  labels: UserFlag[];
  userGroups: UserGroup[];
  workspaces: WorkspaceType[];
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
export const contactTypesArray = Object.values(ContactType);

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
  basic: Student;
  labels: UserStudentFlag[];
  files: UserFile[];
  emails: UserStudentEmail[];
  phoneNumbers: UserStudentPhoneNumber[];
  addresses: UserStudentAddress[];
  usergroups: Array<UserGroup>;
  // Disabled until it really works
  //  vops: VOPSDataType,
  hops: HopsUppersecondary;
  notifications: GuiderStudentNotification;
  contactLogs: ContactLog;
  currentWorkspaces: WorkspaceType[];
  pastWorkspaces: WorkspaceType[];
  activityLogs: ActivityLogEntry[];
  purchases: CeeposOrder[];
  hopsPhase?: string;
  hopsAvailable: boolean;
  pedagogyFormAvailable: PedagogyFormAccess;
}

/**
 * GuiderState
 */
export interface GuiderState {
  students: Student[];
  studentsState: GuiderStudentsStateType;
  activeFilters: GuiderActiveFiltersType;
  availablePurchaseProducts: CeeposPurchaseProduct[];
  availableFilters: GuiderFiltersType;
  hasMore: boolean;
  toolbarLock: boolean;
  currentStudent: GuiderStudentUserProfileType | null;
  currentStudentState: GuiderCurrentStudentStateType;
  selectedStudents: Student[];
  selectedStudentsIds: Array<string>;
  toggleAllStudentsActive: boolean;
}

/**
 * GuiderStatePatch
 */
export interface GuiderStatePatch {
  students?: Student[];
  studentsState?: GuiderStudentsStateType;
  activeFilters?: GuiderActiveFiltersType;
  availableFilters?: GuiderFiltersType;
  hasMore?: boolean;
  toolbarLock?: boolean;
  currentStudent?: GuiderStudentUserProfileType;
  selectedStudents?: Student[];
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
function sortOrders(a: CeeposOrder, b: CeeposOrder) {
  const dateA = new Date(a.created).getTime();
  const dateB = new Date(b.created).getTime();
  return dateA > dateB ? -1 : 1;
}

/**
 * InitialGuiderState
 */
const initialGuiderState: GuiderState = {
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
export const guider: Reducer<GuiderState> = (
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
      const student: Student = action.payload;

      return {
        ...state,
        selectedStudents: state.selectedStudents.concat([student]),
        selectedStudentsIds: state.selectedStudentsIds.concat([student.id]),
      };
    }
    case "REMOVE_FROM_GUIDER_SELECTED_STUDENTS": {
      const student: Student = action.payload;

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

      // eslint-disable-next-line jsdoc/require-jsdoc
      const mapFn = function (student: Student) {
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

      // eslint-disable-next-line jsdoc/require-jsdoc
      const mapFn = function (student: Student) {
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

      // eslint-disable-next-line jsdoc/require-jsdoc
      const mapFn = function (student: Student) {
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

      // eslint-disable-next-line jsdoc/require-jsdoc
      const mapFn = function (student: Student) {
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
            (purchace: CeeposOrder) => purchace.id !== action.payload.id
          ),
        },
      };

    case "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER":
      return {
        ...state,
        currentStudent: {
          ...state.currentStudent,
          purchases: state.currentStudent.purchases.map(
            (purchace: CeeposOrder) => {
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
      ) as ContactLog;

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
