import actions, { displayNotification } from '../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {WorkspaceListType, WorkspaceMaterialReferenceType, WorkspaceType, WorkspaceStudentActivityType, WorkspaceStudentAssessmentsType, WorkspaceFeeInfoType, WorkspaceAssessementStateType, WorkspaceAssessmentRequestType, WorkspaceEducationFilterListType, WorkspaceCurriculumFilterListType, WorkspacesActiveFiltersType, WorkspacesStateType, WorkspacesPatchType, WorkspaceAdditionalInfoType, WorkspaceUpdateType} from '~/reducers/workspaces';
import { StateType } from '~/reducers';
import { loadWorkspacesHelper, loadCurrentWorkspaceJournalsHelper } from '~/actions/workspaces/helpers';
import { UserStaffType, ShortWorkspaceUserWithActiveStatusType } from '~/reducers/user-index';
import { MaterialContentNodeListType, MaterialCompositeRepliesListType, MaterialCompositeRepliesStateType,
  WorkspaceJournalsType, WorkspaceJournalType, WorkspaceDetailsType, WorkspaceTypeType, WorkspaceProducerType,
  WorkspacePermissionsType, WorkspaceMaterialEditorType, MaterialContentNodeProducerType, MaterialContentNodeType,
  WorkspaceEditModeStateType, 
  WorkspaceOrganizationFilterListType} from '~/reducers/workspaces';
import equals = require("deep-equal");
import $ from '~/lib/jquery';

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
export type UPDATE_WORKSPACES_EDIT_MODE_STATE = SpecificActionType<"UPDATE_WORKSPACES_EDIT_MODE_STATE", Partial<WorkspaceEditModeStateType>>;
export type UPDATE_WORKSPACES_AVALIABLE_FILTERS_EDUCATION_TYPES = SpecificActionType<"UPDATE_WORKSPACES_AVALIABLE_FILTERS_EDUCATION_TYPES", WorkspaceEducationFilterListType>
export type UPDATE_WORKSPACES_AVALIABLE_FILTERS_CURRICULUMS = SpecificActionType<"UPDATE_WORKSPACES_AVALIABLE_FILTERS_CURRICULUMS", WorkspaceCurriculumFilterListType>
export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS = SpecificActionType<"UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS", WorkspaceOrganizationFilterListType>
export type UPDATE_WORKSPACES_ACTIVE_FILTERS = 
  SpecificActionType<"UPDATE_WORKSPACES_ACTIVE_FILTERS", WorkspacesActiveFiltersType>
export type UPDATE_WORKSPACES_ALL_PROPS = 
  SpecificActionType<"UPDATE_WORKSPACES_ALL_PROPS", WorkspacesPatchType>
export type UPDATE_WORKSPACES_STATE = 
  SpecificActionType<"UPDATE_WORKSPACES_STATE", WorkspacesStateType>
export type UPDATE_WORKSPACE = 
  SpecificActionType<"UPDATE_WORKSPACE", {
  original: WorkspaceType,
  update: WorkspaceUpdateType
}>
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS = SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_MATERIALS", MaterialContentNodeListType>;
export type UPDATE_WORKSPACES_SET_CURRENT_HELP = SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_HELP", MaterialContentNodeListType>;
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID = SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID", number>;
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES = SpecificActionType<"UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES", MaterialCompositeRepliesListType>;
export type UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER
  = SpecificActionType<"UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER", {
    state: MaterialCompositeRepliesStateType,
    workspaceMaterialId: number,
    workspaceMaterialReplyId: number
}>;
export type UPDATE_MATERIAL_CONTENT_NODE = SpecificActionType<"UPDATE_MATERIAL_CONTENT_NODE", {
  showRemoveAnswersDialogForPublish: boolean,
  material: MaterialContentNodeType,
  update: Partial<MaterialContentNodeType>,
  isDraft?: boolean,
}>;
export type DELETE_MATERIAL_CONTENT_NODE = SpecificActionType<"DELETE_MATERIAL_CONTENT_NODE", MaterialContentNodeType>;
export type INSERT_MATERIAL_CONTENT_NODE = SpecificActionType<"INSERT_MATERIAL_CONTENT_NODE", MaterialContentNodeType>;
export type UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES = SpecificActionType<"UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES", {
  material: MaterialContentNodeType,
  newPath: string;
}>;

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
    fail?: ()=>any,
    loadDetails?: boolean,
  }):AnyActionType
}

