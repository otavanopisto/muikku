import actions from '../base/notifications';
import promisify from '~/util/promisify';

export default {
  updateAnnouncements(options={hideWorkspaceAnnouncements: "false"}){
    return async (dispatch, getState)=>{
      try {
        dispatch({
          type: 'UPDATE_ANNOUNCEMENTS',
          payload: await promisify(mApi().announcer.announcements.read(options), 'callback')()
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}