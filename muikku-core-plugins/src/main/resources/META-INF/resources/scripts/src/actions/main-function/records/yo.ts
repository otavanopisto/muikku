import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { YODataType, YOStatusType } from '~/reducers/main-function/records/yo';
import { StateType } from '~/reducers';

export interface UPDATE_STUDIES_YO extends SpecificActionType<"UPDATE_STUDIES_YO", YODataType> {}
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
    }
    catch(err) {
      //TODO: ERR
    }
  }
} 


export default {updateYO};
export {updateYO};