export interface UpdateCurrentWorkspaceImagesB64TriggerType {
  (data?: {
    delete?: boolean,
    originalB64?: string,
    croppedB64?: string,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface LoadCurrentWorkspaceUserGroupPermissionsTriggerType {
  ():AnyActionType
}

export interface UpdateCurrentWorkspaceUserGroupPermissionTriggerType {
  (data?: {
    original: WorkspacePermissionsType,
    update: WorkspacePermissionsType,
    success?: ()=>any,
    fail?: ()=>any,
  }):AnyActionType
}

export interface SetWorkspaceMaterialEditorStateTriggerType {
  (newState: WorkspaceMaterialEditorType, loadCurrentDraftNodeValue?: boolean):AnyActionType
}

export interface RequestWorkspaceMaterialContentNodeAttachmentsTriggerType {
  (workspace: WorkspaceType, material: MaterialContentNodeType):AnyActionType
}

export interface UpdateWorkspaceMaterialContentNodeTriggerType {
  (data: {
    workspace: WorkspaceType,
    material: MaterialContentNodeType,
    update: Partial<MaterialContentNodeType>,
    isDraft?: boolean,
    removeAnswers?: boolean,
    success?: ()=>any,
    fail?: ()=>any,
    dontTriggerReducerActions?: boolean,
  }):AnyActionType
}

export interface DeleteWorkspaceMaterialContentNodeTriggerType {
  (data: {
    material: MaterialContentNodeType,
    workspace: WorkspaceType,
    removeAnswers?: boolean,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface CreateWorkspaceMaterialContentNodeTriggerType {
  (data: {
    parentMaterial?: MaterialContentNodeType,
    makeFolder: boolean,
    rootParentId: number,
    nextSibling?: MaterialContentNodeType,
    copyWorkspaceId?: number,
    copyMaterialId?: number,
    title?: string,
    file?: File,
    workspace: WorkspaceType,
    success?: (newNode: MaterialContentNodeType)=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface CreateWorkspaceMaterialAttachmentTriggerType {
  (data: {
    workspace: WorkspaceType,
    material: MaterialContentNodeType,
    files: File[],
    success?: () => any,
    fail?: () => any,
  }):AnyActionType
}

export interface UpdateWorkspaceEditModeStateTriggerType {
  (data: Partial<WorkspaceEditModeStateType>, recoverActiveFromLocalStorage?: boolean):AnyActionType
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
    if (current && current.id === data.workspaceId && !data.refreshActivity && !data.loadDetails){
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
      let journals:WorkspaceJournalsType;
      let details:WorkspaceDetailsType;
      let status = getState().status;
      [workspace, assesments, feeInfo, assessmentRequests, activity, additionalInfo, contentDescription, producers, isCourseMember, journals, details] = await Promise.all([
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
                                                     
                                                 reuseExistantValue(true, workspace && typeof workspace.isCourseMember !== "undefined" && workspace.isCourseMember,
                                                     ()=>promisify(mApi().workspace.workspaces.amIMember.read(data.workspaceId), 'callback')()),
                                                     
                                                 reuseExistantValue(true, workspace && workspace.journals, ()=>null),
                                                 
                                                 data.loadDetails ? reuseExistantValue(true, workspace && workspace.details,
                                                     ()=>promisify(mApi().workspace.workspaces
                                                         .details.read(data.workspaceId), 'callback')()) : null,
                                                     
                                                  ]) as any
      workspace.studentAssessments = assesments;
      workspace.feeInfo = feeInfo;
      workspace.assessmentRequests = assessmentRequests;
      workspace.studentActivity = activity;
      workspace.additionalInfo = additionalInfo;
      workspace.contentDescription = contentDescription;
      workspace.producers = producers;
      workspace.isCourseMember = isCourseMember;
      workspace.journals = journals;
      workspace.details = details;

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
      } else {
        newAssessmentState = 'pending';
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
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.errormessage.cancelAssessmentFail"), 'error'));
      data.fail && data.fail();
    }
  }
}
  
export interface LoadWorkspacesFromServerTriggerType {
  (filters: WorkspacesActiveFiltersType): AnyActionType
}
export interface LoadCurrentWorkspaceJournalsFromServerTriggerType {
  (userEntityId?: number): AnyActionType
}
export interface LoadMoreWorkspacesFromServerTriggerType {
  (): AnyActionType
}
export interface LoadMoreCurrentWorkspaceJournalsFromServerTriggerType {
  (): AnyActionType
}
export interface LoadUserWorkspaceEducationFiltersFromServerTriggerType {
  ():AnyActionType
}
export interface LoadWholeWorkspaceMaterialsTriggerType {
  (workspaceId: number, includeHidden: boolean, callback?:(nodes: Array<MaterialContentNodeType>)=>any):AnyActionType
}
export interface LoadWholeWorkspaceHelpTriggerType {
  (workspaceId: number, includeHidden: boolean, callback?:(nodes: Array<MaterialContentNodeType>)=>any):AnyActionType
}
export interface SetWholeWorkspaceMaterialsTriggerType {
  (materials: MaterialContentNodeListType): AnyActionType
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

export interface LoadUserWorkspaceOrganizationFiltersFromServerTriggerType {
  (callback?: (organizations: WorkspaceOrganizationFilterListType) => any):AnyActionType;
}

export interface UpdateWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType,
    update: WorkspaceUpdateType,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
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

let loadCurrentWorkspaceJournalsFromServer:LoadCurrentWorkspaceJournalsFromServerTriggerType = function loadCurrentWorkspaceJournalsFromServer(userEntityId){
  return loadCurrentWorkspaceJournalsHelper.bind(this, userEntityId || null, true);
}

let loadMoreCurrentWorkspaceJournalsFromServer:LoadMoreCurrentWorkspaceJournalsFromServerTriggerType = function loadMoreCurrentWorkspaceJournalsFromServer(){
  return loadCurrentWorkspaceJournalsHelper.bind(this, null, false);
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

let loadUserWorkspaceOrganizationFiltersFromServer:LoadUserWorkspaceOrganizationFiltersFromServerTriggerType = function loadAvailableOrganizationFiltersFromServer(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let organizations = <WorkspaceOrganizationFilterListType>(await promisify(mApi().coursepicker.organizations.read(), 'callback')())
      dispatch({
        type: "UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS",
        payload: organizations
      });
      callback && callback(organizations);
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

let updateWorkspace:UpdateWorkspaceTriggerType = function updateWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let actualOriginal:WorkspaceType = {...data.workspace};
    delete actualOriginal["studentActivity"];
    delete actualOriginal["forumStatistics"];
    delete actualOriginal["studentAssessments"];
    delete actualOriginal["studentAssessmentState"];
    delete actualOriginal["activityStatistics"];
    delete actualOriginal["feeInfo"];
    delete actualOriginal["assessmentRequests"];
    delete actualOriginal["additionalInfo"];
    delete actualOriginal["staffMembers"];
    delete actualOriginal["students"];
    delete actualOriginal["details"];
    delete actualOriginal["producers"];
    delete actualOriginal["contentDescription"];
    delete actualOriginal["isCourseMember"];
    delete actualOriginal["journals"];
    delete actualOriginal["activityLogs"];
    delete actualOriginal["permissions"];
    
    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: {
        original: data.workspace,
        update: data.update
      }
    });
    
    try {
      await promisify(mApi().workspace.workspaces.update(data.workspace.id,
        Object.assign(actualOriginal, data.update)), 'callback')();
      
      data.success && data.success()
    } catch (err){
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          original: data.workspace,
          update: actualOriginal
        }
      });
      
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update workspace'), 'error'));
      
      data.fail && data.fail();
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

let loadWholeWorkspaceMaterials:LoadWholeWorkspaceMaterialsTriggerType = function loadWholeWorkspaceMaterials(workspaceId, includeHidden, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let contentNodes:Array<MaterialContentNodeType> = <Array<MaterialContentNodeType>>(await promisify(mApi().workspace.
          workspaces.materialContentNodes.read(workspaceId, {includeHidden}), 'callback')()) || [];
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

let loadWholeWorkspaceHelp:LoadWholeWorkspaceHelpTriggerType = function loadWholeWorkspaceMaterials(workspaceId, includeHidden, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let contentNodes:Array<MaterialContentNodeType> = <Array<MaterialContentNodeType>>(await promisify(mApi().workspace.workspaces.help
          .cacheClear().read(workspaceId, {includeHidden}), 'callback')()) || [];
      dispatch({
        type: "UPDATE_WORKSPACES_SET_CURRENT_HELP",
        payload: contentNodes
      });
      callback && callback(contentNodes);
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to load help'), 'error'));
    }
  }
}

let setWholeWorkspaceMaterials:SetWholeWorkspaceMaterialsTriggerType = function setWholeWorkspaceMaterials(materials){
  return {
    type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
    payload: materials
  }
}

let setWholeWorkspaceHelp:SetWholeWorkspaceMaterialsTriggerType = function setWholeWorkspaceHelp(materials){
  return {
    type: "UPDATE_WORKSPACES_SET_CURRENT_HELP",
    payload: materials
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
      if (!replyId){
        let result:Array<{id: number, state: string}> = await promisify(mApi().workspace.workspaces.materials.replies.read(workspaceId, workspaceMaterialId), 'callback')() as Array<{id: number, state: string}>;
        if (result[0] && result[0].id){
          replyId = result[0].id;
        }
      }
      
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

export interface CreateWorkspaceJournalForCurrentWorkspaceTriggerType {
  (data: {
    title: string,
    content: string,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface UpdateWorkspaceJournalInCurrentWorkspaceTriggerType {
  (data: {
    journal: WorkspaceJournalType,
    title: string,
    content: string,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface DeleteWorkspaceJournalInCurrentWorkspaceTriggerType {
  (data: {
    journal: WorkspaceJournalType,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface LoadWorkspaceDetailsInCurrentWorkspaceTriggerType {
  ():AnyActionType
}

export interface UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType {
  (data: {
    newDetails: WorkspaceDetailsType,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface UpdateWorkspaceProducersForCurrentWorkspaceTriggerType {
  (data: {
    appliedProducers: Array<WorkspaceProducerType>,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface LoadWorkspaceTypesTriggerType {
  ():AnyActionType
}

export interface DeleteCurrentWorkspaceImageTriggerType {
  ():AnyActionType
}

export type CopyCurrentWorkspaceStepType = "initial-copy" | "change-date" | "copy-areas" | "copy-materials" | "copy-background-picture" | "done";

export interface CopyCurrentWorkspaceTriggerType {
  (data: {
    description: string,
    name: string,
    nameExtension?: string,
    beginDate: string,
    endDate: string,
    copyDiscussionAreas: boolean,
    copyMaterials: "NO" | "CLONE" | "LINK",
    copyBackgroundPicture: boolean,
    success: (
      step: CopyCurrentWorkspaceStepType,
      workspace: WorkspaceType
    )=>any,
    fail: ()=>any
  }):AnyActionType
}

let createWorkspaceJournalForCurrentWorkspace:CreateWorkspaceJournalForCurrentWorkspaceTriggerType = function createWorkspaceJournalForCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      let newJournal:WorkspaceJournalType = <WorkspaceJournalType>(await promisify(mApi().workspace.workspaces
          .journal.create(state.workspaces.currentWorkspace.id, {
            content: data.content,
            title: data.title
          }), 'callback')());
    
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            journals: {
              journals: [newJournal].concat(currentWorkspace.journals.journals),
              hasMore: currentWorkspace.journals.hasMore,
              userEntityId: currentWorkspace.journals.userEntityId,
              state: currentWorkspace.journals.state
            }
          }
        }
      });
      
      data.success && data.success();
    
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to create workspace'), 'error'));
      data.fail && data.fail();
    }
  }
}
  
let updateWorkspaceJournalInCurrentWorkspace:UpdateWorkspaceJournalInCurrentWorkspaceTriggerType = function updateWorkspaceJournalInCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      await promisify(mApi().workspace.workspaces
          .journal.update(state.workspaces.currentWorkspace.id, data.journal.id, {id: data.journal.id, workspaceEntityId: state.workspaces.currentWorkspace.id, content: data.content, title: data.title}), 'callback')();
    
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            journals: {
              journals: currentWorkspace.journals.journals.map(j=>{
                if (j.id === data.journal.id){
                  return {...j, content: data.content, title: data.title};
                }
                return j;
              }),
              hasMore: currentWorkspace.journals.hasMore,
              userEntityId: currentWorkspace.journals.userEntityId,
              state: currentWorkspace.journals.state
            }
          }
        }
      });
      
      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to create workspace'), 'error'));
      data.fail && data.fail();
    }
  }
}

let deleteWorkspaceJournalInCurrentWorkspace:DeleteWorkspaceJournalInCurrentWorkspaceTriggerType = function deleteWorkspaceJournalInCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      await promisify(mApi().workspace.workspaces
          .journal.del(state.workspaces.currentWorkspace.id, data.journal.id), 'callback')();
    
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            journals: {
              journals: currentWorkspace.journals.journals.filter(j=>j.id !== data.journal.id),
              hasMore: currentWorkspace.journals.hasMore,
              userEntityId: currentWorkspace.journals.userEntityId,
              state: currentWorkspace.journals.state
            }
          }
        }
      });
      
      data.success && data.success();
    
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to create workspace'), 'error'));
      data.fail && data.fail();
    }
  }
}

let loadWorkspaceDetailsInCurrentWorkspace:LoadWorkspaceDetailsInCurrentWorkspaceTriggerType = function loadWorkspaceDetailsInCurrentWorkspace(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      let details:WorkspaceDetailsType = <WorkspaceDetailsType>(await promisify(mApi().workspace.workspaces
          .details.read(state.workspaces.currentWorkspace.id), 'callback')());

      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            details 
          }
        }
      });
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to fetch workspace details'), 'error'));
    }
  }
}

