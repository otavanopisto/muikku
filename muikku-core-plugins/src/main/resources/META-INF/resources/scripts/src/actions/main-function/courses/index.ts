import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import notificationActions from '~/actions/base/notifications';
import { CoursesActiveFiltersType, CoursesPatchType, CoursesStateType, CourseEducationFilterListType, CourseCurriculumFilterListType } from '~/reducers/main-function/courses';
import { loadCoursesHelper } from './helpers';
import { StateType } from '~/reducers';

export interface UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES extends SpecificActionType<"UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES", CourseEducationFilterListType>{}
export interface UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS extends SpecificActionType<"UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS", CourseCurriculumFilterListType>{}
export interface UPDATE_COURSES_ACTIVE_FILTERS extends 
  SpecificActionType<"UPDATE_COURSES_ACTIVE_FILTERS", CoursesActiveFiltersType>{}
export interface UPDATE_COURSES_ALL_PROPS extends 
  SpecificActionType<"UPDATE_COURSES_ALL_PROPS", CoursesPatchType>{}
export interface UPDATE_COURSES_STATE extends 
  SpecificActionType<"UPDATE_COURSES_STATE", CoursesStateType>{}
  
export interface LoadCoursesFromServerTriggerType {
  (filters: CoursesActiveFiltersType): AnyActionType
}
export interface LoadMoreCoursesFromServerTriggerType {
  (): AnyActionType
}
export interface LoadAvaliableEducationFiltersFromServerTriggerType {
  ():AnyActionType
}

export interface LoadAvaliableCurriculumFiltersFromServerTriggerType {
  (callback?: (curriculums: CourseCurriculumFilterListType)=>any):AnyActionType
}

let loadCoursesFromServer:LoadCoursesFromServerTriggerType = function loadCoursesFromServer(filters){
  return loadCoursesHelper.bind(this, filters, true);
}

let loadMoreCoursesFromServer:LoadMoreCoursesFromServerTriggerType = function loadMoreCoursesFromServer(){
  return loadCoursesHelper.bind(this, null, false);
}

let loadAvaliableEducationFiltersFromServer:LoadAvaliableEducationFiltersFromServerTriggerType = function loadAvaliableEducationFiltersFromServer(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: "UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES",
        payload: <CourseEducationFilterListType>(await promisify(mApi().workspace.educationTypes.read(), 'callback')())
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
let loadAvaliableCurriculumFiltersFromServer:LoadAvaliableCurriculumFiltersFromServerTriggerType = function loadAvaliableCurriculumFiltersFromServer(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let curriculums = <CourseCurriculumFilterListType>(await promisify(mApi().coursepicker.curriculums.read(), 'callback')())
    try {
      dispatch({
        type: "UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS",
        payload: curriculums
      });
      callback && callback(curriculums);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

export {loadAvaliableCurriculumFiltersFromServer, loadAvaliableEducationFiltersFromServer, loadCoursesFromServer, loadMoreCoursesFromServer};
export default {loadAvaliableCurriculumFiltersFromServer, loadAvaliableEducationFiltersFromServer, loadCoursesFromServer, loadMoreCoursesFromServer};