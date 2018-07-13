import promisify from '~/util/promisify';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import {UserType, StudentUserAddressType} from '~/reducers/main-function/user-index';
import { StateType } from '~/reducers';

export interface LoadProfilePropertiesSetTriggerType {
  ():AnyActionType
}

export interface SaveProfilePropertyTriggerType {
  (key: string, value: string, callback?: ()=>any):AnyActionType
}

export interface LoadProfileUsernameTriggerType {
  ():AnyActionType
}

export interface LoadProfileAddressTriggerType {
  ():AnyActionType
}

export interface SET_PROFILE_USER_PROPERTY extends SpecificActionType<"SET_PROFILE_USER_PROPERTY", {
  key: string,
  value: string
}>{}

export interface SET_PROFILE_USERNAME extends SpecificActionType<"SET_PROFILE_USERNAME", string>{}

export interface SET_PROFILE_ADDRESS extends SpecificActionType<"SET_PROFILE_ADDRESS", StudentUserAddressType>{}

let loadProfilePropertiesSet:LoadProfilePropertiesSetTriggerType =  function loadProfilePropertiesSet() { 
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    
    try {
      let properties:any = (await promisify(mApi().user.properties.read(state.status.userId, {
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end'
      }), 'callback')());
      
      properties.forEach((property:any)=>{
        dispatch({
          type: "SET_PROFILE_USER_PROPERTY",
          payload: {
            key: property.key,
            value: property.value
          }
        });
      })
      
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let saveProfileProperty:SaveProfilePropertyTriggerType = function saveProfileProperty(key, value, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().user.property.create({key, value}), 'callback')();
      
      dispatch({
        type: "SET_PROFILE_USER_PROPERTY",
        payload: {key, value}
      });
      
      callback && callback();
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let loadProfileUsername:LoadProfileUsernameTriggerType = function loadProfileUsername(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    
    try {
      let credentials:any = (await promisify(mApi().userplugin.credentials.read(), 'callback')());
      
      dispatch({
        type: "SET_PROFILE_USERNAME",
        payload: credentials.username
      });
      
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let loadProfileAddress:LoadProfileAddressTriggerType = function loadProfileAddress(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    
    try {
      let addresses:Array<StudentUserAddressType> = <Array<StudentUserAddressType>>(await promisify(mApi().user.students.addresses.read(getState().status.userSchoolDataIdentifier), 'callback')());
      let address = addresses.find(a=>a.defaultAddress);
      if (!address){
        address = addresses[0];
      }
      
      dispatch({
        type: "SET_PROFILE_ADDRESS",
        payload: address
      });
      
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

export {loadProfilePropertiesSet, saveProfileProperty, loadProfileUsername, loadProfileAddress};