let updateWorkspaceDetailsForCurrentWorkspace:UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType = function updateWorkspaceDetailsForCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      await promisify(mApi().workspace.workspaces
          .details.update(state.workspaces.currentWorkspace.id, data.newDetails), 'callback')();

      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            details: data.newDetails 
          }
        }
      });

      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update workspace details'), 'error'));

      data.fail && data.fail();
    }
  }
}

let updateWorkspaceProducersForCurrentWorkspace:UpdateWorkspaceProducersForCurrentWorkspaceTriggerType = function updateWorkspaceProducersForCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      let existingProducers = state.workspaces.currentWorkspace.producers;

      let workspaceProducersToAdd = (existingProducers.length == 0) ? data.appliedProducers :
        data.appliedProducers.filter(producer => {          
          if (!producer.id) {
            return producer;
          }
        });

      let workspaceProducersToDelete = existingProducers.filter(producer => {
        if (producer.id) {
          return !data.appliedProducers.find(keepProducer => keepProducer.id === producer.id)
        }
      });

      await Promise.all(workspaceProducersToAdd.map(p=>
        promisify(mApi().workspace.workspaces
            .materialProducers.create(state.workspaces.currentWorkspace.id, p), 'callback')())
        .concat(workspaceProducersToDelete.map(p=>promisify(mApi().workspace.workspaces
            .materialProducers.del(state.workspaces.currentWorkspace.id, p.id), 'callback')())));

      // For some reason the results of the request don't give the new workspace producers
      // it's a mess but whatever
      let newActualWorkspaceProducers:Array<WorkspaceProducerType> = <Array<WorkspaceProducerType>>(await promisify(mApi().workspace.workspaces.materialProducers
          .cacheClear().read(state.workspaces.currentWorkspace.id), 'callback')())

      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            producers: newActualWorkspaceProducers 
          }
        }
      });

      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update workspace details'), 'error'));

      data.fail && data.fail();
    }
  }
}

