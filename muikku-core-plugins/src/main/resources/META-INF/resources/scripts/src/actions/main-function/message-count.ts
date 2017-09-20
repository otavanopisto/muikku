import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType} from '~/actions';
import mApi from '~/lib/mApi';

export default {
  updateMessageCount(value?: number):AnyActionType {
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
}