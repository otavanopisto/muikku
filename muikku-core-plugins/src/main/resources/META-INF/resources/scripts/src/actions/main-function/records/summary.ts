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
        type: 'UPDATE_STUDIES_SUMMARY_STATUS',
        payload: <SummaryStatusType>"LOADING"
      });
      
      
      /* Get user id */
      
      let pyramusId = getState().status.userSchoolDataIdentifier;
            
      /* We need completed courses from Eligibility */

      let eligibility:any = await promisify( mApi().records.studentMatriculationEligibility
          .read(pyramusId), 'callback')();

      /* We need past month activity */
      
      let activityLogs:any = await promisify(mApi().activitylogs.user
          .read(pyramusId, {from: new Date(new Date().setMonth(new Date().getMonth()-1)), to: new Date()}), 'callback')();

      /* We need returned exercises */

      let exercisesDone:any = [];

      /* Getting past the object with keys */
      
      let activityArrays:any = Object.keys(activityLogs).map(key => activityLogs[key]); 

      /* picking the done exercises from the objects */
      
      activityArrays.forEach(function(element:any) {
        element.find(function(param:any) {
          param["type"] == "MATERIAL_EXERCISEDONE" ? exercisesDone.push(param["type"]) : null;
        });
      });
      
      
      /* Does have matriculation examination in goals? */


      
      let summaryData = {
        coursesDone: eligibility.coursesCompleted,
        activity: activityLogs.general.length,
        returnedExercises: exercisesDone.length,
      }
      
      dispatch({               
        type: 'UPDATE_STUDIES_SUMMARY',
        payload: summaryData
      });
      
      dispatch({               
        type: 'UPDATE_STUDIES_SUMMARY_STATUS',
        payload: <SummaryStatusType>"READY"
      });      
    }
    catch(err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.records.summary.errormessage.summaryUpdateFailed"), 'error'));
    }
  }
} 


export default {updateSummary};
export {updateSummary};