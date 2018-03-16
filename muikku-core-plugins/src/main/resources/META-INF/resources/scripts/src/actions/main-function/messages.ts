import actions from '../base/notifications';
import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import {CommunicatorMessageListType} from '~/reducers/main-function/communicator/communicator-messages';
import mApi from '~/lib/mApi';
import { StateType } from '~/reducers';

export interface UpdateMessageCountTriggerType {
  (value?: number):AnyActionType
}

export interface UPDATE_MESSAGE_COUNT extends SpecificActionType<"UPDATE_MESSAGE_COUNT", number>{}
export interface UPDATE_MESSAGES extends SpecificActionType<"UPDATE_MESSAGES", CommunicatorMessageListType>{}

let updateMessageCount:UpdateMessageCountTriggerType =  function updateMessageCount(value) {
  if (typeof value !== "undefined"){
    return {
      type: "UPDATE_MESSAGE_COUNT",
      payload: value
    }
  }
  
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: "UPDATE_MESSAGE_COUNT",
        payload: <number>(await (promisify(mApi().communicator.receiveditemscount.cacheClear().read(), 'callback')()) || 0)
      });
    } catch(err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export interface LoadLastMessagesFromSeverTriggerType {
  (maxResults: number):AnyActionType
}

let loadLastMessagesFromServer:LoadLastMessagesFromSeverTriggerType = function loadLastMessagesFromServer(maxResults) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: 'UPDATE_MESSAGES',
        payload: <CommunicatorMessageListType>(await promisify(mApi().communicator.items.read({
          'firstResult': 0,
          'maxResults': maxResults
        }), 'callback')())
      });
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {updateMessageCount, loadLastMessagesFromServer}
export {updateMessageCount, loadLastMessagesFromServer}