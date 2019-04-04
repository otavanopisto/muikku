import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { SummaryDataType, SummaryStatusType, SummaryWorkspaceListType } from '~/reducers/main-function/records/summary';
import { WorkspaceListType, WorkspaceStudentActivityType, WorkspaceForumStatisticsType, ActivityLogType} from '~/reducers/main-function/workspaces';
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

      /* We need returned exercises and evaluated courses */

      let exercisesDone:any = [];
      let coursesDone:any = [];
      
      
      /* Getting past the object with keys */
      
      let activityArrays:any = Object.keys(activityLogs).map(key => activityLogs[key]); 

      /* picking the done exercises and evaluated courses from the objects */
      
      activityArrays.forEach(function(element:any) {
        element.find(function(param:any) {
          param["type"] == "MATERIAL_EXERCISEDONE" ? exercisesDone.push(param["type"]) : param["type"] == "EVALUATION_GOTPASSED" ? coursesDone.push(param["type"]) : null;
        });
      });
      
      /* User workspaces */
      
      let workspaces:any = await promisify(mApi().workspace.workspaces.read({userIdentifier: pyramusId, includeInactiveWorkspaces: true}), 'callback')();
        if (workspaces && workspaces.length){
          await Promise.all(workspaces.map(async (workspace:any, index:number) => {
              let courseActivity:ActivityLogType[] = <ActivityLogType[]>await promisify(mApi().activitylogs.user.workspace
              .read(pyramusId, {workspaceEntityId: workspace.id, from: new Date(new Date().getFullYear()-2, 0), to: new Date()}), 'callback')();
              workspaces[index].activityLogs = courseActivity
            }));
          }
      
      
      
//        if (workspaces && workspaces.length){
//          await Promise.all([
//                             Promise.all(workspaces.map(async (workspace, index)=>{
//                               let activity:WorkspaceStudentActivityType = <WorkspaceStudentActivityType>await promisify(mApi().guider.workspaces.studentactivity
//                                   .read(workspace.id, pyramusId), 'callback')();
//                                 workspaces[index].studentActivity = activity;
//                               })
//                             ),
//                             Promise.all(workspaces.map(async (workspace, index)=>{
//                               let statistics:WorkspaceForumStatisticsType = <WorkspaceForumStatisticsType>await promisify(mApi().workspace.workspaces.forumStatistics
//                                   .read(workspace.id, {userIdentifier: pyramusId}), 'callback')();
//                                 workspaces[index].forumStatistics = statistics;
//                               })
//                             ),
//                             Promise.all(workspaces.map(async (workspace, index)=>{
//                               let activityLogs:ActivityLogType[] = <ActivityLogType[]>await promisify(mApi().activitylogs.user.workspace
//                                   .read(pyramusId, {workspaceEntityId: workspace.id, from: new Date(new Date().getFullYear()-2, 0), to: new Date()}), 'callback')();
//                                 workspaces[index].activityLogs = activityLogs;
//                               })
//                             )
//                           ]);
//        }
//      })
      
      
      
      let graphData = {
        activity : activityLogs.general,
        workspaces:  workspaces
      }
      
      /* Does have matriculation examination in goals? */
      
      let summaryData = {
        eligibilityStatus: eligibility.coursesCompleted,
        activity: activityLogs.general.length,
        returnedExercises: exercisesDone.length,
        coursesDone: coursesDone.length,
        graphData: graphData
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