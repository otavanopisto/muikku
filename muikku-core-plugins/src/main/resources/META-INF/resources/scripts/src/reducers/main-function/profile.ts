import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { UserChatSettingsType } from "~/reducers/user-index";
import {
  CeeposOrder,
  UserStudentAddress,
  UserWithSchoolData,
  WorklistItem,
  WorklistSummary,
  WorklistTemplate,
} from "~/generated/client";

/**
 * PurchaseStateType
 */
/* export enum PurchaseStateType {
  CREATED = "CREATED",
  CANCELLED = "CANCELLED",
  ERRORED = "ERRORED",
  ONGOING = "ONGOING",
  PAID = "PAID",
  COMPLETE = "COMPLETE",
} */

/**
 * PurchaseProductType
 */
/* export interface PurchaseProductType {
  Code: string;
  Description: string;
  Price: number;
} */

/**
 * PurchaseCreatorType
 */
/* export interface PurchaseCreatorType {
  id: number;
  userEntityId: number;
  firstName: string;
  lastName: string;
  email: string;
} */

/**
 * PurchaseType
 */
/* export interface PurchaseType {
  created: string;
  paid: string;
  id: number;
  product: CeeposPurchaseProduct;
  state: PurchaseStateType;
  studentEmail: string;
  studentIdentifier: string;
  creator: PurchaseCreatorType;
} */

/**
 * WorklistSection
 */
export interface WorklistSection {
  summary: WorklistSummary;
  items?: WorklistItem[];
}

/**
 * ProfileProperty
 */
export interface ProfileProperty {
  [key: string]: string;
}

/**
 * ProfileState
 */
export interface ProfileState {
  location: string;
  properties: ProfileProperty;
  username?: string;
  addresses?: UserStudentAddress[];
  student?: UserWithSchoolData;
  chatSettings?: UserChatSettingsType;
  worklistTemplates?: WorklistTemplate[];
  worklist?: Array<WorklistSection>;
  purchases?: CeeposOrder[];
}

/**
 * initialProfileState
 */
const initialProfileState: ProfileState = {
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
export const profile: Reducer<ProfileState> = (
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
