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
  return state;
} 