let loadWorkspaceTypes:LoadWorkspaceTypesTriggerType = function loadWorkspaceTypes(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let workspaceTypes:Array<WorkspaceTypeType> = <Array<WorkspaceTypeType>>(await promisify(mApi().workspace.workspaceTypes
          .read(), 'callback')());

      dispatch({
        type: "UPDATE_WORKSPACES_ALL_PROPS",
        payload: {
          types: workspaceTypes
        }
      });
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to fetch workspace types'), 'error'));
    }
  }
}

let deleteCurrentWorkspaceImage:DeleteCurrentWorkspaceImageTriggerType = function deleteCurrentWorkspaceImage(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      await Promise.all([
        promisify(mApi().workspace.workspaces.workspacefile
          .del(state.workspaces.currentWorkspace.id, 'workspace-frontpage-image-cropped'), 'callback')(),
        promisify(mApi().workspace.workspaces
          .del(state.workspaces.currentWorkspace.id, 'workspace-frontpage-image-original'), 'callback')(),
      ]);

      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            hasCustomImage: false 
          }
        }
      });
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to delete workspace image'), 'error'));
    }
  }
}

let copyCurrentWorkspace:CopyCurrentWorkspaceTriggerType = function copyCurrentWorkspace(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      let cloneWorkspace:WorkspaceType = <WorkspaceType>(await promisify(mApi().workspace.workspaces
          .create(
          {
            name: data.name,
            nameExtension: data.nameExtension,
            description: data.description
          },
          {
            sourceWorkspaceEntityId: currentWorkspace.id
          }), 'callback')());

      data.success && data.success("initial-copy", cloneWorkspace);

      cloneWorkspace.details = <WorkspaceDetailsType>(await promisify(mApi().workspace.workspaces
          .details.read(cloneWorkspace.id), 'callback')());

      cloneWorkspace.details = <WorkspaceDetailsType>(await promisify(mApi().workspace.workspaces
          .details.update(cloneWorkspace.id, {
            ...cloneWorkspace.details,
            beginDate: data.beginDate,
            endDate: data.endDate
          }), 'callback')());

      data.success && data.success("change-date", cloneWorkspace);

      if (data.copyDiscussionAreas){
        await promisify(mApi().workspace.workspaces
            .forumAreas.create(cloneWorkspace.id, {}, {sourceWorkspaceEntityId: currentWorkspace.id}), 'callback')();
        data.success && data.success("copy-areas", cloneWorkspace);
      }

      if (data.copyMaterials !== "NO"){
        await promisify(mApi().workspace.workspaces.materials
          .create(cloneWorkspace.id, {}, { 
            sourceWorkspaceEntityId: currentWorkspace.id, 
            targetWorkspaceEntityId: cloneWorkspace.id, 
            copyOnlyChildren: true,
            cloneMaterials: (data.copyMaterials as any) === "COPY"
          }), 'callback')()
          data.success && data.success("copy-materials", cloneWorkspace);
      }

      if (data.copyBackgroundPicture){
        await promisify(
          mApi().workspace.workspaces.workspacefilecopy
          .create(currentWorkspace.id, cloneWorkspace.id), 'callback')();
        data.success && data.success("copy-background-picture", cloneWorkspace);
      }

      data.success && data.success("done", cloneWorkspace);
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to clone workspace'), 'error'));

      data.fail && data.fail();
    }
  }
}

