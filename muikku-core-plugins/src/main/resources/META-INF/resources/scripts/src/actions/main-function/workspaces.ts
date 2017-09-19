import actions from '../base/notifications';
import promisify from '~/util/promisify';

export default {
  updateWorkspaces(){
    return async (dispatch, getState)=>{
      let userId = getState().status.userId;
      try {
        dispatch({
          type: "UPDATE_WORKSPACES",
          payload: (await (promisify(mApi().workspace.workspaces.read({userId}), 'callback')()) || 0)
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}