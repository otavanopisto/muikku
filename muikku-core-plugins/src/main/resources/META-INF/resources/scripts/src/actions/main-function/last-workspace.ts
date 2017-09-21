import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType} from '~/actions';
import {WorkspaceType} from '~/reducers/index.d';
import mApi from '~/lib/mApi';

export default {
  updateLastWorkspace():AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      try {
        dispatch({
          type: 'UPDATE_LAST_WORKSPACE',
          payload: <WorkspaceType>((await promisify(mApi().user.property.read('last-workspace'), 'callback')()) as any).value
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}