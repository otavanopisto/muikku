import notificationActions from '~/actions/base/notifications';
import messageCountActions from '~/actions/main-function/message-count';

import {hexToColorInt} from '~/util/modifiers';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';

import {CommunicatorNavigationItemType, CommunicatorNavigationItemListType,
  CommunicatorMessagesType, CommunicatorMessageListType, CommunicatorMessagesPatchType,
  CommunicatorMessageType, CommunicatorCurrentThreadType, CommunicatorSignatureType} from '~/reducers/index.d';
import {Dispatch} from 'react-redux';
import {AnyActionType} from '~/actions';

const MAX_LOADED_AT_ONCE = 30;

//Why in the world do we have a weird second version?
//This is a server-side issue, just why we have different paths for different things.
function getApiId(item:CommunicatorNavigationItemType, weirdSecondVersion:boolean = false){
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

async function loadMessages(location:string | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
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
      payload: "LOADING"
    });
  } else {
    //Otherwise we are loading more
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "LOADING_MORE"
    });
  }
  
  //We get the navigation location item
  let item = communicatorNavigation.find((item)=>{
    return item.location === actualLocation;
  });
  if (!item){
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: "ERROR"
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
      payload: "ERROR"
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
      payload: "ERROR"
    });
  }
}

async function setLabelStatusCurrentMessage(label, isToAddLabel: boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  let {communicatorMessages} = getState();
  let messageLabel = communicatorMessages.current.labels.find(mlabel=>mlabel.labelId === label.id);
  let communicatorMessageId = communicatorMessages.current.messages[0].communicatorMessageId;
  
  try {
    if (isToAddLabel && !messageLabel){
      let serverProvidedLabel = await promisify(mApi().communicator.messages.labels.create(communicatorMessageId, {
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

function setLabelStatusSelectedMessages(label, isToAddLabel: boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  let communicatorMessages:CommunicatorMessagesType = getState().communicatorMessages;
  
  communicatorMessages.selected.forEach(async (message:CommunicatorMessageType)=>{
    let messageLabel = message.labels.find(mlabel=>mlabel.labelId === label.id);
    
    try {
      if (isToAddLabel && !messageLabel){
        let serverProvidedLabel = await promisify(mApi().communicator.messages.labels.create(message.communicatorMessageId, {
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

let defaultObject = {
  sendMessage(message):AnyActionType {
    
    let recepientWorkspaces = message.to.filter(x=>x.type === "workspace").map(x=>x.value.id)
    let data = {
      caption: message.subject,  
      content: message.text,
      categoryName: "message",
      recipientIds: message.to.filter(x=>x.type === "user").map(x=>x.value.id),
      recipientGroupIds: message.to.filter(x=>x.type === "usergroup").map(x=>x.value.id),
      recipientStudentsWorkspaceIds: recepientWorkspaces,
      recipientTeachersWorkspaceIds: recepientWorkspaces
    };
    
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      try {
        let result;
        if (message.replyThreadId){
          result = await promisify(mApi().communicator.messages.create(message.replyThreadId, data), 'callback')();
        } else {
          result = await promisify(mApi().communicator.messages.create(data), 'callback')();
        }
        
        mApi().communicator.sentitems.cacheClear();
        message.success && message.success(result);
        
        let communicatorMessages:CommunicatorMessagesType = getState().communicatorMessages;
        if (communicatorMessages.location === "sent"){
          let params = {
              firstResult: 0,
              maxResults: 1
          }
          try {
            let messages:CommunicatorMessageListType = <CommunicatorMessageListType>await promisify(mApi().communicator.sentitems.read(params), 'callback')();
            if (messages[0]){
              dispatch({
                type: "PUSH_ONE_MESSAGE_FIRST",
                payload: messages[0]
              });
            }
          } catch (err){}
        }
      } catch (err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
        message.fail && message.fail();
      }
    }
  },
  loadMessages(location: string):AnyActionType {
    return loadMessages.bind(this, location, true);
  },
  updateCommunicatorSelectedMessages(messages: CommunicatorMessageListType):AnyActionType {
    return {
      type: "UPDATE_SELECTED_MESSAGES",
      payload: messages
    };
  },
  addToCommunicatorSelectedMessages(message: CommunicatorMessageListType):AnyActionType {
    return {
      type: "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES",
      payload: message
    };
  },
  removeFromCommunicatorSelectedMessages(message: CommunicatorMessageListType):AnyActionType {
    return {
      type: "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES",
      payload: message
    };
  },
  loadMoreMessages():AnyActionType{
    return loadMessages.bind(this, null, false);
  },
  addLabelToSelectedMessages(label):AnyActionType{
    return setLabelStatusSelectedMessages.bind(this, label, true) ;
  },
  removeLabelFromSelectedMessages(label):AnyActionType{
    return setLabelStatusSelectedMessages.bind(this, label, false) ;
  },
  addLabelToCurrentMessage(label):AnyActionType{
    return setLabelStatusCurrentMessage.bind(this, label, true) ;
  },
  removeLabelFromCurrentMessage(label):AnyActionType{
    return setLabelStatusCurrentMessage.bind(this, label, false) ;
  },
  toggleMessagesReadStatus(message: CommunicatorMessageType):AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      
      let state = getState();
      let communicatorNavigation:CommunicatorNavigationItemListType = state.communicatorNavigation;
      let communicatorMessages:CommunicatorMessagesType = state.communicatorMessages;
      let messageCount:number = state.messageCount;
      
      let item = communicatorNavigation.find((item: CommunicatorNavigationItemType)=>{
        return item.location === communicatorMessages.location;
      });
      if (!item){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null
        });
        return;
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
      
      try {
        if (message.unreadMessagesInThread){
          dispatch(messageCountActions.updateMessageCount(messageCount - 1));
          await promisify(mApi().communicator[getApiId(item)].markasread.create(message.communicatorMessageId), 'callback')();
        } else {
          dispatch(messageCountActions.updateMessageCount(messageCount + 1));
          await promisify(mApi().communicator[getApiId(item)].markasunread.create(message.communicatorMessageId), 'callback')();
        }
      } catch (err){
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
      
      mApi().communicator[getApiId(item)].cacheClear();
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  },
  deleteSelectedMessages():AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      
      let state = getState();
      let communicatorNavigation:CommunicatorNavigationItemListType = state.communicatorNavigation;
      let communicatorMessages:CommunicatorMessagesType = state.communicatorMessages;
      let messageCount:number = state.messageCount;
      
      let item = communicatorNavigation.find((item: CommunicatorNavigationItemType)=>{
        return item.location === communicatorMessages.location;
      });
      if (!item){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null
        });
        return;
      }
      
      let selected:CommunicatorMessageListType = state.communicatorNavigation;
      let selectedIds:Array<number> = state.selectedIds;
      
      await Promise.all(selected.map(async (message)=>{
        try {
          promisify(mApi().communicator[getApiId(item)].del(message.communicatorMessageId), 'callback')();
          if (message.unreadMessagesInThread){
            messageCount--;
          }
          dispatch({
            type: "DELETE_MESSAGE",
            payload: message
          });
        } catch(err){
          dispatch(notificationActions.displayNotification(err.message, 'error'));
        }
      }));
      
      mApi().communicator[getApiId(item)].cacheClear();
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
      dispatch(messageCountActions.updateMessageCount(messageCount));
    }
  },
  deleteCurrentMessage():AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      
      let state = getState();
      let communicatorNavigation:CommunicatorNavigationItemListType = state.communicatorNavigation;
      let communicatorMessages:CommunicatorMessagesType = state.communicatorMessages;
      let item = communicatorNavigation.find((item: CommunicatorNavigationItemType)=>{
        return item.location === communicatorMessages.location;
      });
      if (!item){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null
        });
        return;
      }
      
      let communicatorMessageId = communicatorMessages.current.messages[0].communicatorMessageId;
      
      try {
        await promisify(mApi().communicator[getApiId(item)].del(communicatorMessageId), 'callback')();
        let toDeleteMessage:CommunicatorMessageType = communicatorMessages.messages.find((message:CommunicatorMessageType)=>message.communicatorMessageId === communicatorMessageId);
        if (toDeleteMessage){
          dispatch({
            type: "DELETE_MESSAGE",
            payload: toDeleteMessage
          });
        }
      } catch(err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
      
      mApi().communicator[getApiId(item)].cacheClear();
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
      
      //SADLY the current message doesn't have a mention on wheter
      //The message is read or unread so the message count has to be recalculated
      //by server logic
      dispatch(messageCountActions.updateMessageCount());
      
      location.hash = "#" + item.location;
    }
  },
  loadMessage(location: string, messageId: number):AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      
      let state = getState();
      let communicatorNavigation:CommunicatorNavigationItemListType = state.communicatorNavigation;
      
      let item = communicatorNavigation.find((item:CommunicatorNavigationItemType)=>{
        return item.location === location;
      });
      if (!item){
        //TODO translate this
        dispatch(notificationActions.displayNotification("Invalid navigation location", 'error'));
        return;
      }
      
      try {
        let currentThread:CommunicatorCurrentThreadType = <CommunicatorCurrentThreadType>await promisify(mApi().communicator[getApiId(item, true)].read(messageId), 'callback')();
        dispatch({
          type: "UPDATE_MESSAGES_ALL_PROPERTIES",
          payload: {
            current: currentThread,
            location
          }
        });
      } catch (err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
    }
  },
  loadNewlyReceivedMessage():AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      
      let state = getState();
      let communicatorNavigation:CommunicatorNavigationItemListType = state.communicatorNavigation;
      let communicatorMessages:CommunicatorMessagesType = state.communicatorMessages;
      
      if (communicatorMessages.location === "unread" || communicatorMessages.location === "inbox"){
        let item = communicatorNavigation.find((item)=>{
          return item.location === communicatorMessages.location;
        });
        if (!item){
          return;
        }
        let params = {
            firstResult: 0,
            maxResults: 1,
            onlyUnread: true
        }
        
        try {
          let messages:CommunicatorMessageListType = <CommunicatorMessageListType>await promisify(mApi().communicator[getApiId(item)].read(params), 'callback')();
          if (messages[0]){
            dispatch({
              type: "PUSH_ONE_MESSAGE_FIRST",
              payload: messages[0]
            });
          }
        } catch (err){}
      }
    }
  },
  loadSignature():AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      try {
        let signatures:Array<CommunicatorSignatureType> = <Array<CommunicatorSignatureType>>await promisify(mApi().communicator.signatures.read(), 'callback')();
        if (signatures.length > 0){
          dispatch({
            type: "UPDATE_SIGNATURE",
            payload: signatures[0]
          });
        }
      } catch (err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
    }
  },
  updateSignature(newSignature: string):AnyActionType {
    return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
      let state = getState();
      let communicatorMessages:CommunicatorMessagesType = state.communicatorMessages;
      
      try {
        if (newSignature && communicatorMessages.signature){
          let nSignatureShape:CommunicatorSignatureType = <CommunicatorSignatureType>{id: communicatorMessages.signature.id, name: communicatorMessages.signature.name, signature: newSignature};
          let payload:CommunicatorSignatureType = <CommunicatorSignatureType> await promisify(mApi().communicator.signatures.update(communicatorMessages.signature.id, nSignatureShape), 'callback')();
          dispatch({
            type: "UPDATE_SIGNATURE",
            payload
          });
        } else if (newSignature){
          let payload:CommunicatorSignatureType = <CommunicatorSignatureType> await promisify(mApi().communicator.signatures.create({name:"standard", signature: newSignature}), 'callback')();
          dispatch({
            type: "UPDATE_SIGNATURE",
            payload
          });
        } else {
          await promisify(mApi().communicator.signatures.del(communicatorMessages.signature.id), 'callback')();
          dispatch({
            type: "UPDATE_SIGNATURE",
            payload: null
          });
        }
      } catch (err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
    }
  }
}
export default defaultObject;