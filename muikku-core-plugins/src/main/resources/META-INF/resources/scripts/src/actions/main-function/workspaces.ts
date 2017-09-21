import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType} from '~/actions';
import {WorkspaceListType} from '~/reducers/index.d';

export default {
  updateWorkspaces():AnyActionType{
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
}