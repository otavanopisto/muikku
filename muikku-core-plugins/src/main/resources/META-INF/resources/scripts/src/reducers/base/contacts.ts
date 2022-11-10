import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState } from "~/@types/shared";
export type ContactState = "WAITING" | "LOADING" | "READY" | "ERROR";

/**
 *
 */
export interface ContactGroup {
  state: LoadingState;
  list: string[];
}

/**
 * CredentialsType
 */
export interface Contacts {
  guiders: ContactGroup;
}

export type ContactGroupNames = keyof Contacts;

/**
 * initialCredentialsState
 */

const initialContactsState: Contacts = {
  guiders: {
    state: "WAITING",
    list: [],
  },
};

/**
 * Reducer function for credentials
 *
 * @param state state
 * @param action action
 * @returns State of credentials
 */
export const contacts: Reducer<Contacts> = (
  state = initialContactsState,
  action: ActionType
) => {
  switch (action.type) {
    case "LOAD_CONTACT_GROUP": {
      const groupName: ContactGroupNames = action.payload.groupName;

      return { ...state, [groupName]: { ...action.payload.data } };
    }

    case "UPDATE_CONTACT_GROUP_STATE": {
      const groupName: ContactGroupNames = action.payload.groupName;
      const currentGroup = state[groupName];
      const newGroup = JSON.parse(JSON.stringify(currentGroup)) as ContactGroup;

      newGroup.state = action.payload.state;

      return { ...state, [groupName]:{...newGroup} };
    }

    default:
      return state;
  }
};
