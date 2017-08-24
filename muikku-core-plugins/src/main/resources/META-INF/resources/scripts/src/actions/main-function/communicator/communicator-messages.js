import actions from '~/actions/base/notifications';

function processMessages(dispatch, err, messages){
  if (err){
    dispatch(actions.displayNotification(err.message, 'error'));
    dispatch({
  	  type: "UPDATE_MESSAGES_STATE",
  	  payload: "ERROR"
  	});
  } else {
  	dispatch({
  	  type: "UPDATE_MESSAGES_STATE",
  	  payload: "READY"
  	});
  	dispatch({
      type: "UPDATE_SELECTED_MESSAGES",
      payload: []
    });
    dispatch({
  	  type: "UPDATE_MESSAGES",
  	  payload: messages
  	});
  }
}

export default {
  updateCommunicatorMessagesForLocation(location, page){
    return (dispatch, getState)=>{
      dispatch({
        type: "UPDATE_MESSAGES_STATE",
        payload: "WAIT"
      });
      
      let {communicatorNavigation} = getState();
      let item = communicatorNavigation.find((item)=>{
        return item.location === location;
      });
      if (!item){
        return dispatch({
    	  type: "UPDATE_MESSAGES_STATE",
    	  payload: "ERROR"
    	});
      }
      
      if (item.type === 'folder'){
    	let params = {
          firstResult: 0,
    	  maxResults: 31
        }
    	switch(item.id){
          case "inbox":
            params.onlyUnread = false;
            mApi().communicator.items.read(params).callback(processMessages.bind(this, dispatch));
            break;
          case "unread":
            params.onlyUnread = true;
            mApi().communicator.items.read(params).callback(processMessages.bind(this, dispatch));
            break;
          case "sent":
            mApi().communicator.sentitems.read(params).callback(processMessages.bind(this, dispatch));
            break;
          case "trash":
            mApi().communicator.trash.read(params).callback(processMessages.bind(this, dispatch));
            break;
        }
      } else if (item.type === 'label') {
        let params = {
          labelId: item.id,
          firstResult: 0,
          maxResults: 31
        }
        mApi().communicator.items.read(params).callback(processMessages.bind(this, dispatch));
      } else {
    	return dispatch({
          type: "UPDATE_MESSAGES_STATE",
          payload: "ERROR"
    	});
      }
    }
  },
  updateCommunicatorSelectedMessages(messages){
    return {
      type: "UPDATE_SELECTED_MESSAGES",
      payload: messages
    };
  },
  addToCommunicatorSelectedMessages(message){
    return {
      type: "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES",
      payload: message
    };
  },
  removeFromCommunicatorSelectedMessages(message){
    return {
      type: "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES",
      payload: message
    };
  }
}