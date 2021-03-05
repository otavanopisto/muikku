import { ActionType } from "~/actions";
import students from "~/components/guider/body/application/students";
import { UserWithSchoolDataType, UserGroupType, UserType } from '~/reducers/user-index';
export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type StudyprogrammeTypeStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type UsersListType = Array<UserType>;
export type StudyprogrammeListType = Array<StudyprogrammeType>;

export interface OrganizationUsersListType {
  firstResult: number,
  lastResult: number,
  results: UsersListType,
  totalHitCount: number,
}

export interface UserGroupListType {
  list: UserGroupType[],
}

export interface StudyprogrammeTypes {
  list: StudyprogrammeListType,
  status: StudyprogrammeTypeStatusType
}

export interface StudyprogrammeType {
  identifier: string,
  name: string
}

export interface UserPanelUsersType {
  results: UsersListType,
  totalHitCount: number,
  searchString?: string
}

export interface UsersType {
  students?: UserPanelUsersType,
  staff?: UserPanelUsersType,
}


export interface UsersSelectType {
  students: UsersListType,
  staff: UsersListType,
  usergroups: Array<UserGroupType>,
}

export interface CurrentUserGroupType {
  id: number | null,
  students: OrganizationUsersListType,
  staff: OrganizationUsersListType,
}

export interface UserGroupsType {
  list: UserGroupType[],
  currentUserGroup?: CurrentUserGroupType,
}

export type CurrentUserGroupUpdateType = Partial<CurrentUserGroupType>

export interface CreateUserGroupType {
  name: string,
  isGuidanceGroup: boolean,
}

export interface UpdateUserGroupType extends CreateUserGroupType {
  identifier: string,
}

export interface ModifyUserGroupUsersType {
  groupIdentifier?: string,
  userIdentifiers: string[],
}

export type UpdateUserGroupStateType = "update-group" | "add-users" | "remove-users" | "done";

// Do not delete, this is for organization

export default function users(state: UsersType = {
  students: {
    results: [],
    totalHitCount: null
  },
  staff: {
    results: [],
    totalHitCount: null
  },
}, action: ActionType): UsersType {
  if (action.type === "UPDATE_STUDENT_USERS") {
    return Object.assign({}, state, {
      students: action.payload
    });
  } else if (action.type === "UPDATE_STAFF_USERS") {
    return Object.assign({}, state, {
      staff: action.payload
    });
  }
  return state;
}

export function userGroups(state: UserGroupsType = {
    list: [],
    currentUserGroup: null,
  }, action: ActionType): UserGroupsType {
  if (action.type === "UPDATE_USER_GROUPS") {
    return Object.assign({}, state, {
      list: action.payload
    });
  } else if (action.type === "UPDATE_CURRENT_USER_GROUP") {
    return Object.assign({}, state, {
      currentUserGroup: action.payload
    });
  }
  return state;
}


export function userSelect(state: UsersSelectType = {
  students: [],
  staff: [],
  usergroups: [],
}, action: ActionType): UsersSelectType {
  if (action.type === "UPDATE_STUDENT_SELECTOR") {
    return Object.assign({}, state, {
      students: action.payload
    });
  } else if (action.type === "UPDATE_STAFF_SELECTOR") {
    return Object.assign({}, state, {
      staff: action.payload
    });
  } else if (action.type === "UPDATE_GROUP_SELECTOR") {
    return Object.assign({}, state, {
      userGroups: action.payload
    });
  } else if (action.type === "CLEAR_USER_SELECTOR") {
    return Object.assign({}, state,
      action.payload
    );
  }

  return state;
}

// These are here, because they are needed in the creation of a new user.
// Not sure if they should actually be here, but changing their location is easy
// At the time of writing, it's only used when creating a user in the organization

export function studyprogrammes(state: StudyprogrammeTypes = {
  list: [],
  status: "WAIT"
}, action: ActionType): StudyprogrammeTypes {
  if (action.type === "UPDATE_STUDYPROGRAMME_TYPES") {
    return Object.assign({}, state, {
      list: action.payload
    });
  }
  if (action.type === "UPDATE_STUDYPROGRAMME_STATUS_TYPE") {
    return Object.assign({}, state, {
      status: action.payload
    });
  }
  return state;
}
