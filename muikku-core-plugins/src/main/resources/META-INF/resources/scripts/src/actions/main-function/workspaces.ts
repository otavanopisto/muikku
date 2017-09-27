import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {WorkspaceListType} from '~/reducers/main-function/index/workspaces';

export interface UpdateWorkspacesTriggerType {
  ():AnyActionType
}

export interface UPDATE_WORKSPACES extends SpecificActionType<"UPDATE_WORKSPACES", WorkspaceListType>{}

let updateWorkspaces:UpdateWorkspacesTriggerType = function updateWorkspaces(){
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

export default {updateWorkspaces}
export {updateWorkspaces}