let updateCurrentWorkspaceImagesB64:UpdateCurrentWorkspaceImagesB64TriggerType = function updateCurrentWorkspaceImagesB64(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      let mimeTypeRegex = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;
      let mimeTypeOriginal = data.originalB64 && data.originalB64.match(mimeTypeRegex)[1];
      let mimeTypeCropped = data.croppedB64 && data.croppedB64.match(mimeTypeRegex)[1];

      if (data.delete){
        await promisify(mApi().workspace.workspaces.workspacefile
            .del(currentWorkspace.id, 'workspace-frontpage-image-cropped'), 'callback')();
      } else if (data.croppedB64) {
        await promisify(mApi().workspace.workspaces.workspacefile
        .create(currentWorkspace.id, {
          fileIdentifier: 'workspace-frontpage-image-cropped',
          contentType: mimeTypeCropped,
          base64Data: data.croppedB64
        }), 'callback')();
      }
      
      if (data.delete) {
        await promisify(mApi().workspace.workspaces.workspacefile
          .del(currentWorkspace.id, 'workspace-frontpage-image-original'), 'callback')();
      } else if (data.originalB64) {
        await promisify(mApi().workspace.workspaces.workspacefile
        .create(currentWorkspace.id, {
          fileIdentifier: 'workspace-frontpage-image-original',
          contentType: mimeTypeOriginal,
          base64Data: data.originalB64
        }), 'callback')();
      }

      data.success && data.success();

    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update workspace images'), 'error'));

      data.fail && data.fail();
    }
  }
}

let loadCurrentWorkspaceUserGroupPermissions:LoadCurrentWorkspaceUserGroupPermissionsTriggerType = function loadCurrentWorkspaceUserGroupPermissions() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let state:StateType = getState();
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;

      let permissions:WorkspacePermissionsType[] = <WorkspacePermissionsType[]>(await promisify(mApi().permission.workspaceSettings.userGroups
          .read(currentWorkspace.id), 'callback')());

      let currentWorkspaceAsOfNow:WorkspaceType = getState().workspaces.currentWorkspace;

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspaceAsOfNow,
          update: {
            permissions
          }
        }
      }); 

    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to load current workspace user group permissions'), 'error'));
    }
  }
}

let updateCurrentWorkspaceUserGroupPermission:UpdateCurrentWorkspaceUserGroupPermissionTriggerType = function updateCurrentWorkspaceUserGroupPermission(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let currentPermissions;
    try {
      let state:StateType = getState();
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      currentPermissions = currentWorkspace.permissions;

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            permissions: currentPermissions.map((permissionValue) => {
              if (permissionValue.userGroupEntityId === data.update.userGroupEntityId) {
                return data.update;
              }

              return permissionValue;
            })
          }
        }
      });

      await promisify(mApi().permission.workspaceSettings.userGroups
          .update(currentWorkspace.id, data.original.userGroupEntityId, data.update), 'callback')();
      
      data.success && data.success();

    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
      
      data.fail && data.fail();

      let state:StateType = getState();
      let currentWorkspace:WorkspaceType = getState().workspaces.currentWorkspace;
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: currentWorkspace,
          update: {
            permissions: currentPermissions
          }
        }
      }); 
      dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update permission value'), 'error'));
    }
  }
}

