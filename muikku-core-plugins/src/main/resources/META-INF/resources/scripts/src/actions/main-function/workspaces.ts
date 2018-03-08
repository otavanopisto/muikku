import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {WorkspaceListType, ShortWorkspaceType} from '~/reducers/main-function/workspaces';

export interface LoadWorkspacesFromServerTriggerType {
  ():AnyActionType
}

export type UPDATE_WORKSPACES = SpecificActionType<"UPDATE_WORKSPACES", WorkspaceListType>;
export type UPDATE_LAST_WORKSPACE = SpecificActionType<"UPDATE_LAST_WORKSPACE", ShortWorkspaceType>;

export type ACTIONS = UPDATE_WORKSPACES | UPDATE_LAST_WORKSPACE

let loadWorkspacesFromServer:LoadWorkspacesFromServerTriggerType = function loadWorkspacesFromServer(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let userId = getState().status.userId;
    try {
      dispatch({
        type: "UPDATE_WORKSPACES",
        payload: <WorkspaceListType>(await (promisify(mApi().workspace.workspaces.read({userId}), 'callback')()) || 0)
      });
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export interface LoadLastWorkspaceFromServerTriggerType {
  ():AnyActionType
}

let loadLastWorkspaceFromServer:LoadLastWorkspaceFromServerTriggerType = function loadLastWorkspaceFromServer() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: 'UPDATE_LAST_WORKSPACE',
        payload: <ShortWorkspaceType>((await promisify(mApi().user.property.read('last-workspace'), 'callback')()) as any).value
      });
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {loadWorkspacesFromServer, loadLastWorkspaceFromServer}
export {loadWorkspacesFromServer, loadLastWorkspaceFromServer}