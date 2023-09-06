import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { UserSearchResult, User, UserGroup } from "~/generated/client";

export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type StudyprogrammeTypeStatusType =
  | "WAIT"
  | "LOADING"
  | "READY"
  | "ERROR";

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
/* export interface PagingEnvironmentUserListType extends PagingUserListType {
  results: User[];
} */

/**
 * UserGroupListType
 */
export interface UserGroupListType {
  list: UserGroup[];
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
export interface UserSearchResultWithExtraProperties extends UserSearchResult {
  searchString?: string;
}

/**
 * CurrentUserGroupType
 */
export interface CurrentUserGroupType {
  id: number | null;
  students: UserSearchResult;
  staff: UserSearchResult;
}

export type CurrentUserGroupUpdateType = Partial<CurrentUserGroupType>;

/**
 * UsersSelectState
 */
export interface UsersSelectState {
  students: User[];
  staff: User[];
  userGroups: UserGroup[];
}

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface UsersState {
  students?: UserSearchResultWithExtraProperties;
  staff?: UserSearchResultWithExtraProperties;
}

/**
 * UserGroupsState
 */
export interface UserGroupsState {
  list: UserGroup[];
  currentUserGroup?: CurrentUserGroupType;
  state: UserGroupsStateType;
  hasMore: boolean;
  searchString: string;
  currentPayload: UserPayloadType;
}

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
 * initializeUsersState
 */
const initializeUsersState: UsersState = {
  students: {
    firstResult: null,
    results: [],
    totalHitCount: null,
  },
  staff: {
    firstResult: null,
    results: [],
    totalHitCount: null,
  },
};

/**
 * Reducer function for users
 *
 * @param state state
 * @param action action
 * @returns State of users
 */
export const organizationUsers: Reducer<UsersState> = (
  state = initializeUsersState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_STUDENT_USERS":
      return {
        ...state,
        students: action.payload,
      };

    case "UPDATE_STAFF_USERS":
      return {
        ...state,
        staff: action.payload,
      };

    default:
      return state;
  }
};

/**
 * users
 * @param state state
 * @param action action
 */
/* export default function users(
  state: UsersState = {
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
): UsersState {
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
 */
/**
 * initialUserGroupsState
 */
const initialUserGroupsState: UserGroupsState = {
  list: [],
  currentUserGroup: null,
  state: "LOADING",
  hasMore: false,
  searchString: "",
  currentPayload: null,
};

/**
 * Reducer function for user groups
 *
 * @param state state
 * @param action action
 * @returns State of user groups
 */
export const userGroups: Reducer<UserGroupsState> = (
  state = initialUserGroupsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_USER_GROUPS":
      return {
        ...state,
        list: action.payload,
      };

    case "LOAD_MORE_USER_GROUPS":
      return {
        ...state,
        list: state.list.concat(action.payload),
      };

    case "UPDATE_CURRENT_USER_GROUP":
      return {
        ...state,
        currentUserGroup: action.payload,
      };

    case "UPDATE_USER_GROUPS_STATE":
      return {
        ...state,
        state: action.payload,
      };

    case "UPDATE_HAS_MORE_USERGROUPS":
      return {
        ...state,
        hasMore: action.payload,
      };

    case "SET_CURRENT_PAYLOAD":
      return {
        ...state,
        currentPayload: action.payload,
      };

    default:
      return state;
  }
};

/**
 * userGroups
 * @param state state
 * @param action action
 */
/* export function userGroups(
  state: UserGroupsState = {
    list: [],
    currentUserGroup: null,
    state: "LOADING",
    hasMore: false,
    searchString: "",
    currentPayload: null,
  },
  action: ActionType
): UserGroupsState {
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
} */

/**
 * initialUserSelectState
 */
const initialUserSelectState: UsersSelectState = {
  students: [],
  staff: [],
  userGroups: [],
};

/**
 * Reducer function for user Select
 *
 * @param state state
 * @param action action
 * @returns State of user Select
 */
export const userSelect: Reducer<UsersSelectState> = (
  state = initialUserSelectState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_STUDENT_SELECTOR":
      return {
        ...state,
        students: action.payload,
      };

    case "UPDATE_STAFF_SELECTOR":
      return {
        ...state,
        staff: action.payload,
      };

    case "UPDATE_GROUP_SELECTOR":
      return {
        ...state,
        userGroups: action.payload,
      };

    case "CLEAR_USER_SELECTOR":
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};

/**
 * userSelect
 * @param state state
 * @param action action
 */
/* export function userSelect(
  state: UsersSelectState = {
    students: [],
    staff: [],
    userGroups: [],
  },
  action: ActionType
): UsersSelectState {
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
} */

/**
 * initialStudyProgrammesState
 */
const initialStudyProgrammesState: StudyprogrammeTypes = {
  list: [],
  status: "WAIT",
};

/**
 * Reducer function for study programmes
 *
 * @param state state
 * @param action action
 * @returns State of evaluation
 */
export const studyprogrammes: Reducer<StudyprogrammeTypes> = (
  state = initialStudyProgrammesState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_STUDYPROGRAMME_TYPES":
      return {
        ...state,
        list: action.payload,
      };

    case "UPDATE_STUDYPROGRAMME_STATUS_TYPE":
      return {
        ...state,
        status: action.payload,
      };

    default:
      return state;
  }
};

// These are here, because they are needed in the creation of a new user.
// Not sure if they should actually be here, but changing their location is easy
// At the time of writing, it's only used when creating a user in the organization

/**
 * studyprogrammes
 * @param state state
 * @param action action
 */
/* export function studyprogrammes(
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
} */