let setWorkspaceMaterialEditorState:SetWorkspaceMaterialEditorStateTriggerType = function setWorkspaceMaterialEditorState(newState: WorkspaceMaterialEditorType, loadCurrentDraftNodeValue){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    const currentNodeValue = newState.currentNodeValue;
    // TODO do mApi stuff
    let currentDraftNodeValue;
    const currentDraftNodeValueByStorage =
      localStorage.getItem("TEMPORARY_LOCAL_DRAFT_" + currentNodeValue.workspaceMaterialId + "_" + newState.currentNodeWorkspace.id);
    if (!currentDraftNodeValueByStorage) {
      newState.currentDraftNodeValue = {...currentNodeValue}
    } else {
      newState.currentDraftNodeValue = JSON.parse(currentDraftNodeValueByStorage);
    }
    dispatch({
      type: "UPDATE_WORKSPACES_ALL_PROPS",
      payload: {
        materialEditor: newState
      }
    });
  };
}

let requestWorkspaceMaterialContentNodeAttachments:RequestWorkspaceMaterialContentNodeAttachmentsTriggerType =
  function requestWorkspaceMaterialContentNodeAttachments(workspace, material) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      const childrenAttachments:MaterialContentNodeType[] = (await promisify(mApi().workspace.workspaces.materials.read(workspace.id, {
        parentId: material.workspaceMaterialId,
      }), 'callback')() as MaterialContentNodeType[]) || [];

      dispatch({
        type: "UPDATE_MATERIAL_CONTENT_NODE",
        payload: {
          showRemoveAnswersDialogForPublish: false,
          material: material,
          update: {
            childrenAttachments,
          },
          isDraft: false,
        }
      });
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let updateWorkspaceMaterialContentNode:UpdateWorkspaceMaterialContentNodeTriggerType = function updateWorkspaceMaterialContentNode(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      if (!data.dontTriggerReducerActions) {
        dispatch({
          type: "UPDATE_MATERIAL_CONTENT_NODE",
          payload: {
            showRemoveAnswersDialogForPublish: false,
            material: data.material,
            update: data.update,
            isDraft: data.isDraft,
          }
        });
      }

      if (!data.isDraft) {
        if (typeof data.update.html !== "undefined" && data.material.html !== data.update.html) {
          await promisify(mApi().materials.html.content
              .update(data.material.materialId, {
                content: data.update.html,
                removeAnswers: data.removeAnswers || false,
              }), 'callback')();
        }

        let newPath = data.material.path;
        let fields = ["materialId", "parentId", "nextSiblingId", "hidden", "assignmentType", "correctAnswers", "path", "title"];
        if (data.material.type === "folder") {
          fields = ["hidden", "nextSiblingId", "parentId", "title", "path", "viewRestrict"];
        }
        const result:any = {
          id: data.material.workspaceMaterialId
        };
        let changed = false;
        fields.forEach((field) => {
          if (typeof (data.update as any)[field] !== "undefined" &&
             (data.material as any)[field] !== (data.update as any)[field]) {
            changed = true;
          }
          result[field] = typeof (data.update as any)[field] !== "undefined" ?
            (data.update as any)[field] :
            (data.material as any)[field]
        });
        if (changed) {
          let urlPath = "materials";
          if (data.material.type === "folder") {
            urlPath = "folders";
          }
          newPath = (await promisify(mApi().workspace.workspaces[urlPath]
              .update(data.workspace.id, data.material.workspaceMaterialId, result), 'callback')() as any).path;
        }

        let materialFields = ["id", "license", "viewRestrict"]
        if (data.material.type === "folder") {
          fields = [];
        }
        const materialResult:any = {};
        changed = false;
        materialFields.forEach((field) => {
          if (typeof (data.update as any)[field] !== "undefined" &&
             (data.material as any)[field] !== (data.update as any)[field]) {
            changed = true;
          }
          materialResult[field] = typeof (data.update as any)[field] !== "undefined" ?
            (data.update as any)[field] :
            (data.material as any)[field]
        });
        if (changed) {
          await promisify(mApi().materials.material
              .update(data.material.materialId, materialResult), 'callback')();
        }

        if (
          typeof data.update.producers !== "undefined" &&
          !equals(data.material.producers, data.update.producers)
        ) {
          const newProducers: MaterialContentNodeProducerType[] = await Promise.all<MaterialContentNodeProducerType>(data.update.producers.map((p) => {
            if (p.id === null) {
              return (
                  <Promise<MaterialContentNodeProducerType>>promisify(mApi().materials.material.producers
                  .create(data.material.materialId, {name: p.name}), 'callback')()
              );
            }
            return p;
          }));
          if (!data.dontTriggerReducerActions) {
            dispatch({
              type: "UPDATE_MATERIAL_CONTENT_NODE",
              payload: {
                showRemoveAnswersDialogForPublish: false,
                material: data.material,
                update: {
                  producers: newProducers,
                },
                isDraft: false,
              }
            });
          }

          const deletedProducers = data.material.producers.filter((p) => !newProducers.find((p2) => p2.id === p.id));
          await Promise.all(deletedProducers.map((p) => {
            return promisify(mApi().materials.material.producers
                .del(data.material.materialId, p.id), 'callback')();
          }));
        }

        // if the title changed we need to update the path, sadly only the server knows
        if (data.material.path !== newPath && !data.dontTriggerReducerActions) {
          dispatch({
            type: "UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES",
            payload: {
              material: data.material,
              newPath,
            }
          });
        }
      } else {
        // Trying to update the draft
        // TODO
        
        // TODO do mApi stuff
        localStorage.setItem(
          "TEMPORARY_LOCAL_DRAFT_" + data.material.workspaceMaterialId + "_" + data.workspace.id,
          JSON.stringify({
            ...data.material,
            ...data.update,
          }),
        );
      }

      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }

      let showRemoveAnswersDialogForPublish = false;
      if (!data.removeAnswers && err.message) {
        try {
          let message = JSON.parse(err.message);
          if (message.reason === "CONTAINS_ANSWERS") {
            showRemoveAnswersDialogForPublish = true;
          }
        } catch (e) {
        }
      }

      if (!data.dontTriggerReducerActions) {
        dispatch({
          type: "UPDATE_MATERIAL_CONTENT_NODE",
          payload: {
            showRemoveAnswersDialogForPublish,
            material: data.material,
            update: data.material,
            isDraft: data.isDraft,
          }
        });
      }

      data.fail && data.fail();

      if (!showRemoveAnswersDialogForPublish){
        dispatch(displayNotification(getState().i18n.text.get('TODO ERRORMSG failed to update material'), 'error'));
      }
    }
  }
}

