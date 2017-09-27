import notificationActions from '~/actions/base/notifications';
import messageCountActions from '~/actions/main-function/message-count';

import {hexToColorInt} from '~/util/modifiers';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';

import {getApiId, loadMessagesHelper, setLabelStatusCurrentMessage, setLabelStatusSelectedMessages} from './communicator-messages/helpers';
import {AnyActionType, SpecificActionType} from '~/actions';
import {CommunicatorCurrentThreadType, CommunicatorStateType,
  CommunicatorMessagesPatchType, CommunicatorMessageLabelType, CommunicatorMessageType,
  CommunicatorMessageUpdateType, CommunicatorSignatureType, CommunicatorMessageListType,
  CommunicatorMessageItemRecepientType, CommunicatorMessagesType} from '~/reducers/main-function/communicator/communicator-messages';
import {CommunicatorNavigationItemListType, CommunicatorNavigationItemType} from '~/reducers/main-function/communicator/communicator-navigation';

//////////////////////////////////////// INTERFACES FOR ACTIONS
export interface SET_CURRENT_THREAD extends SpecificActionType<"SET_CURRENT_THREAD", CommunicatorCurrentThreadType>{}
export interface UPDATE_MESSAGES_STATE extends SpecificActionType<"UPDATE_MESSAGES_STATE", CommunicatorStateType>{}
export interface UPDATE_MESSAGES_ALL_PROPERTIES extends SpecificActionType<"UPDATE_MESSAGES_ALL_PROPERTIES", CommunicatorMessagesPatchType>{}
export interface UPDATE_MESSAGE_ADD_LABEL extends SpecificActionType<"UPDATE_MESSAGE_ADD_LABEL", {
  communicatorMessageId: number,
  label: CommunicatorMessageLabelType
}>{}
export interface UPDATE_MESSAGE_DROP_LABEL extends SpecificActionType<"UPDATE_MESSAGE_DROP_LABEL", {
  communicatorMessageId: number,
  label: CommunicatorMessageLabelType
}>{}
export interface PUSH_ONE_MESSAGE_FIRST extends SpecificActionType<"PUSH_ONE_MESSAGE_FIRST", CommunicatorMessageType>{}
export interface LOCK_TOOLBAR extends SpecificActionType<"LOCK_TOOLBAR", null>{}
export interface UNLOCK_TOOLBAR extends SpecificActionType<"UNLOCK_TOOLBAR", null>{}
export interface UPDATE_ONE_MESSAGE extends SpecificActionType<"UPDATE_ONE_MESSAGE", {
  message: CommunicatorMessageType,
  update: CommunicatorMessageUpdateType
}>{}
export interface UPDATE_SIGNATURE extends SpecificActionType<"UPDATE_SIGNATURE", CommunicatorSignatureType>{}
export interface DELETE_MESSAGE extends SpecificActionType<"DELETE_MESSAGE", CommunicatorMessageType>{}
export interface UPDATE_SELECTED_MESSAGES extends SpecificActionType<"UPDATE_SELECTED_MESSAGES", CommunicatorMessageListType>{}
export interface ADD_TO_COMMUNICATOR_SELECTED_MESSAGES extends SpecificActionType<"ADD_TO_COMMUNICATOR_SELECTED_MESSAGES", CommunicatorMessageType>{}
export interface REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES extends SpecificActionType<"REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES", CommunicatorMessageType>{}

