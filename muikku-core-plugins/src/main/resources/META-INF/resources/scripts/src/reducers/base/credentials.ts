import {ActionType} from "~/actions";

export interface CredentialsType {
  secret: string,
  username: string,
  password: string
}

export default function credentials(state: CredentialsType = {
  secret: "",
  username: "",
  password: ""
} , action: ActionType): CredentialsType {
  
  
 if (action.type === "UPDATE_CREDENTIALS"){
   return  action.payload;
 }
 if (action.type === "LOAD_CREDENTIALS"){
   return Object.assign({}, state, {secret: action.payload});
  }
  return state;
}