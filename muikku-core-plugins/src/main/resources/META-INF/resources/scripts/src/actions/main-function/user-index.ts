import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi from '~/lib/mApi';
import {UserType} from '~/reducers/main-function/user-index';

export interface LoadUserIndexTriggerType {
  (userId: number):AnyActionType
}

export interface LoadUserIndexBySchoolDataTriggerType {
  (userId: string):AnyActionType
}

export interface LoadUserGroupIndexTriggerType {
  (groupId: number):AnyActionType
}

export interface SET_USER_INDEX extends SpecificActionType<"SET_USER_INDEX", {
  index: number,
  value: UserType
}>{}

export interface SET_USER_GROUP_INDEX extends SpecificActionType<"SET_USER_GROUP_INDEX", {
  index: number,
  value: any      //TODO fix these user groups
}>{}

export interface SET_USER_BY_SCHOOL_DATA_INDEX extends SpecificActionType<"SET_USER_BY_SCHOOL_DATA_INDEX", {
  index: string,
  value: UserType
}>{}

let fetchingStateUser:{[index: number]: boolean} = {};
let fetchingStateUserBySchoolData:{[index: string]: boolean} = {};
let fetchingStateUserGroup:{[index: number]: boolean} = {};

let loadUserIndex:LoadUserIndexTriggerType =  function loadUserIndex(userId) { 
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let currentUserInfo = state.userIndex.users[userId];
    if (currentUserInfo || fetchingStateUser[userId]){
      return;
    }
    
    fetchingStateUser[userId] = true;
    
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

let loadUserIndexBySchoolData:LoadUserIndexBySchoolDataTriggerType =  function loadUserIndexBySchoolData(userId) { 
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let currentUserInfo = state.userIndex.users[userId];
    if (currentUserInfo || fetchingStateUserBySchoolData[userId]){
      return;
    }
    
    fetchingStateUserBySchoolData[userId] = true;
    
    try {
      dispatch({
        type: "SET_USER_BY_SCHOOL_DATA_INDEX",
        payload: {
          index: userId,
          value: <UserType>(await (promisify(mApi().user.users.basicinfo.read(userId), 'callback')()) || 0)
        }
      });
    } catch(err){
    }
  }
}

let loadUserGroupIndex:LoadUserGroupIndexTriggerType =  function loadUserGroupIndex(groupId) { 
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let currentGroupInfo = state.userIndex.groups[groupId];
    if (currentGroupInfo || fetchingStateUser[groupId]){
      return;
    }
    
    fetchingStateUser[groupId] = true;
    
    try {
      dispatch({
        type: "SET_USER_GROUP_INDEX",
        payload: {
          index: groupId,
          value: (await (promisify(mApi().usergroup.groups.read(groupId), 'callback')()) || 0)
        }
      });
    } catch(err){
    }
  }
}

export default {loadUserIndex, loadUserGroupIndex, loadUserIndexBySchoolData}
export {loadUserIndex, loadUserGroupIndex, loadUserIndexBySchoolData}