let deleteWorkspaceMaterialContentNode:DeleteWorkspaceMaterialContentNodeTriggerType = function deleteWorkspaceMaterialContentNode(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: "DELETE_MATERIAL_CONTENT_NODE",
        payload: data.material
      });

      let urlPath = "materials";
      if (data.material.type === "folder") {
        urlPath = "folders";
      }
      await promisify(mApi().workspace.workspaces[urlPath]
          .del(data.workspace.id, data.material.workspaceMaterialId || data.material.id, {}, {
            removeAnswers: data.removeAnswers || false,
            updateLinkedMaterials: true,
          }), 'callback')()

      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }

      let showRemoveAnswersDialogForDelete = false;
      if (!data.removeAnswers && err.message) {
        try {
          let message = JSON.parse(err.message);
          if (message.reason === "CONTAINS_ANSWERS") {
            showRemoveAnswersDialogForDelete = true;
            const currentEditorState = getState().workspaces.materialEditor;
            dispatch(setWorkspaceMaterialEditorState({...currentEditorState, showRemoveAnswersDialogForDelete}))
          }
        } catch (e) {
        }
      }

      data.fail && data.fail();
      if (!showRemoveAnswersDialogForDelete) {
        if (data.material.children && data.material.children.length) {
          // ERROR section has child nodes
          dispatch(displayNotification(getState().i18n.text.get('plugin.workspace.materialsManagement.sectionDeleteNotEmptyMessage'), 'error'));
        } else {
       // ERROR generic delete failure
          dispatch(displayNotification(getState().i18n.text.get('plugin.workspace.materialsManagement.deleteFailed.notification'), 'error'));
        }
      }
    }
  }
}

let createWorkspaceMaterialContentNode:CreateWorkspaceMaterialContentNodeTriggerType = function createWorkspaceMaterialContentNode(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      const parentId = data.parentMaterial ? data.parentMaterial.workspaceMaterialId : data.rootParentId;
      const nextSiblingId = data.nextSibling ? data.nextSibling.workspaceMaterialId : null;
      let workspaceMaterialId: number = null;
      if (data.copyMaterialId) {
        workspaceMaterialId = (await promisify(mApi().workspace.workspaces.materials
          .create(data.workspace.id, {
            parentId,
            nextSiblingId,
          }, {
            sourceNodeId: data.copyMaterialId,
            targetNodeId: parentId,
            sourceWorkspaceEntityId: data.workspace.id,
            targetWorkspaceEntityId: data.copyWorkspaceId,
            copyOnlyChildren: false,
            cloneMaterials: true,
            updateLinkedMaterials: true
          }), 'callback')() as any).id;
      } else if (data.file) {
        let formData = new FormData();
        //we add it to the file
        formData.append("file", data.file);
        //and do the thing
        const tempFileData:any = await (new Promise((resolve, reject) => {
          $.ajax({
            url: getState().status.contextPath + '/tempFileUploadServlet',
            type: 'POST',
            data: formData,
            success: (data: any)=>{
              resolve(data);
            },
            error: (xhr:any, err:Error)=>{
              reject(err);
            },
            cache: false,
            contentType: false,
            processData: false
          });
        }));

        const materialResult:any = await promisify(mApi().materials.binary.create({
          title: data.title,
          contentType: tempFileData.fileContentType || data.file.type,
          fileId: tempFileData.fileId,
        }), 'callback')();

        workspaceMaterialId = (await promisify(mApi().workspace.workspaces.materials.create(data.workspace.id, {
          materialId: materialResult.id,
          parentId,
          nextSiblingId,
        }, {
          updateLinkedMaterials: true
        }), 'callback')() as any).id;

      } else if (!data.makeFolder) {
        const materialId = (await promisify(mApi().materials.html.create({
          title: data.title,
          contentType: "text/html;editor=CKEditor",
        }), 'callback')() as any).id;

        workspaceMaterialId = (await promisify(mApi().workspace.workspaces.materials
          .create(data.workspace.id, {
            materialId,
            parentId,
            nextSiblingId,
          }), 'callback')() as any).id;
      } else {
        workspaceMaterialId = (await promisify(mApi().workspace.workspaces.folders
          .create(data.workspace.id, {
            nextSiblingId,
          }), 'callback')() as any).id; 
      }

      const newContentNode: MaterialContentNodeType = <MaterialContentNodeType>(await promisify(mApi().workspace.workspaces.
          asContentNode.read(data.workspace.id, workspaceMaterialId), 'callback')());

      dispatch({
        type: "INSERT_MATERIAL_CONTENT_NODE",
        payload: newContentNode,
      });

      data.success && data.success(newContentNode);
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }

      data.fail && data.fail();
    }
  }
}

