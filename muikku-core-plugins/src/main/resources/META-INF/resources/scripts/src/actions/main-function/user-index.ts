import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi from '~/lib/mApi';
import {UserType} from '~/reducers/main-function/user-index';

export interface LoadUserIndexTriggerType {
  (userId: number):AnyActionType
}

export interface SET_USER_INDEX extends SpecificActionType<"SET_USER_INDEX", {
  index: number,
  value: UserType
}>{}

let fetchingState:{[index: number]: boolean} = {};

let loadUserIndex:LoadUserIndexTriggerType =  function loadUserIndex(userId) { 
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let currentUserInfo = state.userIndex[userId];
    if (currentUserInfo || fetchingState[userId]){
      return;
    }
    
    fetchingState[userId] = true;
    
    try {
      dispatch({
        type: "SET_USER_INDEX",
        payload: {
          index: userId,
          value: <UserType>(await (promisify(mApi().user.users.basicinfo.read(userId), 'callback')()) || 0)
        }
      });
    } catch(err){
    }
  }
}

export default {loadUserIndex}
export {loadUserIndex}