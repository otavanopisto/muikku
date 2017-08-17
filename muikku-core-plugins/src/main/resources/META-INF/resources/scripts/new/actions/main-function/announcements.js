import actions from '../base/notifications';

export default {
  updateAnnouncements(options={ hideWorkspaceAnnouncements: "false" }){
    return (dispatch, getState)=>{
      mApi()
        .announcer
        .announcements
        .read(options)
        .callback(function(err, announcements) {
          if( err ){
            dispatch(actions.displayNotification(err.message, 'error'));
          } else {
            dispatch({
              type: 'UPDATE_ANNOUNCEMENTS',
              payload: announcements
            });
          }
         }
      );
    }
  }
}