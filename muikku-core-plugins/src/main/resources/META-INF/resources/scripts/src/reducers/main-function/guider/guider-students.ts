import {ActionType} from '~/actions';
import { UserWithSchoolDataType, UserGroupListType } from 'reducers/main-function/user-index';

export type GuiderStudentsStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export type GuiderCurrentStudentStateType = "LOADING" | "ERROR" | "READY";
export interface GuiderStudentsFilterType {
  workspaceFilters: Array<number>,
  labelFilters: Array<number>,
  query: string
}
export interface GuiderStudentType extends UserWithSchoolDataType {
  flags: Array<GuiderStudentUserProfileLabelType>
};
export type GuiderStudentListType = Array<GuiderStudentType>;

export interface GuiderStudentsType {
  state: GuiderStudentsStateType,
  filters: GuiderStudentsFilterType,
  students: GuiderStudentListType,
  hasMore: boolean,
  toolbarLock: boolean,
  current: GuiderStudentUserProfileType,
  selected: GuiderStudentListType,
  selectedIds: Array<string>,
  currentState: GuiderCurrentStudentStateType
}

export interface GuiderStudentsPatchType {
  state?: GuiderStudentsStateType,
  filters?: GuiderStudentsFilterType,
  students?: GuiderStudentListType,
  hasMore?: boolean,
  toolbarLock?: boolean,
  current?: GuiderStudentUserProfileType,
  selected?: GuiderStudentListType,
  selectedIds?: Array<string>,
  currentState?: GuiderCurrentStudentStateType
}

export interface GuiderStudentUserProfileLabelType {
  id: number,
  flagId: number,
  flagName: string,
  flagColor: string,
  studentIdentifier: string
}

export interface GuiderStudentUserProfileEmailType {
  studentIdentifier: string,
  type: string,
  address: string,
  defaultAddress: boolean
}

export interface GuiderStudentUserProfilePhoneType {
  studentIdentifier: string,
  type: string,
  number: string,
  defaultNumber: boolean
}

export interface GuiderStudentUserAddressType {
  identifier: string,
  studentIdentifier: string,
  street: string,
  postalCode: string,
  city: string,
  region: string,
  country: string,
  type: string,
  defaultAddress: boolean
}

export interface GuiderStudentUserFileType {
  id: number,
  userEntityId: number,
  fileName: string,
  contentType: string,
  title: string,
  description: string,
  archived: boolean
}

export interface GuiderVOPSRowItemType {
  courseNumber: number,
  description?: string,
  educationSubtype?: string,
  grade: string,
  mandatority: string,
  name: string,
  placeholder: boolean,
  planned: boolean,
  state: string
}

export interface GuiderVOPSRowType {
  subject: string,
  subjectIdentifier: string,
  items: Array<GuiderVOPSRowItemType>
}

export interface GuiderVOPSDataType {
  numMandatoryCourses: number,
  numCourses: number,
  optedIn: boolean,
  rows: Array<GuiderVOPSRowType>
}

export interface GuiderLastLoginStudentDataType {
  userIdentifier: string,
  authenticationProvder: string,
  address: string,
  time: string
}

//TODO hops has an enum defined structure
export interface GuiderHOPSDataType {
  goalSecondarySchoolDegree: "yes" | "no" | "maybe",
  goalMatriculationExam: "yes" | "no" | "maybe",
  vocationalYears: string,        //string wtf, but this shit is actually a number
  goalJustMatriculationExam: "yes" | "no",  //yo
  justTransferCredits: string,    //another disguised number
  transferCreditYears: string,    //disguides number
  completionYears: string,      //disguised number
  mathSyllabus: "MAA" | "MAB", 
  finnish: "AI" | "S2",
  swedish: boolean,
  english: boolean,
  german: boolean,
  french: boolean,
  italian: boolean,
  spanish: boolean,
  science: "BI" | "FY" | "KE" | "GE",
  religion: "UE" | "ET" | "UX",
  additionalInfo?: string,
  optedIn: boolean
}

