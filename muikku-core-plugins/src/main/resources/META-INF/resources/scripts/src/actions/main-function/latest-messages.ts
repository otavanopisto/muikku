import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi from '~/lib/mApi';
import {CommunicatorMessageListType} from '~/reducers/main-function/communicator/communicator-messages';

export interface UpdateLastMessagesTriggerType {
  (maxResults: number):AnyActionType
}

export interface UPDATE_LAST_MESSAGES extends SpecificActionType<"UPDATE_LAST_MESSAGES", CommunicatorMessageListType>{}

let updateLastMessages:UpdateLastMessagesTriggerType = function updateLastMessages(maxResults) {
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

export default {updateLastMessages};
export {updateLastMessages};