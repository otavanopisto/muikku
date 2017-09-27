import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi from '~/lib/mApi';

export interface UpdateMessageCountTriggerType {
  (value?: number):AnyActionType
}

export interface UPDATE_MESSAGE_COUNT extends SpecificActionType<"UPDATE_MESSAGE_COUNT", number>{}

let updateMessageCount:UpdateMessageCountTriggerType =  function updateMessageCount(value) {
  if (typeof value !== "undefined"){
    return {
      type: "UPDATE_MESSAGE_COUNT",
      payload: value
    }
  }
  
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: "UPDATE_MESSAGE_COUNT",
        payload: <number>(await (promisify(mApi().communicator.receiveditemscount.cacheClear().read(), 'callback')()) || 0)
      });
    } catch(err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {updateMessageCount}
export {updateMessageCount}