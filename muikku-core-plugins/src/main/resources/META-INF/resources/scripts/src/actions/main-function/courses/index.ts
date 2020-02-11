import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import notificationActions from '~/actions/base/notifications';
import { CoursesActiveFiltersType, CoursesPatchType, CoursesStateType, CourseEducationFilterListType, CourseCurriculumFilterListType, CourseOrganizationFilterListType, WorkspaceCourseType } from '~/reducers/main-function/courses';
import { loadCoursesHelper } from './helpers';
import { StateType } from '~/reducers';

export interface UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES extends SpecificActionType<"UPDATE_COURSES_AVALIABLE_FILTERS_EDUCATION_TYPES", CourseEducationFilterListType>{}
export interface UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS extends SpecificActionType<"UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS", CourseCurriculumFilterListType>{}
export interface UPDATE_COURSES_AVAILABLE_FILTERS_ORGANIZATIONS extends SpecificActionType<"UPDATE_COURSES_AVAILABLE_FILTERS_ORGANIZATIONS", CourseOrganizationFilterListType>{}
export interface UPDATE_COURSES_ACTIVE_FILTERS extends 
  SpecificActionType<"UPDATE_COURSES_ACTIVE_FILTERS", CoursesActiveFiltersType>{}
export interface UPDATE_COURSES_ALL_PROPS extends 
  SpecificActionType<"UPDATE_COURSES_ALL_PROPS", CoursesPatchType>{}
export interface UPDATE_COURSES_STATE extends 
  SpecificActionType<"UPDATE_COURSES_STATE", CoursesStateType>{}
  
export interface LoadCoursesFromServerTriggerType {
  (filters: CoursesActiveFiltersType, loadOrganizationCourses: boolean): AnyActionType
}
export interface LoadMoreCoursesFromServerTriggerType {
  (): AnyActionType
}
export interface LoadAvaliableEducationFiltersFromServerTriggerType {
  ():AnyActionType
}
export interface SignupIntoCourseTriggerType {
  (data: {
    success: ()=>any,
    fail: ()=>any,
    course: WorkspaceCourseType,
    message: string,
  }):AnyActionType
}

export interface LoadAvaliableCurriculumFiltersFromServerTriggerType {
  (callback?: (curriculums: CourseCurriculumFilterListType)=>any):AnyActionType
}

export interface LoadAvailableOrganizationFiltersFromServerTriggerType {
  (callback?: (organizations: CourseOrganizationFilterListType) => any):AnyActionType
}

let loadCoursesFromServer:LoadCoursesFromServerTriggerType = function loadCoursesFromServer(filters, loadOrganizationCourses){
  return loadCoursesHelper.bind(this, filters, loadOrganizationCourses, true);
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
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.educationFilters"), 'error'));
    }
  }
}
  
let loadAvaliableCurriculumFiltersFromServer:LoadAvaliableCurriculumFiltersFromServerTriggerType = function loadAvaliableCurriculumFiltersFromServer(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let curriculums = <CourseCurriculumFilterListType>(await promisify(mApi().coursepicker.curriculums.read(), 'callback')())
      dispatch({
        type: "UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS",
        payload: curriculums
      });
      callback && callback(curriculums);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.curriculumFilters"), 'error'));
    }
  }
}

let loadAvailableOrganizationFiltersFromServer:LoadAvailableOrganizationFiltersFromServerTriggerType = function loadAvailableOrganizationFiltersFromServer(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let organizations = <CourseOrganizationFilterListType>(await promisify(mApi().coursepicker.organizations.read(), 'callback')())
      dispatch({
        type: "UPDATE_COURSES_AVAILABLE_FILTERS_ORGANIZATIONS",
        payload: organizations
      });
      callback && callback(organizations);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.curriculumFilters"), 'error'));
    }
  }
}

let signupIntoCourse:SignupIntoCourseTriggerType = function signupIntoCourse(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().coursepicker.workspaces.signup.create(data.course.id, {
        message: data.message
      }), 'callback')();
      window.location.href = `${getState().status.contextPath}/workspace/${data.course.urlName}`;
      data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get('plugin.workspaceSignUp.notif.error'), 'error'));
      data.fail();
    }
  }
}

export {loadAvaliableCurriculumFiltersFromServer, loadAvaliableEducationFiltersFromServer, loadAvailableOrganizationFiltersFromServer, loadCoursesFromServer, loadMoreCoursesFromServer, signupIntoCourse};
export default {loadAvaliableCurriculumFiltersFromServer, loadAvaliableEducationFiltersFromServer, loadAvailableOrganizationFiltersFromServer, loadCoursesFromServer, loadMoreCoursesFromServer, signupIntoCourse};