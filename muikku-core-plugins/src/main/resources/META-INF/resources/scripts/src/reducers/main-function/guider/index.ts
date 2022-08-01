import { ActionType } from "~/actions";
import {
  UserWithSchoolDataType,
  UserFileType,
  StudentUserProfileEmailType,
  StudentUserProfilePhoneType,
  StudentUserAddressType,
  UserGroupType,
} from "~/reducers/user-index";
import {
  WorkspaceType,
  WorkspaceListType,
  ActivityLogType,
} from "~/reducers/workspaces";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { PurchaseType, PurchaseProductType } from "../profile";
import { LoadingState } from "~/@types/shared";
/**
 * GuiderUserLabelType
 */
export interface GuiderUserLabelType {
  id: number;
  name: string;
  color: string;
  description: string;
  ownerIdentifier: string;
}

export type GuiderUserLabelListType = Array<GuiderUserLabelType>;
export type GuiderUserGroupListType = Array<UserGroupType>;
export type GuiderWorkspaceType = WorkspaceType;
export type GuiderWorkspaceListType = WorkspaceListType;

/**
 * GuiderFiltersType
 */
export interface GuiderFiltersType {
  labels: GuiderUserLabelListType;
  userGroups: GuiderUserGroupListType;
  workspaces: GuiderWorkspaceListType;
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
export interface GuiderStudentType extends UserWithSchoolDataType {
  flags: Array<GuiderStudentUserProfileLabelType>;
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
  "SKYPE",
  "FACE2FACE",
  "ABSENCE",
  "MUIKKU",
] as const;

/**
 *  ContactTypes created from the ContactTypesArray
 */
export type ContactTypes = typeof contactTypesArray[number];

/**
 * ContactEvent
 */
export interface IContactLogEvent {
  id: number;
  entryDate: string;
  type: ContactTypes;
  creatorId: number;
  creatorName: string;
  hasImage: boolean;
  text: string;
  comments?: IContactLogEventComment[];
}

/**
 * contactEventComment
 */
export type IContactLogEventComment = {
  id: number;
  entry: number;
  commentDate: string;
  creatorId: number;
  creatorName: string;
  hasImage: boolean;
  text: string;
};

/**
 * GuiderStudentUserProfileType
 */
export interface GuiderStudentUserProfileType {
  contactLogState: LoadingState;
  currentWorkspacesState: LoadingState;
  pastWorkspacesState: LoadingState;
  activityLogState: LoadingState;
  basic: GuiderStudentType;
  labels: Array<GuiderStudentUserProfileLabelType>;
  emails: Array<StudentUserProfileEmailType>;
  phoneNumbers: Array<StudentUserProfilePhoneType>;
  addresses: Array<StudentUserAddressType>;
  files: Array<UserFileType>;
  usergroups: Array<UserGroupType>;
  // Disabled until it really works
  //  vops: VOPSDataType,
  hops: HOPSDataType;
  notifications: GuiderNotificationStudentsDataType;
  contactLogs: IContactLogEvent[];
  currentWorkspaces: WorkspaceListType;
  pastWorkspaces: WorkspaceListType;
  activityLogs: ActivityLogType[];
  purchases: PurchaseType[];
  hopsPhase?: string;
  hopsAvailable: boolean;
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
  currentStudent: GuiderStudentUserProfileType;
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
function sortLabels(labelA: GuiderUserLabelType, labelB: GuiderUserLabelType) {
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
 * guider reducer function
 * @param state app state
 * @param action redux action
 * @returns new app state
 */
export default function guider(
  state: GuiderType = {
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
    currentStudent: null,
  },
  action: ActionType
): GuiderType {
  if (action.type === "LOCK_TOOLBAR") {
    return Object.assign({}, state, {
      toolbarLock: true,
    });
  } else if (action.type === "UNLOCK_TOOLBAR") {
    return Object.assign({}, state, {
      toolbarLock: false,
    });
  } else if (action.type === "UPDATE_GUIDER_ACTIVE_FILTERS") {
    return Object.assign({}, state, {
      activeFilters: action.payload,
    });
  } else if (action.type === "UPDATE_GUIDER_ALL_PROPS") {
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_GUIDER_STATE") {
    return Object.assign({}, state, {
      studentsState: action.payload,
    });
  } else if (action.type === "ADD_TO_GUIDER_SELECTED_STUDENTS") {
    const student: GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selectedStudents: state.selectedStudents.concat([student]),
      selectedStudentsIds: state.selectedStudentsIds.concat([student.id]),
    });
  } else if (action.type === "REMOVE_FROM_GUIDER_SELECTED_STUDENTS") {
    const student: GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selectedStudents: state.selectedStudents.filter(
        (s) => s.id !== student.id
      ),
      selectedStudentsIds: state.selectedStudentsIds.filter(
        (id) => id !== student.id
      ),
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT") {
    return Object.assign({}, state, {
      currentStudent: action.payload,
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD") {
    return Object.assign({}, state, {
      currentStudent: {},
      currentStudentState: "LOADING",
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_PROP") {
    const updatedCurrentStudent = {
      ...state.currentStudent,
      [action.payload.property]: action.payload.value,
    };
    return Object.assign({}, state, {
      currentStudent: updatedCurrentStudent,
    });
  } else if (action.type === "UPDATE_CURRENT_GUIDER_STUDENT_STATE") {
    return Object.assign({}, state, {
      currentStudentState: action.payload,
    });
  } else if (
    action.type === "ADD_GUIDER_LABEL_TO_USER" ||
    action.type === "REMOVE_GUIDER_LABEL_FROM_USER"
  ) {
    let newCurrent: GuiderStudentUserProfileType;

    if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
      newCurrent =
        state.currentStudent && Object.assign({}, state.currentStudent);
      if (newCurrent && newCurrent.labels) {
        newCurrent.labels = newCurrent.labels.concat([action.payload.label]);
      }
    } else {
      newCurrent =
        state.currentStudent && Object.assign({}, state.currentStudent);
      if (newCurrent && newCurrent.labels) {
        newCurrent.labels = newCurrent.labels.filter(
          (label) => label.id !== action.payload.label.id
        );
      }
    }

    /**
     * mapFn
     * @param student student
     */
    const mapFn = function (student: GuiderStudentType) {
      if (student.id === action.payload.studentId) {
        if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
          return Object.assign({}, student, {
            flags: student.flags.concat([action.payload.label]),
          });
        } else {
          return Object.assign({}, student, {
            flags: student.flags.filter(
              (label) => label.id !== action.payload.label.id
            ),
          });
        }
      }
      return student;
    };

    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selectedStudents: state.selectedStudents.map(mapFn),
      currentStudent: newCurrent,
    });
  } else if (action.type === "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS") {
    /**
     * mapFnStudentLabel
     * @param label label
     */
    const mapFnStudentLabel = function (
      label: GuiderStudentUserProfileLabelType
    ) {
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
  } else if (action.type === "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS") {
    /**
     * filterFnStudentLabel
     * @param label label
     */
    const filterFnStudentLabel = function (
      label: GuiderStudentUserProfileLabelType
    ) {
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

    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selectedStudents: state.selectedStudents.map(mapFn),
      currentStudent: newCurrent,
    });
  } else if (action.type === "ADD_FILE_TO_CURRENT_STUDENT") {
    return Object.assign({}, state, {
      currentStudent: Object.assign({}, state.currentStudent, {
        files: state.currentStudent.files.concat([action.payload]),
      }),
    });
  } else if (action.type === "REMOVE_FILE_FROM_CURRENT_STUDENT") {
    return Object.assign({}, state, {
      currentStudent: Object.assign({}, state.currentStudent, {
        files: state.currentStudent.files.filter(
          (f) => f.id !== action.payload.id
        ),
      }),
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        labels: action.payload.sort(sortLabels),
      }),
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        workspaces: action.payload,
      }),
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        userGroups: action.payload,
      }),
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        labels: state.availableFilters.labels
          .concat([action.payload])
          .sort(sortLabels),
      }),
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTER_LABEL") {
    return Object.assign({}, state, {
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
    });
  } else if (action.type === "UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE") {
    return Object.assign({}, state, {
      currentStudent: {
        ...state.currentStudent,
        hopsPhase: action.payload.value,
      },
    });
  } else if (action.type === "DELETE_GUIDER_AVAILABLE_FILTER_LABEL") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        labels: state.availableFilters.labels.filter(
          (label) => label.id !== action.payload
        ),
      }),
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS") {
    return Object.assign({}, state, {
      availablePurchaseProducts: action.payload,
    });
  } else if (action.type === "UPDATE_GUIDER_INSERT_PURCHASE_ORDER") {
    const newOrders = [...state.currentStudent.purchases, action.payload];
    return Object.assign({}, state, {
      currentStudent: {
        ...state.currentStudent,
        purchases: newOrders.sort(sortOrders),
      },
    });
  } else if (action.type === "DELETE_GUIDER_PURCHASE_ORDER") {
    return Object.assign({}, state, {
      currentStudent: {
        ...state.currentStudent,
        purchases: state.currentStudent.purchases.filter(
          (purchace: PurchaseType) => purchace.id !== action.payload.id
        ),
      },
    });
  } else if (action.type === "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER") {
    return Object.assign({}, state, {
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
    });
  } else if (action.type === "TOGGLE_ALL_STUDENTS") {
    return Object.assign({}, state, {
      toggleAllStudentsActive: !state.toggleAllStudentsActive,
      selectedStudents: !state.toggleAllStudentsActive ? state.students : [],
      selectedStudentsIds: !state.toggleAllStudentsActive
        ? state.students.map((student) => student.id)
        : [],
    });
  } else if (action.type === "DELETE_CONTACT_EVENT") {
    const contactLogs = state.currentStudent.contactLogs;
    const newContactLogs = contactLogs.filter(
      (log) => log.id !== action.payload
    );

    return {
      ...state,
      currentStudent: { ...state.currentStudent, contactLogs: newContactLogs },
    };
  } else if (action.type === "DELETE_CONTACT_EVENT_COMMENT") {
    // Make a fast deep copy of the contact logs natively since there are no complex types involved
    const contactLogs = JSON.parse(
      JSON.stringify(state.currentStudent.contactLogs)
    ) as IContactLogEvent[];

    // Find the current contact log
    const currentContactLog = contactLogs.find(
      (log) => log.id === action.payload.contactLogEntryId
    );

    // Get the array index for the current contact log
    const currentContactLogIndex = contactLogs.findIndex(
      (log) => log.id === currentContactLog.id
    );
    // Get the index of the comment to be deleted from the current contact log
    const contactLogCommentIndex = currentContactLog.comments.findIndex(
      (comment) => comment.id === action.payload.commentId
    );

    // Remove the comment by index
    currentContactLog.comments.splice(contactLogCommentIndex, 1);

    // Replace the the contact log entry with the new one
    contactLogs.splice(currentContactLogIndex, 1, currentContactLog);

    return {
      ...state,
      currentStudent: { ...state.currentStudent, contactLogs: contactLogs },
    };
  }
  return state;
}
