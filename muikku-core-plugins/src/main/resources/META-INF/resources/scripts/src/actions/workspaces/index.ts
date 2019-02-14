import actions, { displayNotification } from '../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {WorkspaceListType, WorkspaceMaterialReferenceType, WorkspaceType, WorkspaceStudentActivityType, WorkspaceStudentAssessmentsType, WorkspaceFeeInfoType, WorkspaceAssessementStateType, WorkspaceAssessmentRequestType, WorkspaceEducationFilterListType, WorkspaceCurriculumFilterListType, WorkspacesActiveFiltersType, WorkspacesStateType, WorkspacesPatchType, WorkspaceAdditionalInfoType, WorkspaceUpdateType} from '~/reducers/workspaces';
import { StateType } from '~/reducers';
import { loadWorkspacesHelper } from '~/actions/workspaces/helpers';
import { UserStaffType, ShortWorkspaceUserWithActiveStatusType } from '~/reducers/user-index';
import { MaterialContentNodeType, WorkspaceProducerType, MaterialContentNodeListType, MaterialCompositeRepliesListType, MaterialCompositeRepliesStateType } from '~/reducers/workspaces';

export interface LoadUserWorkspacesFromServerTriggerType {
  ():AnyActionType
}

export type UPDATE_USER_WORKSPACES = SpecificActionType<"UPDATE_USER_WORKSPACES", WorkspaceListType>;
export type UPDATE_LAST_WORKSPACE = SpecificActionType<"UPDATE_LAST_WORKSPACE", WorkspaceMaterialReferenceType>;
export type SET_CURRENT_WORKSPACE = SpecificActionType<"SET_CURRENT_WORKSPACE", WorkspaceType>;
export type UPDATE_WORKSPACE_ASSESSMENT_STATE = SpecificActionType<"UPDATE_WORKSPACE_ASSESSMENT_STATE", {
  workspace: WorkspaceType,
  newState: WorkspaceAssessementStateType,
  newDate: string,
  newAssessmentRequest?: WorkspaceAssessmentRequestType,
  oldAssessmentRequestToDelete?: WorkspaceAssessmentRequestType
}>
export interface UPDATE_WORKSPACES_AVALIABLE_FILTERS_EDUCATION_TYPES extends SpecificActionType<"UPDATE_WORKSPACES_AVALIABLE_FILTERS_EDUCATION_TYPES", WorkspaceEducationFilterListType>{}
export interface UPDATE_WORKSPACES_AVALIABLE_FILTERS_CURRICULUMS extends SpecificActionType<"UPDATE_WORKSPACES_AVALIABLE_FILTERS_CURRICULUMS", WorkspaceCurriculumFilterListType>{}
export interface UPDATE_WORKSPACES_ACTIVE_FILTERS extends 
  SpecificActionType<"UPDATE_WORKSPACES_ACTIVE_FILTERS", WorkspacesActiveFiltersType>{}
export interface UPDATE_WORKSPACES_ALL_PROPS extends 
  SpecificActionType<"UPDATE_WORKSPACES_ALL_PROPS", WorkspacesPatchType>{}
export interface UPDATE_WORKSPACES_STATE extends 
  SpecificActionType<"UPDATE_WORKSPACES_STATE", WorkspacesStateType>{}
export interface UPDATE_WORKSPACE extends 
  SpecificActionType<"UPDATE_WORKSPACE", {
  original: WorkspaceType,
  update: WorkspaceUpdateType
}>{}
export interface UPDATE_WORKSPACES_SET_CURRENT_MATERIALS extends SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_MATERIALS", MaterialContentNodeListType>{};
export interface UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID extends SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID", number>{};
export interface UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES extends SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES", MaterialCompositeRepliesListType>{};
export interface UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER
  extends SpecificActionType<"UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER", {
    state: MaterialCompositeRepliesStateType,
    workspaceMaterialId: number,
    workspaceMaterialReplyId: number
}>{};

