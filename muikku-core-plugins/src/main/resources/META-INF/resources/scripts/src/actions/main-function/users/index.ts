import mApi, {MApiError} from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import promisify from '~/util/promisify';


import {UserStatusType} from 'reducers/main-function/users';
import {UserType} from 'reducers/user-index';
import notificationActions from '~/actions/base/notifications';
import {StateType} from '~/reducers';


export type UPDATE_STUDENT_USERS = SpecificActionType<"UPDATE_STUDENT_USERS", UserType>
export type UPDATE_STAFF_USERS = SpecificActionType<"UPDATE_STAFF_USERS", UserType>
export type UPDATE_USERS_STATE = SpecificActionType<"UPDATE_USERS_STATE", UserStatusType>



//Do not delete this, this is for organization 



export interface LoadUsersTriggerType {
  (): AnyActionType
}

let loadUsers:LoadUsersTriggerType = function loadUserst(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      
      let currentUserSchoolDataIdentifier = getState().status.userSchoolDataIdentifier;

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      
      await Promise.all([
        promisify(mApi().user.students.read(), 'callback')()
          .then((users:UserType)=>{
            dispatch({
              type: "UPDATE_STUDENT_USERS", 
              payload: users
            });
          }),
        promisify(mApi().user.staffMembers.read(), 'callback')()
          .then((users:UserType)=>{
            dispatch({
              type: "UPDATE_STAFF_USERS", 
              payload: users
            });
          }),
      ]);
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"READY"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
     }
  }
}



export {loadUsers};