import { ActionType } from "~/actions";
import { StudentUserAddressType, UserWithSchoolDataType } from "~/reducers/main-function/user-index";

export interface ProfileType {
  properties: {
    [key: string]: string
  },
  username?: string,
  addresses?: Array<StudentUserAddressType>,
  student?: UserWithSchoolDataType,
  chatVisibility?: string,
  chatNickname?: string
}

export default function profile(state: ProfileType = {
  properties: {},
  username: null,
  addresses: null,
  chatVisibility: null,
  chatNickname: null,
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
  } else if (action.type === "SET_PROFILE_ADDRESSES"){
    return {...state, ...{
      addresses: action.payload
    }}
  } else if (action.type === "SET_PROFILE_STUDENT"){
    return {...state, ...{
      student: action.payload
    }}
  } else if (action.type === "SET_PROFILE_CHAT_VISIBILITY"){
    return {...state, ...{
      chatVisibility: action.payload
    }}
  } else if (action.type === "SET_PROFILE_CHAT_NICKNAME"){
    return {...state, ...{
      chatNickname: action.payload
    }}
  }
  return state;
}