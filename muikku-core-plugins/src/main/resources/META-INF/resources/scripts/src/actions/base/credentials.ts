import {AnyActionType, SpecificActionType} from '~/actions';
import { StateType } from '~/reducers';
import {CredentialsType, CredentialsStateType} from '~/reducers/base/credentials';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
export interface LOAD_CREDENTIALS extends SpecificActionType<"LOAD_CREDENTIALS", CredentialsType>{}
export interface CREDENTIALS_STATE extends SpecificActionType<"CREDENTIALS_STATE", CredentialsStateType>{}
export interface UPDATE_CREDENTIALS extends SpecificActionType<"UPDATE_CREDENTIALS", CredentialsType>{}

export interface UpdateCredentialsTriggerType {
  (data: CredentialsType):AnyActionType
}

export interface LoadCrendentialsTriggerType {
  (secret:string): AnyActionType
}

let LoadCredentials:LoadCrendentialsTriggerType = function loadCredentials(secret){
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
//        this.props.displayNotification(this.props.i18n.text.get("plugin.forgotpassword.changeCredentials.messages.error.hashLoadFailed", err.message), "error");
        if (!(err instanceof MApiError)){
//          this.props.displayNotification(err.message, "error");
        }
  
      }
  }
}

let updateCredentials:UpdateCredentialsTriggerType = function updateCredentials(credentials){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
        mApi().forgotpassword.credentialReset.create(credentials).callback((err: any, result: any)=>{
        });
        dispatch( {
          type: 'UPDATE_CREDENTIALS',
          payload: credentials
        })
        dispatch( {
          type: 'CREDENTIALS_STATE',
          payload: <CredentialsStateType>"CHANGED"
        })
      } catch (err) {
        if (err) { 
  //        this.props.displayNotification(err.message, "error");  
       } else {
  //       this.props.displayNotification(this.props.i18n.text.get("plugin.forgotpassword.changeCredentials.messages.success.credentialsReset"),"success");
       }
      }
  }
}

export default {LoadCredentials};
export {LoadCredentials, updateCredentials};