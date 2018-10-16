import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { SummaryDataType, SummaryStatusType } from '~/reducers/main-function/records/summary';
import { StateType } from '~/reducers';

export interface UPDATE_STUDIES_SUMMARY extends SpecificActionType<"UPDATE_STUDIES_SUMMARY", SummaryDataType> {}
export interface UPDATE_STUDIES_SUMMARY_STATUS extends SpecificActionType<"UPDATE_STUDIES_SUMMARY_STATUS", SummaryStatusType>{}

export interface UpdateSummaryTriggerType {
  ():AnyActionType
}
 
let updateSummary:UpdateSummaryTriggerType = function updateSummary() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: 'UPDATE_STUDIES_SUMMARY',
        payload: null
      });
    }
    catch(err) {
      //TODO: ERR
    }
  }
} 


export default {updateSummary};
export {updateSummary};