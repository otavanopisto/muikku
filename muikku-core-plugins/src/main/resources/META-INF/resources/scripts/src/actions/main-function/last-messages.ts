import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType} from '~/actions';
import mApi from '~/lib/mApi';
import {CommunicatorMessageListType} from '~/reducers/index.d';

export default {
  updateLastMessages(maxResults: number):AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      try {
        dispatch({
          type: 'UPDATE_LAST_MESSAGES',
          payload: <CommunicatorMessageListType>(await promisify(mApi().communicator.items.read({
            'firstResult': 0,
            'maxResults': maxResults
          }), 'callback')())
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}