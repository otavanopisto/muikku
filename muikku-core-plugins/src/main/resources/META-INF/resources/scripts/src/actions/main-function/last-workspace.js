import actions from '../base/notifications';
import promisify from '~/util/promisify';

export default {
  updateLastWorkspace(){
    return async (dispatch, getState)=>{
      try {
        dispatch({
          type: 'UPDATE_LAST_WORKSPACE',
          payload: (await promisify(mApi().user.property.read('last-workspace'), 'callback')()).value
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}