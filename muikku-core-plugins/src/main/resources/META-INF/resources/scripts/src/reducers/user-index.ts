import { ActionType } from "~/actions";
import { PagingUserListType } from "~/reducers/main-function/users";
import { Reducer } from "redux";
export type ManipulateType = "UPDATE" | "CREATE";

/**
 * CreateUserType
 */
export interface CreateUserType {
  firstName: string;
  lastName: string;
  email: string;
  studyProgrammeIdentifier?: string;
  role?: string;
  ssn?: string;
}

/**
 * UpdateUserType
 */
export interface UpdateUserType {
  identifier: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  studyProgrammeIdentifier?: string;
  ssn?: string;
}

/**
 * UserType
 */
export interface UserType {
  // Ok, but coming from backend, "id" is not a number, but a string. This might cause trouble in the future?
  id: number;
  firstName: string;
  lastName?: string;
  nickName?: string;
  studyProgrammeName?: string;
  hasImage?: boolean;
  hasEvaluationFees?: false;
  curriculumIdentifier?: string;
  studyProgrammeIdentifier?: string;
  organizationIdentifier?: string;
  isDefaultOrganization?: boolean;
  permissions?: Array<string>;
  roles?: Array<string>;

  //EXTENDED VALUES, may or may not be available
  role?: string;
  ssn?: string;
  email?: string;
  language?: string;
  municipality?: string;
  nationality?: string;
  school?: string;
  studyStartDate?: string;
  studyTimeEnd?: string;
  userEntityId?: number;
  lastLogin?: string;
  archived?: boolean;
  studiesEnded?: boolean;
}

/**
 * UserWithSchoolDataType
 */
export interface UserWithSchoolDataType {
  curriculumIdentifier?: string;
  email: string;
  firstName: string;
  hasImage: boolean;
  id: string;
  language?: string;
  lastName?: string;
  municipality?: string;
  nationality?: string;
  nickName?: string;
  school?: string;
  studyEndDate?: string;
  studyProgrammeName?: string;
  studyStartDate?: string;
  studyTimeEnd?: string;
  lastLogin?: string;
  updatedByStudent: boolean;
  userEntityId: number;
}

/**
 * UserChatSettingsType
 */
export interface UserChatSettingsType {
  visibility: "DISABLED" | "VISIBLE_TO_ALL";
  nick?: string;
}

/**
 * OrganizationType
 */
export interface OrganizationType {
  id: number;
  name: string;
}

/**
 * UserStaffType
 */
export interface UserStaffType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  userEntityId: number;
  hasImage: boolean;
}

/**
 * WorkspaceStudentListType
 */
export interface WorkspaceStudentListType extends PagingUserListType {
  results: Array<ShortWorkspaceUserWithActiveStatusType>;
}

/**
 * WorkspaceStaffListType
 */
export interface WorkspaceStaffListType extends PagingUserListType {
  results: Array<UserStaffType>;
}

/**
 * ShortWorkspaceUserWithActiveStatusType
 */
export interface ShortWorkspaceUserWithActiveStatusType {
  workspaceUserEntityId: number;
  userIdentifier: string;
  userEntityId: number;
  firstName: string;
  nickName?: string;
  lastName: string;
  studyProgrammeName: string;
  active: boolean;
  hasImage: boolean;
}

/**
 * UserGroupType
 */
export interface UserGroupType {
  id: number;
  identifier?: string;
  name: string;
  userCount: number;
  organization?: OrganizationType;
  isGuidanceGroup?: boolean;
}

/**
 * UserBaseIndexType
 */
export interface UserBaseIndexType {
  [index: number]: UserType;
}

/**
 * ContactRecipientType
 */
export interface ContactRecipientType {
  type: "workspace" | "user" | "usergroup" | "staff";
  value: {
    id: number;
    name: string;
    organization?: OrganizationType;
    email?: string;
    archived?: boolean;
    studiesEnded?: boolean;
    identifier?: string;
  };
}

/**
 * UserGroupBaseIndexType
 */
export interface UserGroupBaseIndexType {
  [index: number]: UserGroupType;
}

/**
 * UsersBySchoolDataType
 */
export interface UsersBySchoolDataType {
  [index: string]: UserType;
}

/**
 * UserIndexType
 */
export interface UserIndexType {
  users: UserBaseIndexType;
  groups: UserGroupBaseIndexType;
  usersBySchoolData: UsersBySchoolDataType;
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
 * StudentUserProfileEmailType
 */
export interface StudentUserProfileEmailType {
  studentIdentifier: string;
  type: string;
  address: string;
  defaultAddress: boolean;
}

/**
 * StudentUserProfilePhoneType
 */
export interface StudentUserProfilePhoneType {
  studentIdentifier: string;
  type: string;
  number: string;
  defaultNumber: boolean;
}

/**
 * StudentUserAddressType
 */
export interface StudentUserAddressType {
  identifier: string;
  studentIdentifier: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  type: string;
  defaultAddress: boolean;
}

/**
 * StudentUserProfileChatType
 */
export interface StudentUserProfileChatType {
  userIdentifier: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visibility: any;
}

/**
 * LastLoginStudentDataType
 */
export interface LastLoginStudentDataType {
  userIdentifier: string;
  authenticationProvder: string;
  address: string;
  time: string;
}

/**
 * initialUserIndexState
 */
const initialUserIndexState: UserIndexType = {
  users: {},
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
export const userIndex: Reducer<UserIndexType> = (
  state = initialUserIndexState,
  action: ActionType
) => {
  switch (action.type) {
    case "SET_USER_INDEX": {
      const prop: { [index: number]: UserType } = {};
      prop[action.payload.index] = action.payload.value;
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, prop),
      });
    }

    case "SET_USER_GROUP_INDEX": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prop: { [index: number]: any } = {}; //TODO change to the user group type
      prop[action.payload.index] = action.payload.value;
      return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, prop),
      });
    }

    case "SET_USER_BY_SCHOOL_DATA_INDEX": {
      const prop: { [index: string]: UserType } = {};
      prop[action.payload.index] = action.payload.value;
      return Object.assign({}, state, {
        usersBySchoolData: Object.assign({}, state.usersBySchoolData, prop),
      });
    }

    default:
      return state;
  }
};

/**
 * userIndex
 * @param state state
 * @param action action
 */
/* export default function userIndex(
  state: UserIndexType = {
    users: {},
    groups: {},
    usersBySchoolData: {},
  },
  action: ActionType
): UserIndexType {
  if (action.type === "SET_USER_INDEX") {
    const prop: { [index: number]: UserType } = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {
      users: Object.assign({}, state.users, prop),
    });
  } else if (action.type === "SET_USER_GROUP_INDEX") {
    const prop: { [index: number]: any } = {}; //TODO change to the user group type
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {
      groups: Object.assign({}, state.groups, prop),
    });
  } else if (action.type === "SET_USER_BY_SCHOOL_DATA_INDEX") {
    const prop: { [index: string]: UserType } = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {
      usersBySchoolData: Object.assign({}, state.usersBySchoolData, prop),
    });
  }

  return state;
} */
