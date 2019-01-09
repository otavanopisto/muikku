import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { YODataType, YOStatusType, YOSubjectType, YOMatriculationSubjectType} from '~/reducers/main-function/records/yo';
import { StateType } from '~/reducers';

export interface UPDATE_STUDIES_YO extends SpecificActionType<"UPDATE_STUDIES_YO", YODataType> {}
export interface UPDATE_STUDIES_YO_SUBJECTS extends SpecificActionType<"UPDATE_STUDIES_YO_SUBJECTS", YOSubjectType> {}
export interface UPDATE_STUDIES_YO_STATUS extends SpecificActionType<"UPDATE_STUDIES_YO_STATUS", YOStatusType>{}

export interface UpdateYOTriggerType {
  ():AnyActionType
}

let updateYO:UpdateYOTriggerType = function updateYO() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: 'UPDATE_STUDIES_YO',
        payload: null
      });
          
//      let subjects:Array<YOSubjectType> = await promisify(mApi().records.matriculationSubjects.read({
//      }), 'callback')() as Array<YOSubjectType>;
//
//      dispatch({
//          type: 'UPDATE_STUDIES_YO_SUBJECTS',
//          payload: null
//        });      
      
    }
    catch(err) {
      //TODO: ERR
    }
  }
} 
  
  





export default {updateYO};
export {updateYO};