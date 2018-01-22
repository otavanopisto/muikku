import { ActionType } from "~/actions";

export type CoursePickerBaseFilterType = "ALL_COURSES" | "MY_COURSES" | "AS_TEACHER";

export interface EducationFilterType {
  identifier: string,
  name: string
}

export interface EducationFilterListType extends Array<EducationFilterType> {};

export interface CurriculumFilterType {
  identifier: string,
  name: string
}

export interface CurriculumFilterListType extends Array<CurriculumFilterType> {};

export type CoursePickerBaseFilterListType = Array<CoursePickerBaseFilterType>;

export interface CoursepickerFiltersType {
  educationTypes: EducationFilterListType,
  curriculums: CurriculumFilterListType,
  baseFilters: CoursePickerBaseFilterListType
}

export default function areas(state: CoursepickerFiltersType={
  educationTypes: [],
  curriculums: [],
  baseFilters: ["ALL_COURSES", "MY_COURSES", "AS_TEACHER"]
}, action: ActionType): CoursepickerFiltersType {
  if (action.type === "UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYPES"){
    return Object.assign({}, state, {
      educationTypes: action.payload
    });
  } else if (action.type === "UPDATE_COURSEPICKER_FILTERS_CURRICULUMS"){
    return Object.assign({}, state, {
      curriculums: action.payload
    });
  }
  return state;
}