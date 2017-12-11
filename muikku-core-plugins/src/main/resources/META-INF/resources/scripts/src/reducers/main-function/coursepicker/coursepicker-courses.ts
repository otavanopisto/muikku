import {ActionType} from '~/actions';
import { CoursePickerBaseFilterType } from '~/reducers/main-function/coursepicker/coursepicker-filters';

export type CoursePickerCoursesStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export interface CousePickerCoursesFilterType {
  educationFilters: Array<string>,
  curriculumFilters: Array<string>,
  query: string,
  baseFilter: CoursePickerBaseFilterType
}
export interface CoursePickerCourseType {
  id: number,
  urlName: string,
  archived: boolean,
  name: string,
  nameExtension?: string,
  description: string,
  numVisits: number,
  lastVisit: string,
  published: boolean,
  canSignup: boolean,
  isCourseMember: boolean,
  educationTypeName: string,
  hasCustomImage: boolean
}
export type CoursePickerCourseListType = Array<CoursePickerCourseType>;
export interface CoursePickerCoursesType {
  state: CoursePickerCoursesStateType,
  filters: CousePickerCoursesFilterType,
  courses: CoursePickerCourseListType,
  hasMore: boolean,
  toolbarLock: boolean
}

export interface CoursePickerCoursesPatchType {
  state?: CoursePickerCoursesStateType,
  filters?: CousePickerCoursesFilterType,
  courses?: Array<any>,
  hasMore?: boolean,
  toolbarLock?: boolean
}

export default function coursepickerCourses(state: CoursePickerCoursesType={
  state: "LOADING",
  filters: {
    educationFilters: [],
    curriculumFilters: [],
    query: "",
    baseFilter: "ALL_COURSES"
  },
  courses: [],
  hasMore: false,
  toolbarLock: false
}, action: ActionType): CoursePickerCoursesType {
  if (action.type === "UPDATE_COURSEPICKER_COURSES_FILTERS"){
    return Object.assign({}, state, {
      filters: action.payload
    });
  } else if (action.type === "UPDATE_COURSEPICKER_COURSES_ALL_PROPS"){
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_COURSEPICKER_COURSES_STATE"){
    return Object.assign({}, state, {
      state: action.payload
    });
  }
  return state;
}