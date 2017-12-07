import { ActionType } from "~/actions";

export interface EducationFilterType {
  identifier: string,
  name: string
}

export interface CurriculumFilterType {
  identifier: string,
  name: string
}

export interface CoursepickerFilters {
  educationTypes: Array<EducationFilterType>,
  curriculums: Array<CurriculumFilterType>
}

export default function areas(state: CoursepickerFilters={
  educationTypes: [],
  curriculums: []
}, action: ActionType): CoursepickerFilters {
  if (action.type === "UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYES"){
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