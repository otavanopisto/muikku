import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import notificationActions from '~/actions/base/notifications';
import { CousePickerCoursesFilterType, CoursePickerCoursesPatchType, CoursePickerCoursesStateType } from '~/reducers/main-function/coursepicker/coursepicker-courses';
import { loadCoursesHelper } from './coursepicker-courses/helpers';

export interface UPDATE_COURSEPICKER_COURSES_FILTERS extends 
  SpecificActionType<"UPDATE_COURSEPICKER_COURSES_FILTERS", CousePickerCoursesFilterType>{}
export interface UPDATE_COURSEPICKER_COURSES_ALL_PROPS extends 
  SpecificActionType<"UPDATE_COURSEPICKER_COURSES_ALL_PROPS", CoursePickerCoursesPatchType>{}
export interface UPDATE_COURSEPICKER_COURSES_STATE extends 
  SpecificActionType<"UPDATE_COURSEPICKER_COURSES_STATE", CoursePickerCoursesStateType>{}
  
export interface LoadCoursesTriggerType {
  (filters: CousePickerCoursesFilterType): AnyActionType
}
export interface LoadMoreCoursesTriggerType {
  (): AnyActionType
}

let loadCourses:LoadCoursesTriggerType = function loadCourses(filters){
  return loadCoursesHelper.bind(this, filters, true);
}
  
let loadMoreCourses:LoadMoreCoursesTriggerType = function loadMoreCourses(){
  return loadCoursesHelper.bind(this, null, false);
}

export {loadCourses, loadMoreCourses};
export default {loadCourses, loadMoreCourses};