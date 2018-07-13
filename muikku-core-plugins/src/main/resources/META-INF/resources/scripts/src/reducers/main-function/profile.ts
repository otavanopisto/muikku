import { ActionType } from "~/actions";
import { StudentUserAddressType } from "~/reducers/main-function/user-index";

export interface ProfileType {
  properties: {
    [key: string]: string
  },
  username?: string,
  address?: StudentUserAddressType
}

export default function profile(state: ProfileType = {
  properties: {},
  username: null,
  address: null
}, action: ActionType): ProfileType {
  if (action.type === "SET_PROFILE_USER_PROPERTY"){
    let newProperties = {...state.properties}
    newProperties[action.payload.key] = action.payload.value;
    return {...state, ...{
      properties: newProperties
    }}
  } else if (action.type === "SET_PROFILE_USERNAME"){
    return {...state, ...{
      username: action.payload
    }}
  } else if (action.type === "SET_PROFILE_ADDRESS"){
    return {...state, ...{
      address: action.payload
    }}
  }
  return state;
}