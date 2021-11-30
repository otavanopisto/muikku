import { ActionType } from '~/actions';
import { UserWithSchoolDataType, UserFileType, StudentUserProfileEmailType, StudentUserProfilePhoneType, StudentUserAddressType, UserGroupType } from '~/reducers/user-index';
import { WorkspaceType, WorkspaceListType, ActivityLogType } from "~/reducers/workspaces";
import { VOPSDataType } from '~/reducers/main-function/vops';
import { HOPSDataType } from '~/reducers/main-function/hops';

export interface GuiderUserLabelType {
  id: number,
  name: string,
  color: string,
  description: string,
  ownerIdentifier: string
}

export type GuiderUserLabelListType = Array<GuiderUserLabelType>;
export type GuiderUserGroupListType = Array<UserGroupType>;
export type GuiderWorkspaceType = WorkspaceType;
export type GuiderWorkspaceListType = WorkspaceListType;

export interface GuiderFiltersType {
  labels: GuiderUserLabelListType,
  userGroups: GuiderUserGroupListType,
  workspaces: GuiderWorkspaceListType
}

export type GuiderStudentsStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export type GuiderCurrentStudentStateType = "LOADING" | "ERROR" | "READY";
export interface GuiderActiveFiltersType {
  workspaceFilters: Array<number>,
  labelFilters: Array<number>,
  userGroupFilters: Array<number>
  query: string
}
export interface GuiderStudentType extends UserWithSchoolDataType {
  flags: Array<GuiderStudentUserProfileLabelType>
};
export type GuiderStudentListType = Array<GuiderStudentType>;

//These are actually dates, might be present or not
//studytime = Notification about study time ending
//nopassedcourses = Notification about low number of finished courses in a year
//assessmentrequest = Notification about inactivity in the first 2 months
export interface GuiderNotificationStudentsDataType {
  studytime?: string,
  nopassedcourses?: string,
  assessmentrequest?: string
}

export interface GuiderStudentUserProfileType {
  basic: GuiderStudentType,
  labels: Array<GuiderStudentUserProfileLabelType>,
  emails: Array<StudentUserProfileEmailType>,
  phoneNumbers: Array<StudentUserProfilePhoneType>,
  addresses: Array<StudentUserAddressType>,
  files: Array<UserFileType>,
  usergroups: Array<UserGroupType>,
  // Disabled until it really works
  //  vops: VOPSDataType,
  hops: HOPSDataType,
  notifications: GuiderNotificationStudentsDataType,
  workspaces: WorkspaceListType,
  activityLogs: ActivityLogType[]
}

export interface GuiderType {
  state: GuiderStudentsStateType,
  activeFilters: GuiderActiveFiltersType,
  availableFilters: GuiderFiltersType,
  students: GuiderStudentListType,
  hasMore: boolean,
  toolbarLock: boolean,
  currentStudent: GuiderStudentUserProfileType,
  selectedStudents: GuiderStudentListType,
  selectedStudentsIds: Array<string>,
  toggleAllStudentsActive: boolean,
  currentState: GuiderCurrentStudentStateType
}

export interface GuiderPatchType {
  state?: GuiderStudentsStateType,
  activeFilters?: GuiderActiveFiltersType,
  availableFilters?: GuiderFiltersType,
  students?: GuiderStudentListType,
  hasMore?: boolean,
  toolbarLock?: boolean,
  currentStudent?: GuiderStudentUserProfileType,
  selectedStudents?: GuiderStudentListType,
  selectedStudentsIds?: Array<string>,
  currentState?: GuiderCurrentStudentStateType
}

export interface GuiderStudentUserProfileLabelType {
  id: number,
  flagId: number,
  flagName: string,
  flagColor: string,
  studentIdentifier: string
}

function sortLabels(labelA: GuiderUserLabelType, labelB: GuiderUserLabelType) {
  let labelAUpperCase = labelA.name.toUpperCase();
  let labelBUpperCase = labelB.name.toUpperCase();
  return (labelAUpperCase < labelBUpperCase) ? -1 : (labelAUpperCase > labelBUpperCase) ? 1 : 0;
}

