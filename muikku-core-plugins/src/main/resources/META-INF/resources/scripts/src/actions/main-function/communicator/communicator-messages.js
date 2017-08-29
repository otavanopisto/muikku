import notificationActions from '~/actions/base/notifications';
import messageCountActions from '~/actions/main-function/message-count';

import {hexToColorInt} from '~/util/modifiers';

const MAX_LOADED_AT_ONCE = 30;

function getApiId(item){
  if (item.type === "folder"){
    switch(item.id){
    case "inbox":
      return "items";
    case "unread":
      return "items";
    case "sent":
      return "sentitems";
    case "trash":
      return "trash";
    }
    if (console && console.warn){
      console.warn("Invalid navigation item location",item);
    }
  } else {
    return "items";
  }
}

function processMessages(dispatch, communicatorMessages, location, pages, concat, callback, err, messages){
  if (err){
    dispatch(notificationActions.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  } else {
    let hasMore = messages.length === MAX_LOADED_AT_ONCE + 1;
    if (hasMore){
      messages.pop();
    }
    
    let payload = {
      state: "READY",
      messages: (concat ? communicatorMessages.messages.concat(messages) : messages),
      pages: pages,
      hasMore,
      location
    }
    if (!concat){
      payload.selected = [];
      payload.selectedIds = [];
    }
    
    dispatch({
      type: "UPDATE_MESSAGES_ALL_PROPERTIES",
      payload
    });
    
    callback && callback(payload);
  }
}

function loadMessages(location, initial, callback, dispatch, getState){
  if (initial){
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "LOADING"
    });
  } else {
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "LOADING_MORE"
    });
  }
  
  let {communicatorNavigation, communicatorMessages} = getState();
  let actualLocation = location || communicatorMessages.location;
  let item = communicatorNavigation.find((item)=>{
    return item.location === actualLocation;
  });
  if (!item){
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  }
  
  let firstResult = initial ? 0 : communicatorMessages.pages*MAX_LOADED_AT_ONCE;
  let pages = initial ? 1 : communicatorMessages.pages + 1;
  let concat = !initial;
  let args = [this, dispatch, communicatorMessages, actualLocation, pages, concat, callback];
  if (item.type === 'folder'){
    let params = {
        firstResult,
        maxResults: MAX_LOADED_AT_ONCE + 1
    }
    switch(item.id){
    case "inbox":
      params.onlyUnread = false;
      break;
    case "unread":
      params.onlyUnread = true;
      break;
    }
    
    mApi().communicator[getApiId(item)].read(params).callback(processMessages.bind(...args));
  } else if (item.type === 'label') {
    let params = {
        labelId: item.id,
        firstResult,
        maxResults: MAX_LOADED_AT_ONCE + 1
    }
    mApi().communicator[getApiId(item)].read(params).callback(processMessages.bind(...args));
  } else {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
    });
  }
}

function setLabelStatusSelectedMessages(label, isToAddLabel, dispatch, getState){
  let {communicatorNavigation, communicatorMessages, i18n} = getState();
  let item = communicatorNavigation.find((item)=>{
    return item.location === communicatorMessages.location;
  });
  if (!item){
    //TODO translate this
    dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
  }
  
  let callback = (message, originalLabel, err, label)=>{
    if (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    } else {
      dispatch({
        type: isToAddLabel ? "UPDATE_MESSAGE_ADD_LABEL" : "UPDATE_MESSAGE_DROP_LABEL",
        payload: {
          message,
          label: originalLabel || label
        }
      });
    }
  }
  
  for (let message of communicatorMessages.selected){
    let messageLabel = message.labels.find(mlabel=>mlabel.labelId === label.id);
    if (isToAddLabel && !messageLabel){
      mApi().communicator.messages.labels.create(message.communicatorMessageId, { labelId: label.id }).callback(callback.bind(this, message, null));
    } else if (!isToAddLabel){
      if (!messageLabel){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Label already does not exist", 'error'));
      } else {
        mApi().communicator.messages.labels.del(message.communicatorMessageId, messageLabel.id).callback(callback.bind(this, message, messageLabel));
      }
    }
  }
}

