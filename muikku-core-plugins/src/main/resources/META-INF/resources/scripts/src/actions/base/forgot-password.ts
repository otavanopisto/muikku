import {SpecificActionType} from '~/actions';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';

export interface LOAD_CREDENTIAL_CHANGE extends SpecificActionType<"LOAD_CREDENTIAL_CHANGE", string>{}
export interface UPDATE_CREDENTIALS extends SpecificActionType<"UPDATE_CREDENTIALS", string>{}

export interface LoadCredentialsTriggerType {
  (token: string):LOAD_CREDENTIAL_CHANGE
}
export interface UpdateCredentialsTriggerType {
  (token: string):UPDATE_CREDENTIALS
}


let loadCredentials:LoadCredentialsTriggerType = function loadCredentials(token){
  let params = new URLSearchParams(location.search);
  
  let credentials = async ()=>{
    let hash = params.get("h");      
    return await (promisify(mApi().forgotpassword.credentialReset.read(hash), 'callback')());
  }  
  return {
    type: 'LOAD_CREDENTIAL_CHANGE',
    payload: token
  }
}

  
export default {loadCredentials};
export {loadCredentials};