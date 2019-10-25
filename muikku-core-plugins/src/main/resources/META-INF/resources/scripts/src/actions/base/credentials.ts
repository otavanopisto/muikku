import {AnyActionType, SpecificActionType} from '~/actions';
import { StateType } from '~/reducers';
import {CredentialsType} from '~/reducers/base/credentials';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';

export interface LOAD_CREDENTIALS extends SpecificActionType<"LOAD_CREDENTIALS", string>{}
export interface UPDATE_CREDENTIALS extends SpecificActionType<"UPDATE_CREDENTIALS", CredentialsType>{}

export interface UpdateCredentialsTriggerType {
  (data: CredentialsType):UPDATE_CREDENTIALS
}
export interface LoadCrendentialsTriggerType {
  (secret:string): AnyActionType
}

let LoadCredentials:LoadCrendentialsTriggerType = function loadCredentials(secret){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
       let data:any = await (promisify(mApi().forgotpassword.credentialReset.read(this.props.user), 'callback')());
        return {
          type: 'LOAD_CREDENTIALS',
          payload: data
        }
      } catch (err){
        this.props.displayNotification(this.props.i18n.text.get("plugin.forgotpassword.changeCredentials.messages.error.hashLoadFailed", err.message), "error");
        if (!(err instanceof MApiError)){
          this.props.displayNotification(err.message, "error");
        }
  
      }
  }
}

let updateCredentials:UpdateCredentialsTriggerType = function updateCredentials(user){
    try {
      mApi().forgotpassword.credentialReset.create(user).callback((err: any, result: any)=>{
      });
      return {
        type: 'UPDATE_CREDENTIALS',
        payload: null
      }
    } catch (err) {
      if (err) { 
        this.props.displayNotification(err.message, "error");  
     } else {
       this.props.displayNotification(this.props.i18n.text.get("plugin.forgotpassword.changeCredentials.messages.success.credentialsReset"),"success");
     }
    }
}
  
  



export default {LoadCredentials};
export {LoadCredentials, updateCredentials};