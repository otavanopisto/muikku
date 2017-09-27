import {ActionType} from '~/actions';
import {WorkspaceType, WorkspaceListType} from '~/reducers/main-function/index/workspaces';

export type CommunicatorStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export interface CommunicatorSignatureType {
  id: number,
  name: string,
  signature: string
}

export interface CommunicatorMessageSenderType {
  id: Number,
  firstName: string,
  lastName?: string | null,
  nickName?: string | null,
  studyProgrammeName?: string | null,
  hasImage: boolean,
  hasEvaluationFees: false,
  curriculumIdentifier?: string | number | null;
}
export interface CommunicatorMessageLabelType {
  id: number,
  labelColor: number,
  labelId: number,
  labelName: string,
  messageThreadId: number,
  userEntityId: number
}
export interface CommunicatorMessageLabelPatchType {
  id?: number,
  labelColor?: number,
  labelId?: number,
  labelName?: string,
  messageThreadId?: number,
  userEntityId?: number
}
export interface CommunicatorMessageLabelListType extends Array<CommunicatorMessageLabelType> {};
export interface CommunicatorMessageType {
  id: number,
  communicatorMessageId: number,
  senderId: number,
  categoryName: "message",
  caption: string,
  created: string,
  tags: any,
  threadLatestMessageDate: string,
  unreadMessagesInThread: boolean,
  sender: CommunicatorMessageSenderType,
  messageCountInThread: number,
  labels: CommunicatorMessageLabelListType
}
export interface CommunicatorMessageUpdateType {
  communicatorMessageId?: number,
  senderId?: number,
  categoryName?: "message",
  caption?: string,
  created?: string,
  tags?: any,
  threadLatestMessageDate?: string,
  unreadMessagesInThread?: boolean,
  sender?: CommunicatorMessageSenderType,
  messageCountInThread?: number,
  labels?: CommunicatorMessageLabelListType
}
export interface CommunicatorCurrentThreadType {
  olderThreadId?: number | null,
  newerThreadId?: number | null,
  messages: Array<CommunicatorMessageExtendedType>,
  labels: CommunicatorMessageLabelListType
}
export interface UserGroup {
  id: number,
  name: string,
  userCount: number
}
export interface UserGroupList extends Array<UserGroup> {}
export interface CommunicatorMessageExtendedType {
  caption: string,
  categoryName: "message",
  communicatorMessageId: number,
  content: string,
  created: string,
  id: number,
  recipientCount: number,
  recipients: Array<CommunicatorMessageRecepientType>,
  sender: CommunicatorMessageSenderType,
  senderId: number,
  tags: any,
  userGroupRecipients: UserGroupList,
  //TODO I am not sure what this is yet
  workspaceRecipients: WorkspaceListType
}
export interface CommunicatorMessageRecepientType {
  communicatorMessageId: number,
  userId: number,
  nickName?: string | null,
  firstName: string,
  lastName?: string | null,
  recipientId: number
}
export interface CommunicatorMessageListType extends Array<CommunicatorMessageType> {}

export interface CommunicatorMessagesType {
  state: CommunicatorStateType,
  messages: CommunicatorMessageListType,
  selected: CommunicatorMessageListType,
  selectedIds: Array<number>,
  pages: number,
  hasMore: boolean,
  location: string,
  toolbarLock: boolean,
  current: CommunicatorCurrentThreadType | null,
  signature: CommunicatorSignatureType | null
}

export interface CommunicatorMessagesPatchType {
  state?: CommunicatorStateType,
  messages?: CommunicatorMessageListType,
  selected?: CommunicatorMessageListType,
  selectedIds?: Array<number>,
  pages?: number,
  hasMore?: boolean,
  location?: string,
  toolbarLock?: boolean,
  current?: CommunicatorCurrentThreadType | null,
  signature?: CommunicatorSignatureType | null
}

//TODO fix these anies
export interface CommunicatorMessageWorkspaceRecepientType {
  type: "workspace",
  value: WorkspaceType
}

