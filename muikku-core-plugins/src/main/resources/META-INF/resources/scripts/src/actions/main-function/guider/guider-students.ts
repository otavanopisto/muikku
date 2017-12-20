import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { GuiderStudentsFilterType, GuiderStudentsPatchType, GuiderStudentsStateType } from '~/reducers/main-function/guider/guider-students';
import { loadStudentsHelper } from './guider-students/helpers';

export interface UPDATE_GUIDER_STUDENTS_FILTERS extends 
  SpecificActionType<"UPDATE_GUIDER_STUDENTS_FILTERS", GuiderStudentsFilterType>{}
export interface UPDATE_GUIDER_STUDENTS_ALL_PROPS extends 
  SpecificActionType<"UPDATE_GUIDER_STUDENTS_ALL_PROPS", GuiderStudentsPatchType>{}
export interface UPDATE_GUIDER_STUDENTS_STATE extends 
  SpecificActionType<"UPDATE_GUIDER_STUDENTS_STATE", GuiderStudentsStateType>{}
  
export interface LoadStudentsTriggerType {
  (filters: GuiderStudentsFilterType): AnyActionType
}
export interface LoadMoreStudentsTriggerType {
  (): AnyActionType
}

let loadStudents:LoadStudentsTriggerType = function loadStudents(filters){
  return loadStudentsHelper.bind(this, filters, true);
}
  
let loadMoreStudents:LoadMoreStudentsTriggerType = function loadMoreStudents(){
  return loadStudentsHelper.bind(this, null, false);
}

export {loadStudents, loadMoreStudents};
export default {loadStudents, loadMoreStudents};