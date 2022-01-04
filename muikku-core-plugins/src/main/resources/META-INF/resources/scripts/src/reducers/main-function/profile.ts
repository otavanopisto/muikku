import { ActionType } from "~/actions";
import {
  StudentUserAddressType,
  UserWithSchoolDataType,
  UserChatSettingsType
} from "~/reducers/user-index";

export enum EditableField {
  ENTRYDATE = "ENTRYDATE",
  DESCRIPTION = "DESCRIPTION",
  PRICE = "PRICE",
  FACTOR = "FACTOR",
  BILLING_NUMBER = "BILLING_NUMBER"
}

export enum WorklistBillingState {
  ENTERED = "ENTERED",
  PROPOSED = "PROPOSED",
  APPROVED = "APPROVED",
  PAID = "PAID"
}

export interface WorklistTemplate {
  id: number;
  description: string;
  price: number;
  factor: number;
  billingNumber: number;
  editableFields: Array<EditableField>;
}

export interface WorklistItem {
  templateId: number;
  entryDate: string;
  description: string;
  price: number;
  factor: number;
  billingNumber: number;
}

export interface StoredWorklistItem extends WorklistItem {
  id: number;
  editableFields: Array<EditableField>;
  state: WorklistBillingState;
  removable: boolean;
}

export interface WorklistItemsSummary {
  displayName: string;
  beginDate: string;
  endDate: string;
  count: number;
}

export interface WorklistSection {
  summary: WorklistItemsSummary;
  items?: Array<StoredWorklistItem>;
}

export interface ProfileType {
  location: string;
  properties: {
    [key: string]: string;
  };
  username?: string;
  addresses?: Array<StudentUserAddressType>;
  student?: UserWithSchoolDataType;
  chatSettings?: UserChatSettingsType;
  worklistTemplates?: Array<WorklistTemplate>;
  worklist?: Array<WorklistSection>;
}

export default function profile(
  state: ProfileType = {
    properties: {},
    username: null,
    addresses: null,
    chatSettings: null,
    location: null,
    worklistTemplates: null,
    worklist: null
  },
  action: ActionType
): ProfileType {
  if (action.type === "SET_PROFILE_USER_PROPERTY") {
    let newProperties = { ...state.properties };
    newProperties[action.payload.key] = action.payload.value;
    return {
      ...state,
      ...{
        properties: newProperties
      }
    };
  } else if (action.type === "SET_PROFILE_USERNAME") {
    return {
      ...state,
      ...{
        username: action.payload
      }
    };
  } else if (action.type === "SET_PROFILE_ADDRESSES") {
    return {
      ...state,
      ...{
        addresses: action.payload
      }
    };
  } else if (action.type === "SET_PROFILE_STUDENT") {
    return {
      ...state,
      ...{
        student: action.payload
      }
    };
  } else if (action.type === "SET_PROFILE_CHAT_SETTINGS") {
    return {
      ...state,
      ...{
        chatSettings: action.payload
      }
    };
  } else if (action.type === "SET_PROFILE_LOCATION") {
    return {
      ...state,
      ...{
        location: action.payload
      }
    };
  } else if (action.type === "SET_WORKLIST_TEMPLATES") {
    return {
      ...state,
      ...{
        worklistTemplates: action.payload
      }
    };
  } else if (action.type === "SET_WORKLIST") {
    return {
      ...state,
      ...{
        worklist: action.payload
      }
    };
  }
  return state;
}