let loadUserWorkspacesFromServer:LoadUserWorkspacesFromServerTriggerType = function loadUserWorkspacesFromServer(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let userId = getState().status.userId;
    try {
      dispatch({
        type: "UPDATE_USER_WORKSPACES",
        payload: <WorkspaceListType>(await (promisify(mApi().workspace.workspaces.read({userId}), 'callback')()) || 0)
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.errormessage.workspaceLoadFailed"), 'error'));
    }
  }
}

export interface LoadLastWorkspaceFromServerTriggerType {
  ():AnyActionType
}

let loadLastWorkspaceFromServer:LoadLastWorkspaceFromServerTriggerType = function loadLastWorkspaceFromServer() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: 'UPDATE_LAST_WORKSPACE',
        payload: <WorkspaceMaterialReferenceType>JSON.parse(((await promisify(mApi().user.property.read('last-workspace'), 'callback')()) as any).value)
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.errormessage.lastWorkspaceLoadFailed"), 'error'));
    }
  }
}
  
export interface UpdateLastWorkspaceTriggerType {
  (newReference:WorkspaceMaterialReferenceType):AnyActionType
}

let updateLastWorkspace:UpdateLastWorkspaceTriggerType = function updateLastWorkspace(newReference) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().user.property.create({key: 'last-workspace', value: JSON.stringify(newReference)}), 'callback')();
      dispatch({
        type: 'UPDATE_LAST_WORKSPACE',
        payload: newReference
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}
  
export interface SetCurrentWorkspaceTriggerType {
  (data?: {
    workspaceId: number,
    refreshActivity?: boolean,
    success?: (workspace: WorkspaceType)=>any,
    fail?: ()=>any
  }):AnyActionType
}

function reuseExistantValue(conditional: boolean, existantValue: any, otherwise: ()=>any){
  if (!conditional){
    return null;
  }
  if (existantValue){
    return existantValue;
  }
  
  return otherwise();
}

let setCurrentWorkspace:SetCurrentWorkspaceTriggerType = function setCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let current:WorkspaceType = getState().workspaces.currentWorkspace;
    if (current && current.id === data.workspaceId && !data.refreshActivity){
      data.success && data.success(current);
      return;
    }
    
    try {
      let workspace:WorkspaceType = getState().workspaces.userWorkspaces.find(w=>w.id === data.workspaceId) ||
        getState().workspaces.availableWorkspaces.find(w=>w.id === data.workspaceId);
      if (current && current.id === data.workspaceId){
        //if I just make it be current it will be buggy
        workspace = {...current};
      }
      let assesments:WorkspaceStudentAssessmentsType;
      let feeInfo:WorkspaceFeeInfoType;
      let assessmentRequests:Array<WorkspaceAssessmentRequestType>;
      let activity:WorkspaceStudentActivityType;
      let additionalInfo:WorkspaceAdditionalInfoType;
      let contentDescription:MaterialContentNodeType;
      let help:MaterialContentNodeType;
      let producers:Array<WorkspaceProducerType>;
      let isCourseMember:boolean;
      let status = getState().status;
      [workspace, assesments, feeInfo, assessmentRequests, activity, additionalInfo, contentDescription, producers, help, isCourseMember] = await Promise.all([
                                                 reuseExistantValue(true, workspace, ()=>promisify(mApi().workspace.workspaces.cacheClear().read(data.workspaceId), 'callback')()),
                                                 
                                                 reuseExistantValue(status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT,
                                                     workspace && workspace.studentAssessments, ()=>promisify(mApi().workspace.workspaces
                                                     .students.assessments.cacheClear().read(data.workspaceId, status.userSchoolDataIdentifier), 'callback')()),
                                                 
                                                 reuseExistantValue(status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT,
                                                     workspace && workspace.feeInfo, ()=>promisify(mApi().workspace.workspaces.feeInfo.cacheClear().read(data.workspaceId), 'callback')()),
                                                 
                                                 reuseExistantValue(status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT,
                                                     workspace && workspace.assessmentRequests, ()=>promisify(mApi().assessmentrequest.workspace.assessmentRequests.cacheClear().read(data.workspaceId, {
                                                       studentIdentifier: getState().status.userSchoolDataIdentifier }), 'callback')()),
                                                 
                                                 getState().status.loggedIn ? reuseExistantValue(true,
                                                     //The way refresh works is by never giving an existant value to the reuse existant value function that way it will think that there's no value
                                                     //And rerequest
                                                     typeof data.refreshActivity !== "undefined" && data.refreshActivity ? null : workspace && workspace.studentActivity,
                                                     ()=>promisify(mApi().guider.workspaces.activity.cacheClear().read(data.workspaceId), 'callback')()) : null,
                                                 
                                                 reuseExistantValue(true, workspace && workspace.additionalInfo,
                                                     ()=>promisify(mApi().workspace.workspaces.additionalInfo.cacheClear().read(data.workspaceId), 'callback')()),
                                                 
                                                 reuseExistantValue(true, workspace && workspace.contentDescription,
                                                     ()=>promisify(mApi().workspace.workspaces.description.cacheClear().read(data.workspaceId), 'callback')()),
                                                 
                                                 reuseExistantValue(true, workspace && workspace.producers,
                                                     ()=>promisify(mApi().workspace.workspaces.materialProducers.cacheClear().read(data.workspaceId), 'callback')()),
                                                 
                                                 reuseExistantValue(true, workspace && workspace.help,
                                                     ()=>promisify(mApi().workspace.workspaces.help.cacheClear().read(data.workspaceId), 'callback')()),
                                                     
                                                 reuseExistantValue(true, workspace && typeof workspace.isCourseMember !== "undefined",
                                                     ()=>promisify(mApi().workspace.workspaces.amIMember.read(data.workspaceId), 'callback')())
                                                     
                                                  ]) as any
      workspace.studentAssessments = assesments;
      workspace.feeInfo = feeInfo;
      workspace.assessmentRequests = assessmentRequests;
      workspace.studentActivity = activity;
      workspace.additionalInfo = additionalInfo;
      workspace.contentDescription = contentDescription;
      workspace.producers = producers;
      workspace.help = help;
      workspace.isCourseMember = isCourseMember;

      dispatch({
        type: 'SET_CURRENT_WORKSPACE',
        payload: workspace
      });
      
      data.success && data.success(workspace);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("TODO ERRORMSG plugin.workspace.errormessage.workspaceLoadFailed"), 'error'));
      data.fail && data.fail();
    }
  }
}
  
