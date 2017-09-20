import * as dataTypes from '~/reducers/index.d';

export interface ActionType {
  type: string,
  payload: any
}

export interface SpecificActionType<ActionType, PayloadType> extends ActionType {
  type: ActionType,
  payload: PayloadType | null
}

type dispatch = (action:any)=>any;
type getState = ()=>any;
type DeferredAction = (dispatch, getState)=>any;

export interface SET_LOCALE extends SpecificActionType<"SET_LOCALE", string>{}
export interface ADD_NOTIFICATION extends SpecificActionType<"ADD_NOTIFICATION", dataTypes.NotificationType>{}
export interface HIDE_NOTIFICATION extends SpecificActionType<"HIDE_NOTIFICATION", dataTypes.NotificationType>{}
export interface LOGOUT extends SpecificActionType<"LOGOUT", null>{}
export interface UPDATE_TITLE extends SpecificActionType<"UPDATE_TITLE", string>{}
export interface UPDATE_MESSAGE_COUNT extends SpecificActionType<"UPDATE_MESSAGE_COUNT", number>{}

export interface SET_CURRENT_THREAD extends SpecificActionType<"SET_CURRENT_THREAD", dataTypes.CommunicatorCurrentThreadType>{}
export interface UPDATE_MESSAGES_STATE extends SpecificActionType<"UPDATE_MESSAGES_STATE", dataTypes.CommunicatorStateType>{}
export interface UPDATE_MESSAGES_ALL_PROPERTIES extends SpecificActionType<"UPDATE_MESSAGES_ALL_PROPERTIES", dataTypes.CommunicatorMessagesPatchType>{}
export interface UPDATE_MESSAGE_ADD_LABEL extends SpecificActionType<"UPDATE_MESSAGE_ADD_LABEL", {
  communicatorMessageId: number,
  label: dataTypes.CommunicatorMessageLabelType
}>{}
export interface UPDATE_MESSAGE_DROP_LABEL extends SpecificActionType<"UPDATE_MESSAGE_DROP_LABEL", {
  communicatorMessageId: number,
  label: dataTypes.CommunicatorMessageLabelType
}>{}
export interface PUSH_ONE_MESSAGE_FIRST extends SpecificActionType<"PUSH_ONE_MESSAGE_FIRST", dataTypes.CommunicatorMessageType>{}
export interface LOCK_TOOLBAR extends SpecificActionType<"LOCK_TOOLBAR", null>{}
export interface UNLOCK_TOOLBAR extends SpecificActionType<"UNLOCK_TOOLBAR", null>{}
export interface UPDATE_ONE_MESSAGE extends SpecificActionType<"UPDATE_ONE_MESSAGE", {
  message: dataTypes.CommunicatorMessageType,
  update: dataTypes.CommunicatorMessageUpdateType
}>{}
export interface UPDATE_SIGNATURE extends SpecificActionType<"UPDATE_SIGNATURE", dataTypes.CommunicatorSignatureType>{}
export interface DELETE_MESSAGE extends SpecificActionType<"DELETE_MESSAGE", dataTypes.CommunicatorMessageType>{}
export interface UPDATE_SELECTED_MESSAGES extends SpecificActionType<"UPDATE_SELECTED_MESSAGES", dataTypes.CommunicatorMessageListType>{}
export interface ADD_TO_COMMUNICATOR_SELECTED_MESSAGES extends SpecificActionType<"ADD_TO_COMMUNICATOR_SELECTED_MESSAGES", dataTypes.CommunicatorMessageType>{}
export interface REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES extends SpecificActionType<"REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES", dataTypes.CommunicatorMessageType>{}

export type AnyActionType = SET_CURRENT_THREAD | UPDATE_MESSAGES_STATE |
  UPDATE_MESSAGES_ALL_PROPERTIES | UPDATE_MESSAGE_ADD_LABEL | UPDATE_MESSAGE_DROP_LABEL | PUSH_ONE_MESSAGE_FIRST |
  LOCK_TOOLBAR | UNLOCK_TOOLBAR | UPDATE_ONE_MESSAGE | DELETE_MESSAGE | UPDATE_MESSAGES_ALL_PROPERTIES | UPDATE_SIGNATURE |
  SET_LOCALE | ADD_NOTIFICATION | HIDE_NOTIFICATION | LOGOUT | UPDATE_TITLE | UPDATE_SELECTED_MESSAGES | ADD_TO_COMMUNICATOR_SELECTED_MESSAGES |
  REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES | UPDATE_MESSAGE_COUNT
  | DeferredAction
  
