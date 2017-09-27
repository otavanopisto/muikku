import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi from '~/lib/mApi';
import {LastWorkspaceType} from '~/reducers/main-function/index/last-workspace';

export interface UpdateLastWorkspaceTriggerType {
  ():AnyActionType
}

export interface UPDATE_LAST_WORKSPACE extends SpecificActionType<"UPDATE_LAST_WORKSPACE", LastWorkspaceType>{}

let updateLastWorkspace:UpdateLastWorkspaceTriggerType = function updateLastWorkspace() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: 'UPDATE_LAST_WORKSPACE',
        payload: <LastWorkspaceType>((await promisify(mApi().user.property.read('last-workspace'), 'callback')()) as any).value
      });
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {updateLastWorkspace}
export {updateLastWorkspace}