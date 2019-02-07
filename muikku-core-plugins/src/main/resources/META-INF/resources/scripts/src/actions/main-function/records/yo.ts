import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { YODataType, YOStatusType, YOMatriculationSubjectType, YOEligibilityStatusType, YOEligibilityType } from '~/reducers/main-function/records/yo';
import { SubjectEligibilityType } from '~/reducers/main-function/records/subject_eligibility';

import { updateMatriculationSubjectEligibility } from '~/actions/main-function/records/subject_eligibility';

import { StateType } from '~/reducers';


export interface UPDATE_STUDIES_YO extends SpecificActionType<"UPDATE_STUDIES_YO", YODataType> {}
export interface UPDATE_STUDIES_YO_ELIGIBILITY_STATUS extends SpecificActionType<"UPDATE_STUDIES_YO_ELIGIBILITY_STATUS", YOEligibilityStatusType> {}
export interface UPDATE_STUDIES_YO_ELIGIBILITY extends SpecificActionType<"UPDATE_STUDIES_YO_ELIGIBILITY", YOEligibilityType> {}
export interface UPDATE_STUDIES_YO_SUBJECTS extends SpecificActionType<"UPDATE_STUDIES_YO_SUBJECTS", YOMatriculationSubjectType> {}
export interface UPDATE_STUDIES_YO_STATUS extends SpecificActionType<"UPDATE_STUDIES_YO_STATUS", YOStatusType>{}


export interface updateYOTriggerType {
  ():AnyActionType
}

let updateYO:updateYOTriggerType = function updateYO() {

   return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: 'UPDATE_STUDIES_YO',
        payload: null
      });
      dispatch({
        type: 'UPDATE_STUDIES_YO_STATUS',
        payload: <YOStatusType>"LOADING"
      });
      let subjects:YOMatriculationSubjectType = await promisify(mApi().records.matriculationSubjects.read({
          matriculationSubjectsLoaded: true          
      }), 'callback')() as YOMatriculationSubjectType;

      dispatch({
        type: 'UPDATE_STUDIES_YO_SUBJECTS',
        payload: subjects
      });
    
      let egilibity:any = await promisify( mApi().records.studentMatriculationEligibility
              .read((window as any).MUIKKU_LOGGED_USER), 'callback')();      
      let eligibilityStatus = egilibity.status;
      let eligibilityData = {
              coursesCompleted: egilibity.coursesCompleted,
              coursesRequired: egilibity.coursesRequired,
              enrollmentDate: egilibity.enrollmentDate,
              examDate: egilibity.examDate                        
            };
      
      dispatch({
          type: 'UPDATE_STUDIES_YO_ELIGIBILITY_STATUS',
          payload: eligibilityStatus
        });
      
      dispatch({
          type: 'UPDATE_STUDIES_YO_ELIGIBILITY',
          payload: eligibilityData
       });

      dispatch({
        type: 'UPDATE_STUDIES_YO_STATUS',
        payload: <YOStatusType>"READY"
      });
    }
    catch(err) {
      //TODO: ERR
    }
  }
} 

export default {updateYO};
export {updateYO};