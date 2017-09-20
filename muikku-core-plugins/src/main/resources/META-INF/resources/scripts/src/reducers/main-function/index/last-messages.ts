import {CommunicatorMessageListType} from '~/reducers/index.d';
import {ActionType} from '~/actions';

export default function lastMessages(state: CommunicatorMessageListType=[], action: ActionType): CommunicatorMessageListType{
  if (action.type === 'UPDATE_LAST_MESSAGES'){
    return <CommunicatorMessageListType>action.payload;
  }
  return state;
}