export default function guider(state: GuiderType = {
  state: "LOADING",
  currentState: "READY",
  availableFilters: {
    labels: [],
    workspaces: [],
    userGroups: []
  },
  activeFilters: {
    workspaceFilters: [],
    labelFilters: [],
    userGroupFilters: [],
    query: ""
  },
  students: [],
  hasMore: false,
  toolbarLock: false,
  selectedStudents: [],
  selectedStudentsIds: [],
  toggleAllStudentsActive: false,
  currentStudent: null
}, action: ActionType): GuiderType {
  if (action.type === "LOCK_TOOLBAR") {
    return Object.assign({}, state, {
      toolbarLock: true
    });
  } else if (action.type === "UNLOCK_TOOLBAR") {
    return Object.assign({}, state, {
      toolbarLock: false
    });
  } else if (action.type === "UPDATE_GUIDER_ACTIVE_FILTERS") {
    return Object.assign({}, state, {
      activeFilters: action.payload
    });
  } else if (action.type === "UPDATE_GUIDER_ALL_PROPS") {
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_GUIDER_STATE") {
    return Object.assign({}, state, {
      state: action.payload
    });
  } else if (action.type === "ADD_TO_GUIDER_SELECTED_STUDENTS") {
    let student: GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selectedStudents: state.selectedStudents.concat([student]),
      selectedStudentsIds: state.selectedStudentsIds.concat([student.id])
    });
  } else if (action.type === "REMOVE_FROM_GUIDER_SELECTED_STUDENTS") {
    let student: GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selectedStudents: state.selectedStudents.filter(s => s.id !== student.id),
      selectedStudentsIds: state.selectedStudentsIds.filter(id => id !== student.id)
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT") {
    return Object.assign({}, state, {
      currentStudent: action.payload
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD") {
    return Object.assign({}, state, {
      currentStudent: {},
      currentState: "LOADING"
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_PROP") {
    let obj: any = {};
    obj[action.payload.property] = action.payload.value;
    return Object.assign({}, state, {
      currentStudent: Object.assign({}, state.currentStudent, obj)
    });
  } else if (action.type === "UPDATE_CURRENT_GUIDER_STUDENT_STATE") {
    return Object.assign({}, state, {
      currentState: action.payload
    });
  } else if (action.type === "ADD_GUIDER_LABEL_TO_USER" || action.type === "REMOVE_GUIDER_LABEL_FROM_USER") {
    let newCurrent: GuiderStudentUserProfileType;

    if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
      newCurrent = state.currentStudent && Object.assign({}, state.currentStudent);
      if (newCurrent && newCurrent.labels) {
        newCurrent.labels = newCurrent.labels.concat([action.payload.label]);
      }
    } else {
      newCurrent = state.currentStudent && Object.assign({}, state.currentStudent);
      if (newCurrent && newCurrent.labels) {
        newCurrent.labels = newCurrent.labels.filter((label) => {
          return label.id !== action.payload.label.id;
        })
      }
    }

    let mapFn = function (student: GuiderStudentType) {
      if (student.id === action.payload.studentId) {
        if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
          return Object.assign({}, student, {
            flags: student.flags.concat([action.payload.label])
          });
        } else {
          return Object.assign({}, student, {
            flags: student.flags.filter((label) => {
              return label.id !== action.payload.label.id;
            })
          });
        }
      }
      return student;
    }

    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selectedStudents: state.selectedStudents.map(mapFn),
      currentStudent: newCurrent
    });
  } else if (action.type === "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS") {
    let mapFnStudentLabel = function (label: GuiderStudentUserProfileLabelType) {
      if (label.flagId === action.payload.labelId) {
        return Object.assign({}, label, action.payload.update);
      }
      return label;
    }
    let mapFn = function (student: GuiderStudentType) {
      return Object.assign({}, student, {
        flags: student.flags.map(mapFnStudentLabel)
      });
    }

    let newCurrent = state.currentStudent;
    if (newCurrent) {
      newCurrent = Object.assign({}, state.currentStudent, {
        labels: state.currentStudent.labels.map(mapFnStudentLabel)
      });
    }

    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selectedStudents: state.selectedStudents.map(mapFn),
      currentStudent: newCurrent
    });
  } else if (action.type === "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS") {
    let filterFnStudentLabel = function (label: GuiderStudentUserProfileLabelType) {
      return (label.flagId !== action.payload);
    }
    let mapFn = function (student: GuiderStudentType) {
      return Object.assign({}, student, {
        flags: student.flags.filter(filterFnStudentLabel)
      });
    }

    let newCurrent = state.currentStudent;
    if (newCurrent) {
      newCurrent = Object.assign({}, state.currentStudent, {
        labels: state.currentStudent.labels.filter(filterFnStudentLabel)
      });
    }

    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selectedStudents: state.selectedStudents.map(mapFn),
      currentStudent: newCurrent
    });
  } else if (action.type === "ADD_FILE_TO_CURRENT_STUDENT") {
    return Object.assign({}, state, {
      currentStudent: Object.assign({}, state.currentStudent, {
        files: state.currentStudent.files.concat([action.payload])
      })
    });
  } else if (action.type === "REMOVE_FILE_FROM_CURRENT_STUDENT") {
    return Object.assign({}, state, {
      currentStudent: Object.assign({}, state.currentStudent, {
        files: state.currentStudent.files.filter((f) => f.id !== action.payload.id)
      })
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, { labels: action.payload.sort(sortLabels) })
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, { workspaces: action.payload })
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, { userGroups: action.payload })
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, { labels: state.availableFilters.labels.concat([action.payload]).sort(sortLabels) })
    });
  } else if (action.type === "UPDATE_GUIDER_AVAILABLE_FILTER_LABEL") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        labels: state.availableFilters.labels.map((label) => {
          if (label.id === action.payload.labelId) {
            return Object.assign({}, label, action.payload.update)
          }
          return label;
        }).sort(sortLabels)
      })
    });
  } else if (action.type === "DELETE_GUIDER_AVAILABLE_FILTER_LABEL") {
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        labels: state.availableFilters.labels.filter((label) => {
          return (label.id !== action.payload);
        })
      })
    });
  } else if (action.type === "TOGGLE_ALL_STUDENTS") {
    return Object.assign({}, state, {
      toggleAllStudentsActive: !state.toggleAllStudentsActive,
      selectedStudents: !state.toggleAllStudentsActive
        ? state.students
        : [],
      selectedStudentsIds: !state.toggleAllStudentsActive
        ? state.students.map((student) => student.id)
        : [],
    });
  }
  return state;
}
