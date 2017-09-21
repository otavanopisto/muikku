import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType} from '~/actions';
import {AnnouncementListType} from '~/reducers/index.d';

export default {
  updateAnnouncements(options: any={hideWorkspaceAnnouncements: "false"}):AnyActionType{
    return async (dispatch, getState)=>{
      try {
        dispatch({
          type: 'UPDATE_ANNOUNCEMENTS',
          payload: <AnnouncementListType>await promisify(mApi().announcer.announcements.read(options), 'callback')()
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}