export interface RequestAssessmentAtWorkspaceTriggerType {
  (data:{workspace: WorkspaceType, text: string, success?: ()=>any, fail?: ()=>any}):AnyActionType
}
  
let requestAssessmentAtWorkspace:RequestAssessmentAtWorkspaceTriggerType = function requestAssessmentAtWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let assessmentRequest:WorkspaceAssessmentRequestType = <WorkspaceAssessmentRequestType>(await promisify(mApi().assessmentrequest.workspace.assessmentRequests.create(data.workspace.id, {
        'requestText': data.text
      }), 'callback')());
      
      let newAssessmentState = data.workspace.studentAssessments ? data.workspace.studentAssessments.assessmentState : data.workspace.studentActivity.assessmentState.state;
      if (newAssessmentState === "unassessed"){
        newAssessmentState = 'pending';
      } else if (newAssessmentState == 'pass') {
        newAssessmentState = 'pending_pass';
      } else if (newAssessmentState == 'fail') {
        newAssessmentState = 'pending_fail';
      }
      
      dispatch({
        type: 'UPDATE_WORKSPACE_ASSESSMENT_STATE',
        payload: {
          workspace: data.workspace,
          newState: newAssessmentState,
          newDate: assessmentRequest.date,
          newAssessmentRequest: assessmentRequest
        }
      });
      
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.evaluation.requestEvaluation.notificationText"), 'success'));
      
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("TODO ERRORMSG plugin.workspace.errormessage.requestAssessmentFail"), 'error'));
      data.fail && data.fail();
    }
  }
}
  
export interface CancelAssessmentAtWorkspaceTriggerType {
  (data:{workspace: WorkspaceType, success?: ()=>any, fail?: ()=>any}):AnyActionType
}

