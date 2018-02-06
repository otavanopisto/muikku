import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { EducationFilterListType, CurriculumFilterListType } from '~/reducers/main-function/coursepicker/coursepicker-filters';
import notificationActions from '~/actions/base/notifications';

export interface UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYPES extends SpecificActionType<"UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYPES", EducationFilterListType>{}
export interface UPDATE_COURSEPICKER_FILTERS_CURRICULUMS extends SpecificActionType<"UPDATE_COURSEPICKER_FILTERS_CURRICULUMS", CurriculumFilterListType>{}

export interface UpdateEducationFiltersTriggerType {
  ():AnyActionType
}

export interface UpdateCurriculumFiltersTriggerType {
  (callback?: (curriculums: CurriculumFilterListType)=>any):AnyActionType
}

let updateEducationFilters:UpdateEducationFiltersTriggerType = function updateEducationFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: "UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYPES",
        payload: <EducationFilterListType>(await promisify(mApi().workspace.educationTypes.read(), 'callback')())
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
let updateCurriculumFilters:UpdateCurriculumFiltersTriggerType = function updateCurriculumFilters(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let curriculums = <CurriculumFilterListType>(await promisify(mApi().coursepicker.curriculums.read(), 'callback')())
    try {
      dispatch({
        type: "UPDATE_COURSEPICKER_FILTERS_CURRICULUMS",
        payload: curriculums
      });
      callback && callback(curriculums);
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

export {updateCurriculumFilters, updateEducationFilters}
export default {updateCurriculumFilters, updateEducationFilters}