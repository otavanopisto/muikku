import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { SubjectEligibilityType, EligibleStatusType } from '~/reducers/main-function/records/subject_eligibility';
import { StateType } from '~/reducers';

export interface UPDATE_STUDIES_SUBJECT_ELIGIBILITY extends SpecificActionType<"UPDATE_STUDIES_SUBJECT_ELIGIBILITY", SubjectEligibilityType> {}

export interface UpdateMatriculationSubjectEligibilityTriggerType {
  (subjectCode?:string):AnyActionType
}

let updateMatriculationSubjectEligibility:UpdateMatriculationSubjectEligibilityTriggerType = function updateMatriculationSubjectEligibility(subjectCode) {

   return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let subjectEligibility:any = await promisify(mApi().records.matriculationEligibility.read({"subjectCode" : subjectCode}), 'callback')();
      let subjectEligibilityData = {
          eligibility: subjectEligibility.eligible ? <EligibleStatusType>"ELIGIBLE" : <EligibleStatusType>"NOT_ELIGIBLE",
          requiredCount: subjectEligibility.requirePassingGrades,
          acceptedCount: subjectEligibility.acceptedCourseCount + subjectEligibility.acceptedTransferCreditCount,
          loading: false
      }
      dispatch({
        type: 'UPDATE_STUDIES_SUBJECT_ELIGIBILITY',
        payload: subjectEligibilityData
      });
    }
    catch(err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.records.yo.errormessage.eligibilityUpdateFailed"), 'error'));
    }
  }
} 

export default {updateMatriculationSubjectEligibility};
export {updateMatriculationSubjectEligibility};