let cancelAssessmentAtWorkspace:CancelAssessmentAtWorkspaceTriggerType = function cancelAssessmentAtWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let assessmentRequest:WorkspaceAssessmentRequestType = data.workspace.assessmentRequests[data.workspace.assessmentRequests.length - 1];
      if (!assessmentRequest){
        dispatch(actions.displayNotification(getState().i18n.text.get("TODO ERRORMSG plugin.workspace.errormessage.cancelAssessmentFail"), 'error'));
        data.fail && data.fail();
        return;
      }
      
      await promisify(mApi().assessmentrequest.workspace.assessmentRequests.del(data.workspace.id, assessmentRequest.id), 'callback')();
      
      let newAssessmentState = data.workspace.studentAssessments ? data.workspace.studentAssessments.assessmentState : data.workspace.studentActivity.assessmentState.state;
      if (newAssessmentState == 'pending') {
        newAssessmentState = 'unassessed';
      } else if (newAssessmentState == 'pending_pass') {
        newAssessmentState = 'pass';
      } else if (newAssessmentState == 'pending_fail') {
        newAssessmentState = 'fail';
      }
      
      dispatch({
        type: 'UPDATE_WORKSPACE_ASSESSMENT_STATE',
        payload: {
          workspace: data.workspace,
          newState: newAssessmentState,
          newDate: null,
          oldAssessmentRequestToDelete: assessmentRequest
        }
      });
      
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.evaluation.cancelEvaluation.notificationText"), 'success'));
      
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("TODO ERRORMSG plugin.workspace.errormessage.cancelAssessmentFail"), 'error'));
      data.fail && data.fail();
    }
  }
}
  
export interface LoadWorkspacesFromServerTriggerType {
  (filters: WorkspacesActiveFiltersType): AnyActionType
}
export interface LoadMoreWorkspacesFromServerTriggerType {
  (): AnyActionType
}
export interface LoadUserWorkspaceEducationFiltersFromServerTriggerType {
  ():AnyActionType
}
export interface LoadWholeWorkspaceMaterialsTriggerType {
  (workspaceId: number, callback?:(nodes: Array<MaterialContentNodeType>)=>any):AnyActionType
}
export interface SignupIntoWorkspaceTriggerType {
  (data: {
    success: ()=>any,
    fail: ()=>any,
    workspace: WorkspaceType,
    message: string,
  }):AnyActionType
}
export interface SetCurrentWorkspaceMaterialsActiveNodeIdTriggerType {
  (id: number):AnyActionType
}
export interface LoadWorkspaceCompositeMaterialReplies {
  (id: number):AnyActionType
}
export interface UpdateAssignmentStateTriggerType {
  (successState: MaterialCompositeRepliesStateType, avoidServerCall: boolean, workspaceId: number, workspaceMaterialId: number, existantReplyId?: number, successMessage?: string, callback?: ()=>any):AnyActionType
}

export interface LoadUserWorkspaceCurriculumFiltersFromServerTriggerType {
  (callback?: (curriculums: WorkspaceCurriculumFilterListType)=>any):AnyActionType
}

export interface UpdateWorkspaceTriggerType {
  (workspace: WorkspaceType, update: WorkspaceUpdateType):AnyActionType
}

export interface LoadStaffMembersOfWorkspaceTriggerType {
  (workspace: WorkspaceType):AnyActionType
}

export interface LoadStudentsOfWorkspaceTriggerType {
  (workspace: WorkspaceType):AnyActionType
}

export interface ToggleActiveStateOfStudentOfWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType,
    student: ShortWorkspaceUserWithActiveStatusType,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

let loadWorkspacesFromServer:LoadWorkspacesFromServerTriggerType= function loadWorkspacesFromServer(filters){
  return loadWorkspacesHelper.bind(this, filters, true);
}

let loadMoreWorkspacesFromServer:LoadMoreWorkspacesFromServerTriggerType = function loadMoreWorkspacesFromServer(){
  return loadWorkspacesHelper.bind(this, null, false);
}