export interface CommunicatorMessageUserRecepientType {
  type: "user",
  value: any        //TODO fix user and usergoup type
}

export interface CommunicatorMessageUserGroupRecepientType {
  type: "usergroup",
  value: any
}

export type CommunicatorMessageItemRecepientType = CommunicatorMessageWorkspaceRecepientType | CommunicatorMessageUserRecepientType  | CommunicatorMessageUserGroupRecepientType

export default function communicatorMessages(state: CommunicatorMessagesType={
  state: "LOADING",
  messages: [],
  selected: [],
  selectedIds: [],
  pages: 1,
  hasMore: false,
  location: "",
  toolbarLock: false,
  current: null,
  signature: null
}, action: ActionType): CommunicatorMessagesType {
  if (action.type === "UPDATE_MESSAGES_STATE"){
    let newState: CommunicatorStateType = action.payload;
    return Object.assign({}, state, {state: newState});
  } else if (action.type === "UPDATE_MESSAGES_ALL_PROPERTIES"){
    let newAllProperties: CommunicatorMessagesPatchType = action.payload;
    return Object.assign({}, state, newAllProperties);
  } else if (action.type === "UPDATE_SELECTED_MESSAGES"){
    let newMessages: CommunicatorMessageListType = action.payload;
    return Object.assign({}, state, {selected: newMessages, selectedIds: newMessages.map((s: CommunicatorMessageType)=>s.communicatorMessageId)});
  } else if (action.type === "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES"){
    let newMessage: CommunicatorMessageType = action.payload;
    return Object.assign({}, state, {
      selected: state.selected.concat([newMessage]),
      selectedIds: state.selectedIds.concat([newMessage.communicatorMessageId])
    });
  } else if (action.type === "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: state.selected.filter((selected: CommunicatorMessageType)=>{
      return selected.communicatorMessageId !== action.payload.communicatorMessageId
    }), selectedIds: state.selectedIds.filter((id: number)=>{return id !== action.payload.communicatorMessageId})});
  } else if (action.type === "UPDATE_ONE_MESSAGE"){
    let update: CommunicatorMessageUpdateType = action.payload.update;
    let oldMessage: CommunicatorMessageType = action.payload.message;
    let newMessage: CommunicatorMessageType = Object.assign({}, oldMessage, update);
    return Object.assign({}, state, {selected: state.selected.map((selected: CommunicatorMessageType)=>{
      if (selected.communicatorMessageId === oldMessage.communicatorMessageId){
        return newMessage
      }
      return selected;
    }), messages: state.messages.map((message: CommunicatorMessageType)=>{
      if (message.communicatorMessageId === oldMessage.communicatorMessageId){
        return newMessage
      }
      return message;
    })});
  } else if (action.type === "LOCK_TOOLBAR"){
    return Object.assign({}, state, {toolbarLock: true});
  } else if (action.type === "UNLOCK_TOOLBAR"){
    return Object.assign({}, state, {toolbarLock: false});
  } else if (action.type === "UPDATE_MESSAGE_ADD_LABEL"){
    let newCurrent = state.current;
    if (newCurrent && newCurrent.messages[0].communicatorMessageId === action.payload.communicatorMessageId){
      newCurrent = Object.assign(newCurrent, {labels: newCurrent.labels.concat([action.payload.label])});
    }
    
    return Object.assign({}, state, {selected: state.selected.map((selected: CommunicatorMessageType)=>{
      if (selected.communicatorMessageId === action.payload.communicatorMessageId){
        if (!selected.labels.find(label=>label.labelId === action.payload.label.labelId)){
          return Object.assign({}, selected, {
            labels: selected.labels.concat([action.payload.label])
          });
        } else {
          return selected;
        }
      }
      return selected;
    }), messages: state.messages.map((message: CommunicatorMessageType)=>{
      if (message.communicatorMessageId === action.payload.communicatorMessageId){
        if (!message.labels.find(label=>label.labelId === action.payload.label.labelId)){
          return Object.assign({}, message, {
            labels: message.labels.concat([action.payload.label])
          });
        } else {
          return message;
        }
      }
      return message;
    }), current: newCurrent});
  } else if (action.type === "UPDATE_MESSAGE_DROP_LABEL"){   
    let newCurrent = state.current;
    if (newCurrent && newCurrent.messages[0].communicatorMessageId === action.payload.communicatorMessageId){
      newCurrent = Object.assign(newCurrent, {
        labels: newCurrent.labels.filter(label=>label.labelId !== action.payload.label.labelId)
      });
    }
    
    return Object.assign({}, state, {selected: state.selected.map((selected: CommunicatorMessageType)=>{
      if (selected.communicatorMessageId === action.payload.communicatorMessageId){
        return Object.assign({}, selected, {
          labels: selected.labels.filter(label=>label.labelId !== action.payload.label.labelId)
        });
      }
      return selected;
    }), messages: state.messages.map((message: CommunicatorMessageType)=>{
      if (message.communicatorMessageId === action.payload.communicatorMessageId){
        return Object.assign({}, message, {
          labels: message.labels.filter(label=>label.labelId !== action.payload.label.labelId)
        });
      }
      return message;
    }), current: newCurrent});
  } else if (action.type === "DELETE_MESSAGE"){
    return Object.assign({}, state, {selected: state.selected.filter((selected: CommunicatorMessageType)=>{
      return selected.communicatorMessageId !== action.payload.communicatorMessageId
    }), messages: state.messages.filter((message: CommunicatorMessageType)=>{
      return message.communicatorMessageId !== action.payload.communicatorMessageId
    }), selectedIds: state.selectedIds.filter((id: number)=>{return id !== action.payload.communicatorMessageId})});
  } else if (action.type === "SET_CURRENT_THREAD"){
    return Object.assign({}, state, {current: <CommunicatorCurrentThreadType>action.payload});
  } else if (action.type === "UPDATE_ONE_LABEL_FROM_ALL_MESSAGES"){
    let update: CommunicatorMessageLabelPatchType = action.payload.update;
    return Object.assign({}, state, {selected: state.selected.map((selected: CommunicatorMessageType)=>{
      return Object.assign({}, selected, {labels: selected.labels.map((label)=>{
        if (label.labelId === action.payload.labelId){
          return Object.assign({}, label, update);
        }
        return label;
      })});
    }), messages: state.messages.map((message: CommunicatorMessageType)=>{
      return Object.assign({}, message, {labels: message.labels.map((label)=>{
        if (label.labelId === action.payload.labelId){
          return Object.assign({}, label, update);
        }
        return label;
      })});
    }), current : (state.current ? Object.assign({}, state.current, state.current.labels.map((label)=>{
      if (label.labelId === action.payload.labelId){
        return Object.assign({}, label, update);
      }
      return label;
    })) : state.current)});
  } else if (action.type === "REMOVE_ONE_LABEL_FROM_ALL_MESSAGES"){
    return Object.assign({}, state, {selected: state.selected.filter((selected: CommunicatorMessageType)=>{
      return Object.assign({}, selected, {
        labels: selected.labels.filter(label=>label.labelId !== action.payload.labelId)
      });
    }), messages: state.messages.filter((message: CommunicatorMessageType)=>{
      return Object.assign({}, message, {
        labels: message.labels.filter(label=>label.labelId !== action.payload.labelId)
      });
    }), current : (state.current ? Object.assign({}, state.current, {
      labels: state.current.labels.filter(label=>label.labelId !== action.payload.labelId)
    }) : state.current)});
  } else if (action.type === "PUSH_ONE_MESSAGE_FIRST"){
    return Object.assign({}, state, {messages: [<CommunicatorMessageType>action.payload].concat(state.messages)});
  } else if (action.type === "UPDATE_SIGNATURE"){
    return Object.assign({}, state, {signature: <CommunicatorSignatureType>action.payload});
  }
  return state;
}