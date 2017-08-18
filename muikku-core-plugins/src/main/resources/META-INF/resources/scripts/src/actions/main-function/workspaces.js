import actions from '../base/notifications';

export default {
  updateWorkspaces(){
    return (dispatch, getState)=>{
      let userId = getState().status.userId;
      mApi().workspace.workspaces
       .read({userId})
       .callback(function (err, workspaces) {
         if( err ){
           dispatch(actions.displayNotification(err.message, 'error'));
         } else {
           dispatch({
             type: "UPDATE_WORKSPACES",
             payload: workspaces
           });
         }
      });
    }
  }
}