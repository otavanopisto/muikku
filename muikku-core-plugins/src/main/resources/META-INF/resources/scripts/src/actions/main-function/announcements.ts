import actions from '../base/notifications';
import promisify from '~/util/promisify';
import * as mApi from 'mApi';

export default {
  updateAnnouncements(options: any={hideWorkspaceAnnouncements: "false"}){
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