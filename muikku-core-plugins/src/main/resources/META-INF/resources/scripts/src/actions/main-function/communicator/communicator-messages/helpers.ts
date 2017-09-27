import notificationActions from '~/actions/base/notifications';
import messageCountActions from '~/actions/main-function/message-count';

import {hexToColorInt} from '~/util/modifiers';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';

import {CommunicatorMessagesType, CommunicatorMessageListType, CommunicatorMessagesPatchType,
  CommunicatorMessageType, CommunicatorStateType, CommunicatorMessageLabelType} from '~/reducers/main-function/communicator/communicator-messages';
import {CommunicatorNavigationItemType, CommunicatorNavigationItemListType} from '~/reducers/main-function/communicator/communicator-navigation';
import {AnyActionType} from '~/actions';

//HELPERS

const MAX_LOADED_AT_ONCE = 30;

//Why in the world do we have a weird second version?
//This is a server-side issue, just why we have different paths for different things.
export function getApiId(item:CommunicatorNavigationItemType, weirdSecondVersion:boolean = false){
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

export async function loadMessagesHelper(location:string | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  //Remove the current messsage
  dispatch({
    type: "SET_CURRENT_THREAD",
    payload: null
  });
  
  let state = getState();
  let communicatorNavigation:CommunicatorNavigationItemListType = state.communicatorNavigation
  let communicatorMessages:CommunicatorMessagesType = state.communicatorMessages;
  let actualLocation:string = location || communicatorMessages.location;
  
  //Avoid loading messages again for the first time if it's the same location
  if (initial && actualLocation === communicatorMessages.location && communicatorMessages.state === "READY"){
    return;
  }
  
  //If it's for the first time
  if (initial){
    //We set this state to loading
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <CommunicatorStateType>"LOADING"
    });
  } else {
    //Otherwise we are loading more
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <CommunicatorStateType>"LOADING_MORE"
    });
  }
  
  //We get the navigation location item
  let item = communicatorNavigation.find((item)=>{
    return item.location === actualLocation;
  });
  if (!item){
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <CommunicatorStateType>"ERROR"
    });
  }
  
  //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
  let firstResult = initial ? 0 : communicatorMessages.pages*MAX_LOADED_AT_ONCE;
  //The pages that we will have loaded will be the first one for initial or otherwise the current one plus 1
  let pages = initial ? 1 : communicatorMessages.pages + 1;
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
        labelId: item.id,
        firstResult,
        //We load one more to check if they have more
        maxResults: MAX_LOADED_AT_ONCE + 1
    }
    //Otherwise if it's some weird thing we don't recognize
  } else {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <CommunicatorStateType>"ERROR"
    });
  }
  
  try {
    let messages:CommunicatorMessageListType = <CommunicatorMessageListType>await promisify(mApi().communicator[getApiId(item)].read(params), 'callback')();
    let hasMore:boolean = messages.length === MAX_LOADED_AT_ONCE + 1;
    
    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualMessages = messages.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualMessages.pop();
    }
    
    //Create the payload for updating all the communicator properties
    let properLocation = location || item.location;
    let payload:CommunicatorMessagesPatchType = {
      state: "READY",
      messages: (concat ? communicatorMessages.messages.concat(actualMessages) : actualMessages),
      pages: pages,
      hasMore,
      location: properLocation
    }
    if (!concat){
      payload.selected = [];
      payload.selectedIds = [];
    }
    
    //And there it goes
    dispatch({
      type: "UPDATE_MESSAGES_ALL_PROPERTIES",
      payload
    });
  } catch (err){
    //Error :(
    dispatch(notificationActions.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <CommunicatorStateType>"ERROR"
    });
  }
}

export async function setLabelStatusCurrentMessage(label: CommunicatorMessageLabelType, isToAddLabel: boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  let {communicatorMessages} = getState();
  let messageLabel = communicatorMessages.current.labels.find((mlabel:CommunicatorMessageLabelType)=>mlabel.labelId === label.id);
  let communicatorMessageId = communicatorMessages.current.messages[0].communicatorMessageId;
  
  try {
    if (isToAddLabel && !messageLabel){
      let serverProvidedLabel:CommunicatorMessageLabelType = <CommunicatorMessageLabelType>await promisify(mApi().communicator.messages.labels.create(communicatorMessageId, {
        labelId: label.id
      }), 'callback')();
      dispatch({
        type: "UPDATE_MESSAGE_ADD_LABEL",
        payload: {
          communicatorMessageId,
          label: serverProvidedLabel
        }
      });
    } else if (!isToAddLabel){
      if (!messageLabel){
        dispatch(notificationActions.displayNotification("Label does not exist", 'error'));
      } else {
        await promisify(mApi().communicator.messages.labels.del(communicatorMessageId, messageLabel.id), 'callback')();
        dispatch({
          type: "UPDATE_MESSAGE_DROP_LABEL",
          payload: {
            communicatorMessageId,
            label: messageLabel
          }
        });
      }
    }
  } catch (err){
    dispatch(notificationActions.displayNotification(err.message, 'error'));
  }
}

export function setLabelStatusSelectedMessages(label:CommunicatorMessageLabelType, isToAddLabel: boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  let communicatorMessages:CommunicatorMessagesType = getState().communicatorMessages;
  
  communicatorMessages.selected.forEach(async (message:CommunicatorMessageType)=>{
    let messageLabel = message.labels.find(mlabel=>mlabel.labelId === label.id);
    
    try {
      if (isToAddLabel && !messageLabel){
        let serverProvidedLabel:CommunicatorMessageLabelType = <CommunicatorMessageLabelType>await promisify(mApi().communicator.messages.labels.create(message.communicatorMessageId, {
          labelId: label.id
        }),'callback')();
        dispatch({
          type: "UPDATE_MESSAGE_ADD_LABEL",
          payload: {
            communicatorMessageId: message.communicatorMessageId,
            label: serverProvidedLabel
          }
        });
      } else if (!isToAddLabel){
        if (!messageLabel){
          //TODO translate this
          dispatch(notificationActions.displayNotification("Label does not exist", 'error'));
        } else {
          await promisify(mApi().communicator.messages.labels.del(message.communicatorMessageId, messageLabel.id), 'callback')();
          dispatch({
            type: "UPDATE_MESSAGE_DROP_LABEL",
            payload: {
              communicatorMessageId: message.communicatorMessageId,
              label: messageLabel
            }
          });
        }
      }
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  });
}