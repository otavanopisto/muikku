import notificationActions from '~/actions/base/notifications';

import {hexToColorInt} from '~/util/modifiers';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType} from '~/actions';
import { MessagesNavigationItemType, MessagesNavigationItemListType, MessagesStateType, MessageThreadListType, MessagesPatchType, MessageThreadLabelType, MessageThreadType } from '~/reducers/main-function/messages';
import { StateType } from '~/reducers';

//HELPERS

const MAX_LOADED_AT_ONCE = 30;

//Why in the world do we have a weird second version?
//This is a server-side issue, just why we have different paths for different things.
export function getApiId(item:MessagesNavigationItemType, weirdSecondVersion:boolean = false){
  if (item.type === "folder"){
    switch(item.id){
    case "inbox":
      return !weirdSecondVersion ? "items" : "messages";
    case "unread":
      return !weirdSecondVersion ? "items" : "unread";
    case "sent":
      return "sentitems";
    case "trash":
      return "trash";
    }
    if (console && console.warn){
      console.warn("Invalid navigation item location",item);
    }
  } else {
    return !weirdSecondVersion ? "items" : "messages";
  }
}

export async function loadMessagesHelper(location:string | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  //Remove the current message
  dispatch({
    type: "SET_CURRENT_MESSAGE_THREAD",
    payload: null
  });
  
  let state = getState();
  let actualLocation:string = location || state.messages.location;
  
  //Avoid loading messages again for the first time if it's the same location
  if (initial && actualLocation === state.messages.location && state.messages.state === "READY"){
    return;
  }
  
  //If it's for the first time
  if (initial){
    //We set this state to loading
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"LOADING"
    });
  } else {
    //Otherwise we are loading more
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"LOADING_MORE"
    });
  }
  
  //We get the navigation location item
  let item = state.messages.navigation.find((item)=>{
    return item.location === actualLocation;
  });
  if (!item){
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"ERROR"
    });
  }
  
  //Generate the api query, our first result in the messages that we have loaded
  let firstResult = initial ? 0 : state.messages.threads.length+1;
  //We only concat if it is not the initial, that means adding to the next messages
  let concat = !initial;
  
  let params;
  //If we got a folder
  if (item.type === 'folder'){
    params = {
        firstResult,
        //We load one more to check if they have more
        maxResults: MAX_LOADED_AT_ONCE + 1
    }
    switch(item.id){
    case "inbox":
      (<any>params).onlyUnread = false;
      break;
    case "unread":
      (<any>params).onlyUnread = true;
      break;
    }
    //If we got a label
  } else if (item.type === 'label') {
    params = {
        firstResult,
        //We load one more to check if they have more
        maxResults: MAX_LOADED_AT_ONCE + 1
    }
    //Otherwise if it's some weird thing we don't recognize
  } else {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"ERROR"
    });
  }
  
  let threads:MessageThreadListType;
  try {
    if (item.type !== "label"){
      threads = <MessageThreadListType>await promisify(mApi().communicator[getApiId(item)].read(params), 'callback')();
    } else {
      threads = <MessageThreadListType>await promisify(mApi().communicator.userLabels.messages.read(item.id, params), 'callback' )();
    }
    let hasMore:boolean = threads.length === MAX_LOADED_AT_ONCE + 1;
    
    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualThreads = threads.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualThreads.pop();
    }
    
    //Create the payload for updating all the communicator properties
    let properLocation = location || item.location;
    let payload:MessagesPatchType = {
      state: "READY",
      threads: (concat ? state.messages.threads.concat(actualThreads) : actualThreads),
      hasMore,
      location: properLocation
    }
    if (!concat){
      payload.selectedThreads = [];
      payload.selectedThreadsIds = [];
    }
    
    //And there it goes
    dispatch({
      type: "UPDATE_MESSAGES_ALL_PROPERTIES",
      payload
    });
  } catch (err){
    //Error :(
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.communicator.errormessage.msgsLoadFailed"), 'error'));
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"ERROR"
    });
  }
}

export async function setLabelStatusCurrentMessage(label: MessageThreadLabelType, isToAddLabel: boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  let state = getState();
  let messageLabel = state.messages.currentThread.labels.find((mlabel:MessageThreadLabelType)=>mlabel.labelId === label.id);
  let communicatorMessageId = state.messages.currentThread.messages[0].communicatorMessageId;
  
  try {
    if (isToAddLabel && !messageLabel){
      let serverProvidedLabel:MessageThreadLabelType = <MessageThreadLabelType>await promisify(mApi().communicator.messages.labels.create(communicatorMessageId, {
        labelId: label.id
      }), 'callback')();
      dispatch({
        type: "UPDATE_MESSAGE_THREAD_ADD_LABEL",
        payload: {
          communicatorMessageId,
          label: serverProvidedLabel
        }
      });
    } else if (!isToAddLabel){
      if (!messageLabel){
        dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.communicator.errormessage.labelDoesNotExist"), 'error'));
      } else {
        await promisify(mApi().communicator.messages.labels.del(communicatorMessageId, messageLabel.id), 'callback')();
        dispatch({
          type: "UPDATE_MESSAGE_THREAD_DROP_LABEL",
          payload: {
            communicatorMessageId,
            label: messageLabel
          }
        });
      }
    }
  } catch (err){
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.communicator.errormessage.labelingFailed"), 'error'));
  }
}

export function setLabelStatusSelectedMessages(label:MessageThreadLabelType, isToAddLabel: boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  let state = getState();
  
  state.messages.selectedThreads.forEach(async (thread:MessageThreadType)=>{
    let threadLabel = thread.labels.find(mlabel=>mlabel.labelId === label.id);
    
    try {
      if (isToAddLabel && !threadLabel){
        let serverProvidedLabel:MessageThreadLabelType = <MessageThreadLabelType>await promisify(mApi().communicator.messages.labels.create(thread.communicatorMessageId, {
          labelId: label.id
        }),'callback')();
        dispatch({
          type: "UPDATE_MESSAGE_THREAD_ADD_LABEL",
          payload: {
            communicatorMessageId: thread.communicatorMessageId,
            label: serverProvidedLabel
          }
        });
      } else if (!isToAddLabel){
        if (!threadLabel){
          //TODO translate this
          dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.communicator.errormessage.labelDoesNotExist"), 'error'));
        } else {
          await promisify(mApi().communicator.messages.labels.del(thread.communicatorMessageId, threadLabel.id), 'callback')();
          dispatch({
            type: "UPDATE_MESSAGE_THREAD_DROP_LABEL",
            payload: {
              communicatorMessageId: thread.communicatorMessageId,
              label: threadLabel
            }
          });
        }
      }
    } catch (err){
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.communicator.errormessage.labelingFailed"), 'error'));
    }
  });
}