//These are actually dates, might be present or not
//  studytime = Notification about study time ending
//  nopassedcourses = Notification about low number of finished courses in a year
//  assessmentrequest = Notification about inactivity in the first 2 months
export interface GuiderNotificationStudentsDataType {
  studytime?: string,
  nopassedcourses?: string,
  assessmentrequest?: string
}

export interface GuiderStudentUserProfileType {
  basic: GuiderStudentType,
  labels: Array<GuiderStudentUserProfileLabelType>,
  emails: Array<GuiderStudentUserProfileEmailType>,
  phoneNumbers: Array<GuiderStudentUserProfilePhoneType>,
  addresses: Array<GuiderStudentUserAddressType>,
  files: Array<GuiderStudentUserFileType>,
  usergroups: UserGroupListType,
  vops: GuiderVOPSDataType,
  hops: GuiderHOPSDataType,
  lastLogin: GuiderLastLoginStudentDataType,
  notifications: GuiderNotificationStudentsDataType
}

export default function guiderStudents(state: GuiderStudentsType={
  state: "LOADING",
  currentState: "READY",
  filters: {
    workspaceFilters: [],
    labelFilters: [],
    query: ""
  },
  students: [],
  hasMore: false,
  toolbarLock: false,
  selected: [],
  selectedIds: [],
  current: null
}, action: ActionType): GuiderStudentsType {
  if (action.type === "UPDATE_GUIDER_STUDENTS_FILTERS"){
    return Object.assign({}, state, {
      filters: action.payload
    });
  } else if (action.type === "UPDATE_GUIDER_STUDENTS_ALL_PROPS"){
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_GUIDER_STUDENTS_STATE"){
    return Object.assign({}, state, {
      state: action.payload
    });
  } else if (action.type === "ADD_TO_GUIDER_SELECTED_STUDENTS"){
    let student:GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selected: state.selected.concat([student]),
      selectedIds: state.selectedIds.concat([student.id])
    });
  } else if (action.type === "REMOVE_FROM_GUIDER_SELECTED_STUDENTS"){
    let student:GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selected: state.selected.filter(s=>s.id!==student.id),
      selectedIds: state.selectedIds.filter(id=>id!==student.id)
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT"){
    return Object.assign({}, state, {
      current: action.payload
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD"){
    return Object.assign({}, state, {
      current: {},
      currentState: "LOADING"
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_PROP"){
    let obj:any = {};
    obj[action.payload.property] = action.payload.value;
    return Object.assign({}, state, {
      current: Object.assign({}, state.current, obj)
    });
  } else if (action.type === "UPDATE_CURRENT_GUIDER_STUDENT_STATE"){
    return Object.assign({}, state, {
      currentState: action.payload
    });
  } else if (action.type === "ADD_GUIDER_LABEL_TO_USER" || action.type === "REMOVE_GUIDER_LABEL_FROM_USER"){
    let newCurrent:GuiderStudentUserProfileType;
  
    if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
      newCurrent = state.current && Object.assign({}, state.current);
      if (newCurrent && newCurrent.labels){
        newCurrent.labels = newCurrent.labels.concat([action.payload.label]);
      }
    } else {
      newCurrent = state.current && Object.assign({}, state.current);
      if (newCurrent && newCurrent.labels){
        newCurrent.labels = newCurrent.labels.filter((label)=>{
          return label.id !== action.payload.label.id;
        })
      }
    }
    
    let mapFn = function(student:GuiderStudentType){
      if (student.id === action.payload.studentId){
        if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
          return Object.assign({}, student, {
            flags: student.flags.concat([action.payload.label])
          });
        } else {
          return Object.assign({}, student, {
            flags: student.flags.filter((label)=>{
              return label.id !== action.payload.label.id;
            })
          });
        }
      }
      return student;
    }
    
    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selected: state.selected.map(mapFn),
      current: newCurrent
    });
  }
  return state;
}