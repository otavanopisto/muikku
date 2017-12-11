import { ActionType } from "~/actions";

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

export interface CoursepickerFiltersType {
  educationTypes: EducationFilterListType,
  curriculums: CurriculumFilterListType
}

export default function areas(state: CoursepickerFiltersType={
  educationTypes: [],
  curriculums: []
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