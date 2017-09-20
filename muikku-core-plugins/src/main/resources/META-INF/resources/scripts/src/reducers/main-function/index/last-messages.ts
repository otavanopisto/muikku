import {CommunicatorMessageListType} from '~/reducers';
import {ActionType} from '~/actions';

export default function lastMessages(state: CommunicatorMessageListType=[], action: ActionType<any>): CommunicatorMessageListType{
  if (action.type === 'UPDATE_LAST_MESSAGES'){
    return <CommunicatorMessageListType>action.payload;
  }
  return state;
}