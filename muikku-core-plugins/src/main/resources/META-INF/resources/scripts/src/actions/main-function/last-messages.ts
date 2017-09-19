import actions from '../base/notifications';
import promisify from '~/util/promisify';

export default {
  updateLastMessages(maxResults){
    return async (dispatch, getState)=>{
      try {
        dispatch({
          type: 'UPDATE_LAST_MESSAGES',
          payload: (await promisify(mApi().communicator.items.read({
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