import actions from '../base/notifications';

export default {
  updateLabels(){
    return (dispatch, getState)=>{
      mApi().communicator.userLabels.read().callback(function (err, labels) {
        if (err){
          dispatch(actions.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_lABELS',
            payload: labels
          });
        }
      });
    }
  }
}