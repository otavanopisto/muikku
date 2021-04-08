import { ActionType } from "~/actions";
import { StudentUserAddressType, UserWithSchoolDataType, UserChatSettingsType } from "~/reducers/user-index";


export interface ProfileType {
  location: string;
  properties: {
    [key: string]: string
  };
  username?: string;
  addresses?: Array<StudentUserAddressType>;
  student?: UserWithSchoolDataType;
  chatSettings?: UserChatSettingsType;
}

export default function profile(state: ProfileType = {
  properties: {},
  username: null,
  addresses: null,
  chatSettings: null,
  location: null,
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
  } else if (action.type === "SET_PROFILE_CHAT_SETTINGS"){
    return {...state, ...{
      chatSettings: action.payload
    }}
  } else if (action.type === "SET_PROFILE_LOCATION") {
    return {...state, ...{
      location: action.payload
    }}
  }
  return state;
}
