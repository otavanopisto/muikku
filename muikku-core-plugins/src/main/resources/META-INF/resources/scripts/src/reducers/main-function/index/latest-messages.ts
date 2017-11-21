import {ActionType} from '~/actions';
import {CommunicatorMessageListType} from '~/reducers/main-function/communicator/communicator-messages';

export default function lastMessages(state: CommunicatorMessageListType=[], action: ActionType): CommunicatorMessageListType{
  if (action.type === 'UPDATE_LAST_MESSAGES'){
    return <CommunicatorMessageListType>action.payload;
  }
  return state;
}