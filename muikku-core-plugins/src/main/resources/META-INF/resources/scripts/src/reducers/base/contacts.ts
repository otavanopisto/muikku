import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState } from "~/@types/shared";
export type ContactState = "WAITING" | "LOADING" | "READY" | "ERROR";

/**
 * ContactGroup
 */
export interface ContactGroup {
  state: LoadingState;
  list: Contact[];
}

/**
 * Contact
 */
export interface Contact {
  email: string;
  chatAvailable: boolean;
  firstName: string;
  hasImage: true;
  id: string;
  lastName: string;
  organization: { id: number; name: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  role: string;
  userEntityId: number;
}

/**
 * CredentialsType
 */
export interface Contacts {
  counselors: ContactGroup;
}

export type ContactGroupNames = keyof Contacts;

/**
 * initialContactsState
 */
const initialContactsState: Contacts = {
  counselors: {
    state: "WAITING",
    list: [],
  },
};

/**
 * Contacts reducer function
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
    case "CONTACT_LOAD_GROUP": {
      const groupName: ContactGroupNames = action.payload.groupName;

      return { ...state, [groupName]: { ...action.payload.data } };
    }

    case "CONTACT_UPDATE_GROUP_STATE": {
      const groupName: ContactGroupNames = action.payload.groupName;
      const group = state[groupName];
      // const newGroup = JSON.parse(JSON.stringify(currentGroup)) as ContactGroup;

      group.state = action.payload.state;

      return { ...state, [groupName]: { ...group } };
    }

    default:
      return state;
  }
};
