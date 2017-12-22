import {ActionType} from '~/actions';
import { UserWithSchoolDataType } from 'reducers/main-function/user-index';

export type GuiderStudentsStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export interface GuiderStudentsFilterType {
  workspaceFilters: Array<number>,
  labelFilters: Array<number>,
  query: string
}
export type GuiderStudentType = UserWithSchoolDataType;
export type GuiderStudentListType = Array<GuiderStudentType>;

export interface GuiderStudentsType {
  state: GuiderStudentsStateType,
  filters: GuiderStudentsFilterType,
  students: GuiderStudentListType,
  hasMore: boolean,
  toolbarLock: boolean,
  current: any,
  selected: GuiderStudentListType,
  selectedIds: Array<string>
}

export interface GuiderStudentsPatchType {
  state?: GuiderStudentsStateType,
  filters?: GuiderStudentsFilterType,
  students?: GuiderStudentListType,
  hasMore?: boolean,
  toolbarLock?: boolean,
  current?: any,
  selected?: GuiderStudentListType,
  selectedIds?: Array<string>
}

export default function coursepickerCourses(state: GuiderStudentsType={
  state: "LOADING",
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
  }
  return state;
}