import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState } from "~/@types/shared";
import { Guardian, GuidanceCounselorContact } from "~/generated/client";

export type ContactState = "WAITING" | "LOADING" | "READY" | "ERROR";

/**
 * ContactGroup
 */
export interface ContactGroup<T> {
  state: LoadingState;
  list: T[];
}

/**
 * CredentialsState
 */
export interface ContactsState {
  counselors: ContactGroup<GuidanceCounselorContact>;
  guardians: ContactGroup<Guardian>;
}

export type ContactGroupNames = keyof ContactsState;

/**
 * initialContactsState
 */
const initialContactsState: ContactsState = {
  counselors: {
    state: "WAITING",
    list: [],
  },
  guardians: {
    state: "WAITING",
    list: [],
  },
};

/**
 * ContactsState reducer function
 *
 * @param state state
 * @param action action
 * @returns State of credentials
 */
export const contacts: Reducer<ContactsState> = (
  state = initialContactsState,
  action: ActionType
) => {
  switch (action.type) {
    case "CONTACT_LOAD_GROUP": {
      const groupName = action.payload.groupName;

      return { ...state, [groupName]: { ...action.payload.data } };
    }

    case "CONTACT_UPDATE_GROUP_STATE": {
      const groupName = action.payload.groupName;
      const group = state[groupName];
      // const newGroup = JSON.parse(JSON.stringify(currentGroup)) as ContactGroup;

      group.state = action.payload.state;

      return { ...state, [groupName]: { ...group } };
    }
    case "CONTACT_UPDATE_GUARDIAN": {
      const updatedGuardian = action.payload;
      const updatedGuardianList = [...state.guardians.list];
      const updateGuardianIndex = updatedGuardianList.findIndex(
        (guardian) => guardian.identifier === updatedGuardian.identifier
      );
      if (updateGuardianIndex === -1) {
        return state;
      }
      updatedGuardianList[updateGuardianIndex] = updatedGuardian;

      return {
        ...state,
        guardians: { ...state.guardians, list: updatedGuardianList },
      };
    }
    default:
      return state;
  }
};