const MAX_ATTACHMENT_SIZE = 10000000;
let createWorkspaceMaterialAttachment:CreateWorkspaceMaterialAttachmentTriggerType = function createWorkspaceMaterialAttachment(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      const tempFilesData = await Promise.all(data.files.map((file) => {
        //create the form data
        let formData = new FormData();
        //we add it to the file
        formData.append("file", file);
        //and do the thing
        return new Promise((resolve, reject) => {
          if (file.size >= MAX_ATTACHMENT_SIZE) {
            reject(new Error(getState().i18n.text.get("plugin.workspace.fileFieldUpload.fileSizeTooLarge")));
            return;
          }

          $.ajax({
            url: getState().status.contextPath + '/tempFileUploadServlet',
            type: 'POST',
            data: formData,
            success: (data: any)=>{
              resolve(data);
            },
            error: (xhr:any, err:Error)=>{
              reject(err);
            },
            cache: false,
            contentType: false,
            processData: false
          });
        });
      }));

      await Promise.all(tempFilesData.map(async (tempFileData: any, index) => {
        const materialResult:any = await promisify(mApi().materials.binary.create({
          title: data.files[index].name,
          contentType: tempFileData.fileContentType || data.files[index].type,
          fileId: tempFileData.fileId,
        }), 'callback')();

        await promisify(mApi().workspace.workspaces.materials.create(data.workspace.id, {
          materialId: materialResult.id,
          parentId: data.material.workspaceMaterialId,
        }, {
          updateLinkedMaterials: true
        }), 'callback')();
      }));

      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.materialsManagement.attachment.notification.success"), 'success'));
      data.success && data.success();
    } catch (err) {
      dispatch(actions.displayNotification(err.message, 'error'))
      data.fail && data.fail();
    }

    dispatch(requestWorkspaceMaterialContentNodeAttachments(data.workspace, data.material));
  }
}

let updateWorkspaceEditModeState:UpdateWorkspaceEditModeStateTriggerType = function updateWorkspaceEditModeState(data, restoreActiveFromLocalStorage) {
  if (restoreActiveFromLocalStorage && typeof data.active !== "undefined") {
    localStorage.setItem("__editmode__active", JSON.stringify(data.active));
  } else if (restoreActiveFromLocalStorage) {
    return {
      type: "UPDATE_WORKSPACES_EDIT_MODE_STATE",
      payload: {
        ...data,
        active: JSON.parse(localStorage.getItem("__editmode__active") || "false"),
      },
    }
  }
  return {
    type: "UPDATE_WORKSPACES_EDIT_MODE_STATE",
    payload: data,
  }
}

export {loadUserWorkspaceCurriculumFiltersFromServer, loadUserWorkspaceEducationFiltersFromServer,
  loadUserWorkspaceOrganizationFiltersFromServer, loadWorkspacesFromServer, loadMoreWorkspacesFromServer,
  signupIntoWorkspace, loadUserWorkspacesFromServer, loadLastWorkspaceFromServer, setCurrentWorkspace, requestAssessmentAtWorkspace, cancelAssessmentAtWorkspace,
  updateWorkspace, loadStaffMembersOfWorkspace, loadWholeWorkspaceMaterials, setCurrentWorkspaceMaterialsActiveNodeId, loadWorkspaceCompositeMaterialReplies,
  updateAssignmentState, updateLastWorkspace, loadStudentsOfWorkspace, toggleActiveStateOfStudentOfWorkspace, loadCurrentWorkspaceJournalsFromServer,
  loadMoreCurrentWorkspaceJournalsFromServer, createWorkspaceJournalForCurrentWorkspace, updateWorkspaceJournalInCurrentWorkspace,
  deleteWorkspaceJournalInCurrentWorkspace, loadWorkspaceDetailsInCurrentWorkspace, loadWorkspaceTypes, deleteCurrentWorkspaceImage, copyCurrentWorkspace,
  updateWorkspaceDetailsForCurrentWorkspace, updateWorkspaceProducersForCurrentWorkspace, updateCurrentWorkspaceImagesB64,
  loadCurrentWorkspaceUserGroupPermissions, updateCurrentWorkspaceUserGroupPermission, setWorkspaceMaterialEditorState,
  updateWorkspaceMaterialContentNode, deleteWorkspaceMaterialContentNode, setWholeWorkspaceMaterials, createWorkspaceMaterialContentNode,
  requestWorkspaceMaterialContentNodeAttachments, createWorkspaceMaterialAttachment, updateWorkspaceEditModeState, loadWholeWorkspaceHelp,
  setWholeWorkspaceHelp}