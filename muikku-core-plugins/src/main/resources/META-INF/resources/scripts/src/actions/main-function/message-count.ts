import actions from '../base/notifications';
import promisify from '~/util/promisify';

export default {
  updateMessageCount(value){
    if (typeof value !== "undefined"){
      return {
        type: "UPDATE_MESSAGE_COUNT",
        payload: value
      }
    }
    
    return async (dispatch, getState)=>{
      try {
        dispatch({
          type: "UPDATE_MESSAGE_COUNT",
          payload: (await (promisify(mApi().communicator.receiveditemscount.cacheClear().read(), 'callback')()) || 0)
        });
      } catch(err){
        console.log(err);
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}