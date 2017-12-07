import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { EducationFilterListType, CurriculumFilterListType } from '~/reducers/main-function/coursepicker/coursepicker-filters';

export interface UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYPES extends SpecificActionType<"UPDATE_COURSEPICKER_FILTERS_EDUCATION_TYPES", EducationFilterListType>{}
export interface UPDATE_COURSEPICKER_FILTERS_CURRICULUMS extends SpecificActionType<"UPDATE_COURSEPICKER_FILTERS_CURRICULUMS", CurriculumFilterListType>{}

export interface UpdateEducationFiltersTriggerType {
  ():AnyActionType
}

export interface UpdateCurriculumFiltersTriggerType {
  ():AnyActionType
}

let updateEducationFilters:UpdateEducationFiltersTriggerType = function updateEducationFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    
  }
}
  
let updateCurriculumFilters:UpdateCurriculumFiltersTriggerType = function updateCurriculumFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
     
  }
}