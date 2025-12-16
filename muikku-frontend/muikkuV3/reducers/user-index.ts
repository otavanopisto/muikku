import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { Organization, User, UserGroup, UserWhoAmI } from "~/generated/client";

/**
 * UserChatSettingsType
 */
export interface UserChatSettingsType {
  visibility: "DISABLED" | "VISIBLE_TO_ALL";
  nick?: string;
}

/**
 * ContactRecipientType
 */
export interface ContactRecipientType {
  type: "workspace" | "user" | "usergroup" | "staff";
  value: {
    id: number;
    name: string;
    organization?: Organization;
    email?: string;
    archived?: boolean;
    studiesEnded?: boolean;
    identifier?: string;
    studyProgrammeName?: string;
  };
}

/**
 * UserGroupBaseIndexType
 */
export interface UserGroupBaseIndexType {
  [index: number]: UserGroup;
}

/**
 * UsersBySchoolDataType
 */
export interface UsersBySchoolDataType {
  [index: string]: UserWhoAmI;
}

/**
 * UserFileType
 */
export interface UserFileType {
  id: number;
  userEntityId: number;
  fileName: string;
  contentType: string;
  title: string;
  description: string;
  archived: boolean;
}

/**
 * UserIndexState
 */
export interface UserIndexState {
  groups: UserGroupBaseIndexType;
  usersBySchoolData: UsersBySchoolDataType;
}

/**
 * initialUserIndexState
 */
const initialUserIndexState: UserIndexState = {
  groups: {},
  usersBySchoolData: {},
};

/**
 * Reducer function for userIndex
 *
 * @param state state
 * @param action action
 * @returns State of userIndex
 */
export const userIndex: Reducer<UserIndexState> = (
  state = initialUserIndexState,
  action: ActionType
) => {
  switch (action.type) {
    case "SET_USER_GROUP_INDEX": {
      const prop: { [index: number]: UserGroup } = {};
      prop[action.payload.index] = action.payload.value;
      return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, prop),
      });
    }

    case "SET_USER_BY_SCHOOL_DATA_INDEX": {
      const prop: { [index: string]: User } = {};
      prop[action.payload.index] = action.payload.value;
      return Object.assign({}, state, {
        usersBySchoolData: Object.assign({}, state.usersBySchoolData, prop),
      });
    }

    default:
      return state;
  }
};
