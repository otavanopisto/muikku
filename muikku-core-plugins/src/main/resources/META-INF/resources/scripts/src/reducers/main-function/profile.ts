import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  StudentUserAddressType,
  UserWithSchoolDataType,
  UserChatSettingsType,
} from "~/reducers/user-index";

export enum EditableField {
  ENTRYDATE = "ENTRYDATE",
  DESCRIPTION = "DESCRIPTION",
  PRICE = "PRICE",
  FACTOR = "FACTOR",
  BILLING_NUMBER = "BILLING_NUMBER",
}

export enum WorklistBillingState {
  ENTERED = "ENTERED",
  PROPOSED = "PROPOSED",
  APPROVED = "APPROVED",
  PAID = "PAID",
}

/**
 * WorklistTemplate
 */
export interface WorklistTemplate {
  id: number;
  description: string;
  price: number;
  factor: number;
  billingNumber: number;
  editableFields: Array<EditableField>;
}

/**
 * WorklistItem
 */
export interface WorklistItem {
  templateId: number;
  entryDate: string;
  description: string;
  price: number;
  factor: number;
  billingNumber: number;
}

/**
 * PurchaseStateType
 */
export enum PurchaseStateType {
  CREATED = "CREATED",
  CANCELLED = "CANCELLED",
  ERRORED = "ERRORED",
  ONGOING = "ONGOING",
  PAID = "PAID",
  COMPLETE = "COMPLETE",
}

/**
 * PurchaseProductType
 */
export interface PurchaseProductType {
  Code: string;
  Description: string;
  Price: number;
}

/**
 * PurchaseCreatorType
 */
export interface PurchaseCreatorType {
  id: number;
  userEntityId: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * PurchaseType
 */
export interface PurchaseType {
  created: string;
  paid: string;
  id: number;
  product: PurchaseProductType;
  state: PurchaseStateType;
  studentEmail: string;
  studentIdentifier: string;
  creator: PurchaseCreatorType;
}

/**
 * StoredWorklistItem
 */
export interface StoredWorklistItem extends WorklistItem {
  id: number;
  editableFields: Array<EditableField>;
  state: WorklistBillingState;
  removable: boolean;
}

/**
 * WorklistItemsSummary
 */
export interface WorklistItemsSummary {
  displayName: string;
  beginDate: string;
  endDate: string;
  count: number;
}

/**
 * WorklistSection
 */
export interface WorklistSection {
  summary: WorklistItemsSummary;
  items?: Array<StoredWorklistItem>;
}

/**
 * ProfileType
 */
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
  purchases?: PurchaseType[];
}

/**
 * initialProfileState
 */
const initialProfileState: ProfileType = {
  properties: {},
  username: null,
  addresses: null,
  chatSettings: null,
  location: null,
  worklistTemplates: null,
  worklist: null,
  purchases: null,
};

/**
 * Reducer function for profileReducer
 *
 * @param state state
 * @param action action
 * @returns State of profileReducer
 */
export const profile: Reducer<ProfileType> = (
  state = initialProfileState,
  action: ActionType
) => {
  switch (action.type) {
    case "SET_PROFILE_USER_PROPERTY": {
      const newProperties = { ...state.properties };
      newProperties[action.payload.key] = action.payload.value;

      return { ...state, properties: newProperties };
    }

    case "SET_PROFILE_USERNAME":
      return { ...state, username: action.payload };

    case "SET_PROFILE_ADDRESSES":
      return { ...state, addresses: action.payload };

    case "SET_PROFILE_STUDENT":
      return { ...state, student: action.payload };

    case "SET_PROFILE_CHAT_SETTINGS":
      return { ...state, chatSettings: action.payload };

    case "SET_PROFILE_LOCATION":
      return { ...state, location: action.payload };

    case "SET_WORKLIST_TEMPLATES":
      return { ...state, worklistTemplates: action.payload };

    case "SET_WORKLIST":
      return { ...state, worklist: action.payload };

    case "SET_PURCHASE_HISTORY":
      return { ...state, purchases: action.payload };

    default:
      return state;
  }
};

/**
 * profile
 * @param state state
 * @param action action
 */
/* export default function profile(
  state: ProfileType = {
    properties: {},
    username: null,
    addresses: null,
    chatSettings: null,
    location: null,
    worklistTemplates: null,
    worklist: null,
    purchases: null,
  },
  action: ActionType
): ProfileType {
  if (action.type === "SET_PROFILE_USER_PROPERTY") {
    const newProperties = { ...state.properties };
    newProperties[action.payload.key] = action.payload.value;
    return {
      ...state,
      ...{
        properties: newProperties,
      },
    };
  } else if (action.type === "SET_PROFILE_USERNAME") {
    return {
      ...state,
      ...{
        username: action.payload,
      },
    };
  } else if (action.type === "SET_PROFILE_ADDRESSES") {
    return {
      ...state,
      ...{
        addresses: action.payload,
      },
    };
  } else if (action.type === "SET_PROFILE_STUDENT") {
    return {
      ...state,
      ...{
        student: action.payload,
      },
    };
  } else if (action.type === "SET_PROFILE_CHAT_SETTINGS") {
    return {
      ...state,
      ...{
        chatSettings: action.payload,
      },
    };
  } else if (action.type === "SET_PROFILE_LOCATION") {
    return {
      ...state,
      ...{
        location: action.payload,
      },
    };
  } else if (action.type === "SET_WORKLIST_TEMPLATES") {
    return {
      ...state,
      ...{
        worklistTemplates: action.payload,
      },
    };
  } else if (action.type === "SET_WORKLIST") {
    return {
      ...state,
      ...{
        worklist: action.payload,
      },
    };
  } else if (action.type === "SET_PURCHASE_HISTORY") {
    return {
      ...state,
      ...{
        purchases: action.payload,
      },
    };
  }
  return state;
}
 */