let loadUserWorkspaceEducationFiltersFromServer:LoadUserWorkspaceEducationFiltersFromServerTriggerType = function loadUserWorkspaceEducationFiltersFromServer(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: "UPDATE_WORKSPACES_AVALIABLE_FILTERS_EDUCATION_TYPES",
        payload: <WorkspaceEducationFilterListType>(await promisify(mApi().workspace.educationTypes.read(), 'callback')())
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.educationFilters"), 'error'));
    }
  }
}
  
let loadUserWorkspaceCurriculumFiltersFromServer:LoadUserWorkspaceCurriculumFiltersFromServerTriggerType = function loadUserWorkspaceCurriculumFiltersFromServer(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let curriculums = <WorkspaceCurriculumFilterListType>(await promisify(mApi().coursepicker.curriculums.read(), 'callback')())
      dispatch({
        type: "UPDATE_WORKSPACES_AVALIABLE_FILTERS_CURRICULUMS",
        payload: curriculums
      });
      callback && callback(curriculums);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.curriculumFilters"), 'error'));
    }
  }
}

let signupIntoWorkspace:SignupIntoWorkspaceTriggerType = function signupIntoWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().coursepicker.workspaces.signup.create(data.workspace.id, {
        message: data.message
      }), 'callback')();
      window.location.href = `${getState().status.contextPath}/workspace/${data.workspace.urlName}`;
      data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('plugin.workspaceSignUp.notif.error'), 'error'));
      data.fail();
    }
  }
}

let updateWorkspace:UpdateWorkspaceTriggerType = function updateWorkspace(original, update){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let actualOriginal:WorkspaceType = {...original};
    delete actualOriginal["studentActivity"];
    delete actualOriginal["forumStatistics"];
    delete actualOriginal["studentAssessments"];
    delete actualOriginal["activityStatistics"];
    delete actualOriginal["feeInfo"];
    delete actualOriginal["assessmentRequests"];
    delete actualOriginal["additionalInfo"];
    delete actualOriginal["staffMembers"];
    delete actualOriginal["students"];
    
    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: {
        original,
        update
      }
    });
    
    try {
      await promisify(mApi().workspace.workspaces.update(original.id,
        Object.assign(actualOriginal, update)), 'callback')();
    } catch (err){
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          original,
          update: actualOriginal
        }
      });
      
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update workspace'), 'error'));
    }
  }
}

let loadStaffMembersOfWorkspace:LoadStaffMembersOfWorkspaceTriggerType = function loadStaffMembersOfWorkspace(workspace){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let staffMembers = <Array<UserStaffType>>(await promisify(mApi().user.staffMembers.read({
        workspaceEntityId: workspace.id,
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end'
      }), 'callback')());
      
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          original: workspace,
          update: {
            staffMembers
          }
        }
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to load teachers'), 'error'));
    }
  }
}

let loadStudentsOfWorkspace:LoadStudentsOfWorkspaceTriggerType = function loadStudentsOfWorkspace(workspace){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let students = <Array<ShortWorkspaceUserWithActiveStatusType>>(await promisify(mApi().workspace.workspaces.students.read(workspace.id), 'callback')());
      
      let update:WorkspaceUpdateType = {
          students
      };
      
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          original: workspace,
          update
        }
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to load students'), 'error'));
    }
  }
}

let toggleActiveStateOfStudentOfWorkspace:ToggleActiveStateOfStudentOfWorkspaceTriggerType = function toggleActiveStateOfStudentOfWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let oldStudents = data.workspace.students;
    try {
      let newStudent = {...data.student, active: !data.student.active};
      let newStudents = data.workspace.students && data.workspace.students.map(student=>{
        if (student.workspaceUserEntityId === newStudent.workspaceUserEntityId){
          return newStudent;
        }
        return student;
      });
      
      await promisify(mApi().workspace.workspaces.students.update(data.workspace.id, newStudent.workspaceUserEntityId, {
        workspaceUserEntityId: newStudent.workspaceUserEntityId,
        active: newStudent.active
      }), 'callback')();
      
      if (newStudents){
        dispatch({
          type: 'UPDATE_WORKSPACE',
          payload: {
            original: data.workspace,
            update: {
              students: newStudents
            }
          }
        });
      }
      
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      if (oldStudents){
        dispatch({
          type: 'UPDATE_WORKSPACE',
          payload: {
            original: data.workspace,
            update: {
              students: oldStudents
            }
          }
        });
      }
      data.fail && data.fail();
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to toggle student state'), 'error'));
    }
  }
}

