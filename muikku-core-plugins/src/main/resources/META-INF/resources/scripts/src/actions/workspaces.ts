import actions from './base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {WorkspaceListType, ShortWorkspaceType, WorkspaceType, WorkspaceStudentActivityType, WorkspaceStudentAssessmentsType} from '~/reducers/workspaces';
import { StateType } from '~/reducers';

export interface LoadWorkspacesFromServerTriggerType {
  ():AnyActionType
}

export type UPDATE_WORKSPACES = SpecificActionType<"UPDATE_WORKSPACES", WorkspaceListType>;
export type UPDATE_LAST_WORKSPACE = SpecificActionType<"UPDATE_LAST_WORKSPACE", ShortWorkspaceType>;
export type SET_CURRENT_WORKSPACE = SpecificActionType<"SET_CURRENT_WORKSPACE", WorkspaceType>;

export type ACTIONS = UPDATE_WORKSPACES | UPDATE_LAST_WORKSPACE

let loadWorkspacesFromServer:LoadWorkspacesFromServerTriggerType = function loadWorkspacesFromServer(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let userId = getState().status.userId;
    try {
      dispatch({
        type: "UPDATE_WORKSPACES",
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
        payload: <ShortWorkspaceType>JSON.parse(((await promisify(mApi().user.property.read('last-workspace'), 'callback')()) as any).value)
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.workspace.errormessage.lastWorkspaceLoadFailed"), 'error'));
    }
  }
}
  
export interface SetCurrentWorkspaceTriggerType {
  (workspaceId: number):AnyActionType
}
  
let setCurrentWorkspace:SetCurrentWorkspaceTriggerType = function setCurrentWorkspace(workspaceId){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let workspace:WorkspaceType;
      let assesments:WorkspaceStudentAssessmentsType;
      let status = getState().status;
      [workspace, assesments] = await Promise.all([promisify(mApi().workspace.workspaces.read(workspaceId), 'callback')(),
                                                 status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT ? promisify(mApi().workspace.workspaces
                                                     .students.assessments.read(workspaceId, status.userSchoolDataIdentifier), 'callback')() : null]) as any
      workspace.studentAssessments = assesments;
      dispatch({
        type: 'SET_CURRENT_WORKSPACE',
        payload: workspace
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("TODO ERRORMSG plugin.workspace.errormessage.workspaceLoadFailed"), 'error'));
    }
  }
}

export default {loadWorkspacesFromServer, loadLastWorkspaceFromServer, setCurrentWorkspace}
export {loadWorkspacesFromServer, loadLastWorkspaceFromServer, setCurrentWorkspace}