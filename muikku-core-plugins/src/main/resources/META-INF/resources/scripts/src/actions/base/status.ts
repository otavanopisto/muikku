import {SpecificActionType} from '~/actions';
export interface LOGOUT extends SpecificActionType<"LOGOUT", null>{}

export interface LogoutTriggerType {
  ():LOGOUT
}

let logout:LogoutTriggerType = function logout(){
  return {
    type: 'LOGOUT',
    payload: null
  }
}

export default {logout};
export {logout};