let loadWholeWorkspaceMaterials:LoadWholeWorkspaceMaterialsTriggerType = function loadWholeWorkspaceMaterials(workspaceId, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let contentNodes:Array<MaterialContentNodeType> = <Array<MaterialContentNodeType>>(await promisify(mApi().workspace.
          workspaces.materialContentNodes.read(workspaceId), 'callback')()) || [];
      dispatch({
        type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
        payload: contentNodes
      });
      callback && callback(contentNodes);
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to load materials'), 'error'));
    }
  }
}

let setCurrentWorkspaceMaterialsActiveNodeId:SetCurrentWorkspaceMaterialsActiveNodeIdTriggerType = function setCurrentWorkspaceMaterialsActiveNodeId(id){
  return {
    type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID",
    payload: id
  }
}

let loadWorkspaceCompositeMaterialReplies:LoadWorkspaceCompositeMaterialReplies = function loadWorkspaceCompositeMaterialReplies(id){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let compositeReplies:MaterialCompositeRepliesListType = <MaterialCompositeRepliesListType>(await promisify(mApi().workspace.
          workspaces.compositeReplies.read(id), 'callback')());
      dispatch({
        type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES",
        payload: compositeReplies || []
      });
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to load material composite replies'), 'error'));
    }
  }
}

//Updates the evaluated assignment state, and either updates an existant composite reply or creates a new one as incomplete,
//that is no answers
let updateAssignmentState:UpdateAssignmentStateTriggerType = function updateAssignmentState(successState, avoidServerCall, workspaceId, workspaceMaterialId, existantReplyId, successMessage, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let replyId:number = existantReplyId;
      if (!replyId && !avoidServerCall){
        let result:Array<{id: number, state: string}> = await promisify(mApi().workspace.workspaces.materials.replies.read(workspaceId, workspaceMaterialId), 'callback')() as Array<{id: number, state: string}>;
        if (result[0] && result[0].id){
          replyId = result[0].id;
        }
      }
      if (!avoidServerCall){
        let replyGenerated:any = await promisify(existantReplyId ? mApi().workspace.workspaces.materials.replies
            .update(workspaceId, workspaceMaterialId, existantReplyId, {
              state: successState
            }) : mApi().workspace.workspaces.materials.replies
            .create(workspaceId, workspaceMaterialId, {
              state: successState
            }), 'callback')();
        replyId = replyGenerated ? replyGenerated.id : existantReplyId;
      }
      
      //Indeed the reply id will be null in the case of answered setting it up
      dispatch({
        type: "UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER",
        payload: {
          workspaceMaterialReplyId: replyId,
          state: successState,
          workspaceMaterialId
        }
      });
      
      callback && callback();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to deliver to the server'), 'error'));
    }
  }
}

export {loadUserWorkspaceCurriculumFiltersFromServer, loadUserWorkspaceEducationFiltersFromServer, loadWorkspacesFromServer, loadMoreWorkspacesFromServer,
  signupIntoWorkspace, loadUserWorkspacesFromServer, loadLastWorkspaceFromServer, setCurrentWorkspace, requestAssessmentAtWorkspace, cancelAssessmentAtWorkspace,
  updateWorkspace, loadStaffMembersOfWorkspace, loadWholeWorkspaceMaterials, setCurrentWorkspaceMaterialsActiveNodeId, loadWorkspaceCompositeMaterialReplies,
  updateAssignmentState, updateLastWorkspace, loadStudentsOfWorkspace, toggleActiveStateOfStudentOfWorkspace}