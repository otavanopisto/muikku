import actions from '../base/notifications';

export default {
  updateLastWorkspace(){
    return (dispatch, getState)=>{
      mApi().user.property.read('last-workspace').callback(function(err, property) {
        if( err ){
          dispatch(actions.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_LAST_WORKSPACE',
            payload: property.value
          });
        }
      })
    }
  }
}