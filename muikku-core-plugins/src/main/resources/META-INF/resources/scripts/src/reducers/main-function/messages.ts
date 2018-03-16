import {ActionType} from "~/actions";

import {CommunicatorMessageListType} from '~/reducers/main-function/communicator/communicator-messages';

export interface MessagesType {
  messages: CommunicatorMessageListType,
  count: number
};

export default function messages(state: MessagesType = {
  messages: [],
  count: 0
}, action: ActionType): MessagesType {
  if (action.type === 'UPDATE_MESSAGES'){
    return Object.assign({}, state, {
      messages: <CommunicatorMessageListType>action.payload
    });
  } else if (action.type === "UPDATE_MESSAGE_COUNT"){
    return Object.assign({}, state, {
      count: <number>action.payload
    });
  }
  return state;
}