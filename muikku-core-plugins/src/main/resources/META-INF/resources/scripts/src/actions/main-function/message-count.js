import actions from '../base/notifications';

export default {
  updateMessageCount(){
    return (dispatch, getState)=>{
      mApi()
        .communicator
        .receiveditemscount
        .cacheClear()
        .read()
        .callback(function (err, result=0) {
          if( err ){
            dispatch(actions.displayNotification(err.message, 'error'));
          } else {
            dispatch({
              type: "UPDATE_MESSAGE_COUNT",
              payload: result
            });
          }
        });
    }
  }
}