//////////////////////////////////// INTERFACES
export interface SendMessageTriggerType {
  (message: {
    to: CommunicatorMessageItemRecepientType[],
    replyThreadId: number,
    subject: string,
    text: string,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface LoadMessagesTriggerType {
  (location:string):AnyActionType
}

export interface UpdateCommunicatorSelectedMessagesTriggerType {
  (messages: CommunicatorMessageListType):AnyActionType
}

export interface AddToCommunicatorSelectedMessagesTriggerType {
  (message: CommunicatorMessageType):AnyActionType
}

export interface LoadMoreMessagesTriggerType {
  ():AnyActionType
}

export interface RemoveFromCommunicatorSelectedMessagesTriggerType {
  (message: CommunicatorMessageType):AnyActionType
}

export interface AddLabelToSelectedMessagesTriggerType {
  (label: CommunicatorMessageLabelType):AnyActionType
}

export interface RemoveLabelFromSelectedMessagesTriggerType {
  (label: CommunicatorMessageLabelType):AnyActionType
}

export interface AddLabelToCurrentMessageTriggerType {
  (label: CommunicatorMessageLabelType):AnyActionType
}

export interface RemoveLabelFromCurrentMessageTriggerType {
  (label: CommunicatorMessageLabelType):AnyActionType
}

export interface ToggleMessageReadStatusTriggerType {
  (message: CommunicatorMessageType):AnyActionType
}

export interface DeleteSelectedMessagesTriggerType {
  ():AnyActionType
}

export interface DeleteCurrentMessageTriggerType {
  ():AnyActionType
}

export interface LoadMessageTriggerType {
  (location: string, messageId: number):AnyActionType
}

export interface LoadNewlyReceivedMessageTriggerType {
  ():AnyActionType
}

export interface LoadSignatureTriggerType {
  ():AnyActionType
}

export interface UpdateSignatureTriggerType {
  (newSignature: string):AnyActionType
}

/////////////////// ACTUAL DEFINITIONS
let sendMessage:SendMessageTriggerType = function sendMessage(message){
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
      message.success && message.success();
      
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
}

let loadMessages:LoadMessagesTriggerType = function loadMessages(location){
  return loadMessagesHelper.bind(this, location, true);
}

let updateCommunicatorSelectedMessages:UpdateCommunicatorSelectedMessagesTriggerType =  function updateCommunicatorSelectedMessages(messages) {
  return {
    type: "UPDATE_SELECTED_MESSAGES",
    payload: messages
  };
}

let addToCommunicatorSelectedMessages:AddToCommunicatorSelectedMessagesTriggerType = function addToCommunicatorSelectedMessages(message) {
  return {
    type: "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES",
    payload: message
  };
}

let removeFromCommunicatorSelectedMessages:RemoveFromCommunicatorSelectedMessagesTriggerType = function removeFromCommunicatorSelectedMessages(message) {
  return {
    type: "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES",
    payload: message
  };
}

let loadMoreMessages:LoadMoreMessagesTriggerType = function loadMoreMessages(){
  return loadMessagesHelper.bind(this, null, false);
}

let addLabelToSelectedMessages: AddLabelToSelectedMessagesTriggerType = function addLabelToSelectedMessages(label){
  return setLabelStatusSelectedMessages.bind(this, label, true) ;
}

let removeLabelFromSelectedMessages: RemoveLabelFromSelectedMessagesTriggerType = function removeLabelFromSelectedMessages(label){
  return setLabelStatusSelectedMessages.bind(this, label, false) ;
}

let addLabelToCurrentMessage:AddLabelToCurrentMessageTriggerType = function addLabelToCurrentMessage(label){
  return setLabelStatusCurrentMessage.bind(this, label, true) ;
}

let removeLabelFromCurrentMessage:RemoveLabelFromCurrentMessageTriggerType = function removeLabelFromCurrentMessage(label){
  return setLabelStatusCurrentMessage.bind(this, label, false) ;
}

let toggleMessagesReadStatus:ToggleMessageReadStatusTriggerType =  function toggleMessagesReadStatus(message) {
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
}

let deleteSelectedMessages:DeleteSelectedMessagesTriggerType = function deleteSelectedMessages() {
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
}

let deleteCurrentMessage:DeleteCurrentMessageTriggerType = function deleteCurrentMessage() {
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
}

let loadMessage:LoadMessageTriggerType = function loadMessage(location, messageId) {
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
}

let loadNewlyReceivedMessage:LoadNewlyReceivedMessageTriggerType = function loadNewlyReceivedMessage() {
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
}

let loadSignature:LoadSignatureTriggerType = function loadSignature() {
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
}

let updateSignature:UpdateSignatureTriggerType = function updateSignature(newSignature) {
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

export {sendMessage, loadMessages, updateCommunicatorSelectedMessages,
  addToCommunicatorSelectedMessages, removeFromCommunicatorSelectedMessages,
  loadMoreMessages, addLabelToSelectedMessages, removeLabelFromSelectedMessages,
  addLabelToCurrentMessage, removeLabelFromCurrentMessage, toggleMessagesReadStatus,
  deleteSelectedMessages, deleteCurrentMessage, loadMessage, loadNewlyReceivedMessage,
  loadSignature, updateSignature}
export default {sendMessage, loadMessages, updateCommunicatorSelectedMessages,
  addToCommunicatorSelectedMessages, removeFromCommunicatorSelectedMessages,
  loadMoreMessages, addLabelToSelectedMessages, removeLabelFromSelectedMessages,
  addLabelToCurrentMessage, removeLabelFromCurrentMessage, toggleMessagesReadStatus,
  deleteSelectedMessages, deleteCurrentMessage, loadMessage, loadNewlyReceivedMessage,
  loadSignature, updateSignature}