export default {
  loadMessages(location){
    return loadMessages.bind(this, location, true, null);
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
  },
  loadMoreMessages(){
    return loadMessages.bind(this, null, false, null);
  },
  addLabelToSelectedMessages(label){
    return setLabelStatusSelectedMessages.bind(this, label, true);
  },
  removeLabelFromSelectedMessages(label){
    return setLabelStatusSelectedMessages.bind(this, label, false);
  },
  toggleMessagesReadStatus(message){
    return (dispatch, getState)=>{
      dispatch({
        type: "LOCK_TOOLBAR"
      });
      
      let {communicatorNavigation, communicatorMessages, messageCount} = getState();
      let item = communicatorNavigation.find((item)=>{
        return item.location === communicatorMessages.location;
      });
      if (!item){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
        dispatch({
          type: "UNLOCK_TOOLBAR"
        });
      }
      
      dispatch({
        type: "UPDATE_ONE_MESSAGE",
        payload: {
          message,
          update: {
            unreadMessagesInThread: !message.unreadMessagesInThread
          }
        }
      });
      
      function callback(err){
        mApi().communicator[getApiId(item)].cacheClear();
        if (err){
          dispatch(notificationActions.displayNotification(err.message, 'error'));
          dispatch({
            type: "UPDATE_ONE_MESSAGE",
            payload: {
              message,
              update: {
                unreadMessagesInThread: message.unreadMessagesInThread
              }
            }
          });
          dispatch(messageCountActions.updateMessageCount(messageCount));
        }
        dispatch({
          type: "UNLOCK_TOOLBAR"
        });
      }
      
      if (message.unreadMessagesInThread){
        dispatch(messageCountActions.updateMessageCount(messageCount - 1));
        mApi().communicator[getApiId(item)].markasread.create(message.communicatorMessageId).callback(callback);
      } else {
        dispatch(messageCountActions.updateMessageCount(messageCount + 1));
        mApi().communicator[getApiId(item)].markasunread.create(message.communicatorMessageId).callback(callback);
      }
    }
  },
  deleteSelectedMessages(){
    return (dispatch, getState)=>{
      dispatch({
        type: "LOCK_TOOLBAR"
      });
      
      let {communicatorNavigation, communicatorMessages, messageCount} = getState();
      let item = communicatorNavigation.find((item)=>{
        return item.location === communicatorMessages.location;
      });
      if (!item){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
        dispatch({
          type: "UNLOCK_TOOLBAR"
        });
      }
      
      let {selected, selectedIds} = communicatorMessages;
      
      let done = 0;
      for (let message of selected){
        mApi().communicator[getApiId(item)].del(message.communicatorMessageId).callback((err)=>{
          done++;
          if (err){
            dispatch(notificationActions.displayNotification(err.message, 'error'));
          } else {
            dispatch({
              type: "DELETE_MESSAGE",
              payload: message
            });
          }
          if (done === selected.length){
            mApi().communicator[getApiId(item)].cacheClear();
            dispatch({
              type: "UNLOCK_TOOLBAR"
            });
          }
        });
      }
    }
  },
  setCurrentMessage(message){
    return (dispatch, getState)=>{
      let {communicatorMessages} = getState();
      
      let index = communicatorMessages.messages.findIndex((searchMessage)=>{
        return searchMessage.communicatorMessageId === message.communicatorMessageId;
      });
      if (index === -1){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid message", 'error'));
      }
      
      let payload = {
        prev: communicatorMessages.messages[index + 1] || null,
        current: message,
        next: communicatorMessages.messages[index - 1] || null
      }
      
      if (!payload.prev && communicatorMessages.hasMore){
        dispatch({
          type: "SET_ONLY_CURRENT_NEXT_MESSAGES",
          payload
        });
        loadMessages(null, false, (stateChanges)=>{
          dispatch({
            type: "SET_ONLY_PREV_MESSAGE",
            payload: stateChanges.messages[index + 1]
          });
        }, dispatch, getState);
      } else {
        dispatch({
          type: "SET_PREV_CURRENT_NEXT_MESSAGES",
          payload
        });
      }
    }
  },
  closeCurrentMessage(){
    return {
      type: "SET_PREV_CURRENT_NEXT_MESSAGES",
      payload: {
        prev: null,
        current: null,
        next: null
      }
    }
  }
}