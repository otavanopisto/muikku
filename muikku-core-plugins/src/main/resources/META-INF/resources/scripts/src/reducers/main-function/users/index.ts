import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  UserGroup,
  StudyProgramme,
  OrganizationStaffMemberSearchResult,
  OrganizationStudentSearchResult,
  Student,
  StaffMember,
} from "~/generated/client";

export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type StudyprogrammeStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

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
 * UserGroupListType
 */
export interface UserGroupListType {
  list: UserGroup[];
}

/**
 * StudyprogrammeTypes
 */
export interface StudyprogrammeTypes {
  list: StudyProgramme[];
  status: StudyprogrammeStatusType;
}

/**
 * StudyprogrammeType
 */
export interface StudyprogrammeType {
  identifier: string;
  name: string;
}

/**
 * UserStudentSearchResultWithExtraProperties
 */
export interface UserStudentSearchResultWithExtraProperties
  extends OrganizationStudentSearchResult {
  searchString?: string;
}

/**
 * UserStaffSearchResultWithExtraProperties
 */
export interface UserStaffSearchResultWithExtraProperties
  extends OrganizationStaffMemberSearchResult {
  searchString?: string;
}

/**
 * CurrentUserGroupType
 */
export interface CurrentUserGroupType {
  id: number | null;
  students: OrganizationStudentSearchResult;
  staff: OrganizationStaffMemberSearchResult;
}

export type CurrentUserGroupUpdateType = Partial<CurrentUserGroupType>;

/**
 * UsersSelectState
 */
export interface UsersSelectState {
  students: Student[];
  staff: StaffMember[];
  userGroups: UserGroup[];
}

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface UsersState {
  students?: UserStudentSearchResultWithExtraProperties;
  staff?: UserStaffSearchResultWithExtraProperties;
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
export const organizationUsers: Reducer<UsersState, ActionType> = (
  state = initializeUsersState,
  action
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
export const userGroups: Reducer<UserGroupsState, ActionType> = (
  state = initialUserGroupsState,
  action
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
export const userSelect: Reducer<UsersSelectState, ActionType> = (
  state = initialUserSelectState,
  action
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
export const studyprogrammes: Reducer<StudyprogrammeTypes, ActionType> = (
  state = initialStudyProgrammesState,
  action
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
