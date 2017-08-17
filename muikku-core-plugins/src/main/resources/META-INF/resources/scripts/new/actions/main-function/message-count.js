export default {
  updateMessageCount(){
    return (dispatch, getState)=>{
      mApi()
        .communicator
        .receiveditemscount
        .cacheClear()
        .read()
        .callback(function (err, result) {
          dispatch({
            type: "UPDATE_MESSAGE_COUNT",
            payload: result
          });
        });
    }
  }
}