import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { YODataType, YOStatusType, YOSubjectType, YOMatriculationSubjectType, YOEligibilityStatusType, YOEligibilityType } from '~/reducers/main-function/records/yo';
import { StateType } from '~/reducers';

export interface UPDATE_STUDIES_YO extends SpecificActionType<"UPDATE_STUDIES_YO", YODataType> {}
export interface UPDATE_STUDIES_YO_ELIGIBILITY_STATUS extends SpecificActionType<"UPDATE_STUDIES_YO_ELIGIBILITY_STATUS", YOEligibilityStatusType> {}
export interface UPDATE_STUDIES_YO_ELIGIBILITY extends SpecificActionType<"UPDATE_STUDIES_YO_ELIGIBILITY", YOEligibilityType> {}
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
          
      let subjects:YOSubjectType = await promisify(mApi().records.matriculationSubjects.read({
          matriculationSubjectsLoaded: true          
      }), 'callback')() as YOSubjectType;

      dispatch({
          type: 'UPDATE_STUDIES_YO_SUBJECTS',
          payload: subjects
        });
      
    
      let data:any = await promisify( mApi().records.studentMatriculationEligibility
              .read((window as any).MUIKKU_LOGGED_USER), 'callback')();      
      let eligibilityStatus = data.status;
      let eligibilityData = {
              coursesCompleted: data.coursesCompleted,
              coursesRequired: data.coursesRequired,
              enrollmentDate: data.enrollmentDate,
              examDate: data.examDate                        
            };
      
      dispatch({
          type: 'UPDATE_STUDIES_YO_ELIGIBILITY_STATUS',
          payload: eligibilityStatus
        });
      
      dispatch({
          type: 'UPDATE_STUDIES_YO_ELIGIBILITY',
          payload: eligibilityData
        });      
    }
    catch(err) {
      //TODO: ERR
    }
  }
} 

export default {updateYO};
export {updateYO};