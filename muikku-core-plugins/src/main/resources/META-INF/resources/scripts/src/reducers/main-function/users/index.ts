import { ActionType } from "~/actions";
import { UserGroupType, UserType } from "~/reducers/user-index";
export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type StudyprogrammeTypeStatusType =
  | "WAIT"
  | "LOADING"
  | "READY"
  | "ERROR";
export type UsersListType = Array<UserType>;
export type StudyprogrammeListType = Array<StudyprogrammeType>;

export type UserGroupsStateType =
  | "LOADING"
  | "LOADING_MORE"
  | "ERROR"
  | "READY";

/**
 * UserPayloadType
 */
export interface UserPayloadType {
  q: string | null;
  firstResult?: number | null;
  maxResults?: number | null;
  userGroupIds?: number[];
}

/**
 * UsergroupPayloadType
 */
export interface UsergroupPayloadType extends UserPayloadType {
  userIdentifier?: string;
  archetype?: string;
}

/**
 * PagingUserListType
 */
export interface PagingUserListType {
  firstResult: number;
  maxResults: number;
  totalHitCount: number;
}

/**
 * PagingEnvironmentUserListType
 */
export interface PagingEnvironmentUserListType extends PagingUserListType {
  results: UsersListType;
}

/**
 * UserGroupListType
 */
export interface UserGroupListType {
  list: UserGroupType[];
}

/**
 * StudyprogrammeTypes
 */
export interface StudyprogrammeTypes {
  list: StudyprogrammeListType;
  status: StudyprogrammeTypeStatusType;
}

/**
 * StudyprogrammeType
 */
export interface StudyprogrammeType {
  identifier: string;
  name: string;
}

/**
 * UserPanelUsersType
 */
export interface UserPanelUsersType {
  results: UsersListType;
  totalHitCount: number;
  searchString?: string;
}

/**
 * UsersType
 */
export interface UsersType {
  students?: UserPanelUsersType;
  staff?: UserPanelUsersType;
}

/**
 * UsersSelectType
 */
export interface UsersSelectType {
  students: UsersListType;
  staff: UsersListType;
  userGroups: Array<UserGroupType>;
}

/**
 * CurrentUserGroupType
 */
export interface CurrentUserGroupType {
  id: number | null;
  students: PagingEnvironmentUserListType;
  staff: PagingEnvironmentUserListType;
}

/**
 * UserGroupsType
 */
export interface UserGroupsType {
  list: UserGroupType[];
  currentUserGroup?: CurrentUserGroupType;
  state: UserGroupsStateType;
  hasMore: boolean;
  searchString: string;
  currentPayload: UserPayloadType;
}

export type CurrentUserGroupUpdateType = Partial<CurrentUserGroupType>;

/**
 * CreateUserGroupType
 */
export interface CreateUserGroupType {
  name: string;
  isGuidanceGroup: boolean;
}

/**
 * UpdateUserGroupType
 */
export interface UpdateUserGroupType extends CreateUserGroupType {
  identifier: string;
}

/**
 * ModifyUserGroupUsersType
 */
export interface ModifyUserGroupUsersType {
  groupIdentifier?: string;
  userIdentifiers: string[];
}

export type UpdateUserGroupStateType =
  | "update-group"
  | "add-users"
  | "remove-users"
  | "done";

// Do not delete, this is for organization

/**
 * users
 * @param state state
 * @param action action
 */
export default function users(
  state: UsersType = {
    students: {
      results: [],
      totalHitCount: null,
    },
    staff: {
      results: [],
      totalHitCount: null,
    },
  },
  action: ActionType
): UsersType {
  if (action.type === "UPDATE_STUDENT_USERS") {
    return Object.assign({}, state, {
      students: action.payload,
    });
  } else if (action.type === "UPDATE_STAFF_USERS") {
    return Object.assign({}, state, {
      staff: action.payload,
    });
  }
  return state;
}

/**
 * userGroups
 * @param state state
 * @param action action
 */
export function userGroups(
  state: UserGroupsType = {
    list: [],
    currentUserGroup: null,
    state: "LOADING",
    hasMore: false,
    searchString: "",
    currentPayload: null,
  },
  action: ActionType
): UserGroupsType {
  if (action.type === "UPDATE_USER_GROUPS") {
    return Object.assign({}, state, {
      list: action.payload,
    });
  } else if (action.type === "LOAD_MORE_USER_GROUPS") {
    return Object.assign({}, state, {
      list: state.list.concat(action.payload),
    });
  } else if (action.type === "UPDATE_CURRENT_USER_GROUP") {
    return Object.assign({}, state, {
      currentUserGroup: action.payload,
    });
  } else if (action.type === "UPDATE_USER_GROUPS_STATE") {
    return Object.assign({}, state, {
      state: action.payload,
    });
  } else if (action.type === "UPDATE_HAS_MORE_USERGROUPS") {
    return Object.assign({}, state, {
      hasMore: action.payload,
    });
  } else if (action.type === "SET_CURRENT_PAYLOAD") {
    return Object.assign({}, state, {
      currentPayload: action.payload,
    });
  }
  return state;
}

/**
 * userSelect
 * @param state state
 * @param action action
 */
export function userSelect(
  state: UsersSelectType = {
    students: [],
    staff: [],
    userGroups: [],
  },
  action: ActionType
): UsersSelectType {
  if (action.type === "UPDATE_STUDENT_SELECTOR") {
    return Object.assign({}, state, {
      students: action.payload,
    });
  } else if (action.type === "UPDATE_STAFF_SELECTOR") {
    return Object.assign({}, state, {
      staff: action.payload,
    });
  } else if (action.type === "UPDATE_GROUP_SELECTOR") {
    return Object.assign({}, state, {
      userGroups: action.payload,
    });
  } else if (action.type === "CLEAR_USER_SELECTOR") {
    return Object.assign({}, state, action.payload);
  }

  return state;
}

// These are here, because they are needed in the creation of a new user.
// Not sure if they should actually be here, but changing their location is easy
// At the time of writing, it's only used when creating a user in the organization

/**
 * studyprogrammes
 * @param state state
 * @param action action
 */
export function studyprogrammes(
  state: StudyprogrammeTypes = {
    list: [],
    status: "WAIT",
  },
  action: ActionType
): StudyprogrammeTypes {
  if (action.type === "UPDATE_STUDYPROGRAMME_TYPES") {
    return Object.assign({}, state, {
      list: action.payload,
    });
  }
  if (action.type === "UPDATE_STUDYPROGRAMME_STATUS_TYPE") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  }
  return state;
}
