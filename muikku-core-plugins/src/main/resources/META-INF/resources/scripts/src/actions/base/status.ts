import {SpecificActionType} from '~/actions';
import { ProfileStatusType } from '~/reducers/base/status';

export interface LOGOUT extends SpecificActionType<"LOGOUT", null>{}
export interface UPDATE_STATUS_PROFILE extends SpecificActionType<"UPDATE_STATUS_PROFILE", ProfileStatusType>{}
export interface UPDATE_STATUS_HAS_IMAGE extends SpecificActionType<"UPDATE_STATUS_HAS_IMAGE", boolean>{}

export interface LogoutTriggerType {
  ():LOGOUT
}

export interface UpdateStatusProfileTriggerType {
  (profile: ProfileStatusType):UPDATE_STATUS_PROFILE
}

export interface UpdateStatusHasImageTriggerType {
  (value: boolean):UPDATE_STATUS_HAS_IMAGE
}

let logout:LogoutTriggerType = function logout(){
  return {
    type: 'LOGOUT',
    payload: null
  }
}
  
let updateStatusProfile:UpdateStatusProfileTriggerType = function updateStatusProfile(profile){
  return {
    type: 'UPDATE_STATUS_PROFILE',
    payload: profile
  }
}

let updateStatusHasImage:UpdateStatusHasImageTriggerType = function updateStatusHasImage(value){
  return {
    type: 'UPDATE_STATUS_HAS_IMAGE',
    payload: value
  }
}

export default {logout, updateStatusProfile, updateStatusHasImage};
export {logout, updateStatusProfile, updateStatusHasImage};