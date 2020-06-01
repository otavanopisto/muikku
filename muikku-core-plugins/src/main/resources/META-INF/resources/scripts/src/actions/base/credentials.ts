import {AnyActionType, SpecificActionType} from '~/actions';
import { StateType } from '~/reducers';
import {CredentialsType, CredentialsStateType} from '~/reducers/base/credentials';
import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
export interface LOAD_CREDENTIALS extends SpecificActionType<"LOAD_CREDENTIALS", CredentialsType>{}
export interface CREDENTIALS_STATE extends SpecificActionType<"CREDENTIALS_STATE", CredentialsStateType>{}


export interface UpdateCredentialsTriggerType {
  (data: CredentialsType):AnyActionType
}

export interface LoadCrendentialsTriggerType {
  (secret:string): AnyActionType
}

let loadCredentials:LoadCrendentialsTriggerType = function loadCredentials(secret){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let data:any = await (promisify(mApi().forgotpassword.credentialReset.read(secret), 'callback')());
        dispatch( {
          type: 'LOAD_CREDENTIALS',
          payload: data
        })
        dispatch( {
          type: 'CREDENTIALS_STATE',
          payload: <CredentialsStateType>"READY"
        })
      } catch (err){
        if (!(err instanceof MApiError)){
          return dispatch(notificationActions.displayNotification(err.message, 'error'));
        }
        return dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.forgotpassword.changeCredentials.messages.error.hashLoadFailed", err.message), 'error'));
      }
  }
}

let updateCredentials:UpdateCredentialsTriggerType = function updateCredentials(credentials){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
       mApi().forgotpassword.credentialReset.create(credentials).callback((err: any, result: any)=>{
        });
       dispatch( {
          type: 'CREDENTIALS_STATE',
          payload: <CredentialsStateType>"CHANGED"
       })
       dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.forgotpassword.changeCredentials.messages.success.credentialsReset"), 'success'));
    } catch (err) {
       if (err) {
         return dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
    }
  }
}

export default {loadCredentials};
export {loadCredentials, updateCredentials};
