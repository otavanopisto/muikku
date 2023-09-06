import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import promisify from "~/util/promisify";
import {
  UpdateUserGroupStateType,
  ModifyUserGroupUsersType,
  CurrentUserGroupType,
  UsersSelectState,
  UserStatusType,
  StudyprogrammeListType,
  UserGroupsStateType,
  StudyprogrammeTypeStatusType,
  UserPayloadType,
  UsergroupPayloadType,
  UserSearchResultWithExtraProperties,
} from "reducers/main-function/users";
import notificationActions from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import MApi from "~/api/api";
import { Dispatch } from "react-redux";
import {
  CreateStaffMemberRequest,
  CreateStudentRequest,
  CreateUsergroupRequest,
  UpdateStaffMemberRequest,
  UpdateStudentBasicInfoRequest,
  UpdateUsergroupAddUsersRequest,
  UpdateUsergroupRemoveUsersRequest,
  UpdateUsergroupRequest,
  User,
  UserGroup,
  UserSearchResult,
} from "~/generated/client";

export type SET_CURRENT_PAYLOAD = SpecificActionType<
  "SET_CURRENT_PAYLOAD",
  UserPayloadType
>;
export type UPDATE_USER_GROUPS_STATE = SpecificActionType<
  "UPDATE_USER_GROUPS_STATE",
  UserGroupsStateType
>;
export type UPDATE_HAS_MORE_USERGROUPS = SpecificActionType<
  "UPDATE_HAS_MORE_USERGROUPS",
  boolean
>;
export type UPDATE_STUDENT_USERS = SpecificActionType<
  "UPDATE_STUDENT_USERS",
  UserSearchResultWithExtraProperties
>;
export type UPDATE_STAFF_USERS = SpecificActionType<
  "UPDATE_STAFF_USERS",
  UserSearchResultWithExtraProperties
>;
export type LOAD_MORE_USER_GROUPS = SpecificActionType<
  "LOAD_MORE_USER_GROUPS",
  UserGroup[]
>;
export type UPDATE_USER_GROUPS = SpecificActionType<
  "UPDATE_USER_GROUPS",
  UserGroup[]
>;
export type UPDATE_CURRENT_USER_GROUP = SpecificActionType<
  "UPDATE_CURRENT_USER_GROUP",
  CurrentUserGroupType
>;
export type UPDATE_STUDENT_SELECTOR = SpecificActionType<
  "UPDATE_STUDENT_SELECTOR",
  User[]
>;
export type UPDATE_STAFF_SELECTOR = SpecificActionType<
  "UPDATE_STAFF_SELECTOR",
  User[]
>;
export type UPDATE_GROUP_SELECTOR = SpecificActionType<
  "UPDATE_GROUP_SELECTOR",
  UserGroup[]
>;
export type UPDATE_USERS_STATE = SpecificActionType<
  "UPDATE_USERS_STATE",
  UserStatusType
>;
export type UPDATE_STUDYPROGRAMME_TYPES = SpecificActionType<
  "UPDATE_STUDYPROGRAMME_TYPES",
  StudyprogrammeListType
>;
export type UPDATE_STUDYPROGRAMME_STATUS_TYPE = SpecificActionType<
  "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
  StudyprogrammeTypeStatusType
>;
export type CLEAR_USER_SELECTOR = SpecificActionType<
  "CLEAR_USER_SELECTOR",
  Partial<UsersSelectState>
>;

/**
 * CreateStudentTriggerType
 */
export interface CreateStudentTriggerType {
  (data: {
    student: CreateStudentRequest;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * CreateStaffmemberTriggerType
 */
export interface CreateStaffmemberTriggerType {
  (data: {
    staffmember: CreateStaffMemberRequest;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UpdateStudentTriggerType
 */
export interface UpdateStudentTriggerType {
  (data: {
    student: UpdateStudentBasicInfoRequest;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UpdateStaffmemberTriggerType
 */
export interface UpdateStaffmemberTriggerType {
  (data: {
    staffmember: UpdateStaffMemberRequest;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UpdateUsergroupTriggerType
 */
export interface UpdateUsergroupTriggerType {
  (data: {
    update: UpdateUsergroupRequest;
    addUsers?: UpdateUsergroupAddUsersRequest;
    removeUsers?: UpdateUsergroupRemoveUsersRequest;
    progress?: (state: UpdateUserGroupStateType) => any;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * CreateUsergroupTriggerType
 */
export interface CreateUsergroupTriggerType {
  (data: {
    payload: CreateUsergroupRequest;
    addUsers?: string[];
    progress?: (state: UpdateUserGroupStateType) => any;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * LoadStudyprogrammesTriggerType
 */
export interface LoadStudyprogrammesTriggerType {
  (): AnyActionType;
}

/**
 * LoadUsersTriggerType
 */
export interface LoadUsersTriggerType {
  (data: {
    payload: UserPayloadType;
    success?: (result: UserSearchResult) => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * LoadUsergroupsTriggerType
 */
export interface LoadUsergroupsTriggerType {
  (data: {
    payload: UsergroupPayloadType;
    success?: (result: UserSearchResult) => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * LoadMoreUserTriggerType
 */
export interface LoadMoreUserTriggerType {
  (): AnyActionType;
}

/**
 * SetCurrentUserGroupTriggerType
 */
export interface SetCurrentUserGroupTriggerType {
  (id: number): AnyActionType;
}

/**
 * delay
 * @param ms ms
 */
function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * createStudent
 * @param data data
 */
const createStudent: CreateStudentTriggerType = function createStudent(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const userApi = MApi.getUserApi();
    const organizationApi = MApi.getOrganizationApi();

    try {
      /* await promisify(
        mApi().user.students.create(data.student),
        "callback"
      )().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      }); */

      await userApi.createStudent({
        createStudentRequest: data.student,
      });

      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.student.success"
          ),
          "success"
        )
      );
      data.success && data.success();

      await delay(2000);

      /* const users: UserPanelUsersType = (await promisify(
        mApi().organizationUserManagement.students.read(),
        "callback"
      )()) as UserPanelUsersType; */

      const users = await organizationApi.getOrganizationStudents();

      dispatch({
        type: "UPDATE_STUDENT_USERS",
        payload: users,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.student.error",
            err as any as string
          ),
          "error"
        )
      );
      data.fail && data.fail();
    }
  };
};

/**
 * updateStudent
 * @param data data
 */
const updateStudent: UpdateStudentTriggerType = function updateStudent(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const userApi = MApi.getUserApi();
    const organizationApi = MApi.getOrganizationApi();

    try {
      /* await promisify(
        mApi().user.students.basicInfo.update(
          data.student.identifier,
          data.student
        ),
        "callback"
      )().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      }); */

      await userApi.updateStudentBasicInfo({
        studentId: data.student.identifier,
        updateStudentBasicInfoRequest: data.student,
      });

      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.update.student.success"
          ),
          "success"
        )
      );
      data.success && data.success();
      await delay(2000);

      /* const users: UserPanelUsersType = (await promisify(
        mApi().organizationUserManagement.students.read(),
        "callback"
      )()) as UserPanelUsersType; */

      const users = await organizationApi.getOrganizationStudents();

      dispatch({
        type: "UPDATE_STUDENT_USERS",
        payload: users,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("plugin.organization.update.student.error"),
          "error"
        )
      );
      data.fail && data.fail();
    }
  };
};

/**
 * createStaffmember
 * @param data data
 */
const createStaffmember: CreateStaffmemberTriggerType =
  function createStaffmember(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();
      const organizationApi = MApi.getOrganizationApi();

      try {
        /* await promisify(
          mApi().user.staffMembers.create(data.staffmember),
          "callback"
        )().then(() => {
          mApi().organizationUserManagement.staffMembers.cacheClear();
        }); */

        await userApi.createStaffMember({
          createStaffMemberRequest: data.staffmember,
        });

        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.organization.create.staff.success"
            ),
            "success"
          )
        );
        data.success && data.success();

        await delay(2000);

        /* const users: UserPanelUsersType = (await promisify(
          mApi().organizationUserManagement.staffMembers.read(),
          "callback"
        )()) as UserPanelUsersType; */

        const users = await organizationApi.getOrganizationStaffMembers();

        dispatch({
          type: "UPDATE_STAFF_USERS",
          payload: users,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.organization.create.staff.error"),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * updateStaffmember
 * @param data data
 */
const updateStaffmember: UpdateStaffmemberTriggerType =
  function updateStaffmember(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();
      const organizationApi = MApi.getOrganizationApi();

      try {
        /* await promisify(
          mApi().user.staffMembers.update(
            data.staffmember.identifier,
            data.staffmember
          ),
          "callback"
        )().then(() => {
          mApi().organizationUserManagement.staffMembers.cacheClear();
        }); */

        await userApi.updateStaffMember({
          staffMemberId: data.staffmember.identifier,
          updateStaffMemberRequest: data.staffmember,
        });

        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.organization.update.staff.success"
            ),
            "success"
          )
        );
        data.success && data.success();

        await delay(2000);

        /* const users: UserPanelUsersType = (await promisify(
          mApi().organizationUserManagement.staffMembers.read(),
          "callback"
        )()) as UserPanelUsersType; */

        const users = await organizationApi.getOrganizationStaffMembers();

        dispatch({
          type: "UPDATE_STAFF_USERS",
          payload: users,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.organization.update.staff.error"),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * updateUsergroup
 * @param data data
 */
const updateUsergroup: UpdateUsergroupTriggerType = function updateUsergroup(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const usergroupApi = MApi.getUsergroupApi();

    try {
      if (data.update) {
        /* await promisify(
          mApi().usergroup.groups.update(data.update),
          "callback"
        )(); */

        await usergroupApi.updateUsergroup({
          updateUsergroupRequest: data.update,
        });

        data.progress && data.progress("update-group");
      }
      if (data.addUsers) {
        /* await promisify(
          mApi().usergroup.addusers.update(data.addUsers),
          "callback"
        )(); */

        await usergroupApi.updateUsergroupAddUsers({
          updateUsergroupAddUsersRequest: data.addUsers,
        });

        data.progress && data.progress("add-users");
      }
      if (data.removeUsers) {
        /* await promisify(
          mApi().usergroup.removeusers.update(data.removeUsers),
          "callback"
        )(); */

        await usergroupApi.updateUsergroupRemoveUsers({
          updateUsergroupRemoveUsersRequest: data.removeUsers,
        });

        data.progress && data.progress("remove-users");
      }
      data.progress && data.progress("done");
      data.success && data.success();
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.update.usergroup.success"
          ),
          "success"
        )
      );
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.update.usergroup.error"
          ),
          "error"
        )
      );
      data.fail && data.fail();
    }
  };
};

/**
 * createUsergroup
 * @param data data
 */
const createUsergroup: CreateUsergroupTriggerType = function createUsergroup(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const usergroupApi = MApi.getUsergroupApi();

    try {
      /* const userGroup: UserGroupType = (await promisify(
        mApi().usergroup.groups.create(data.payload),
        "callback"
      )()) as UserGroupType; */

      const userGroup = await usergroupApi.createUsergroup({
        createUsergroupRequest: data.payload,
      });

      data.progress && data.progress("update-group");

      /* const userPayload = {
        groupIdentifier: userGroup.identifier,
        userIdentifiers: data.addUsers,
      }; */

      if (data.addUsers && data.addUsers.length > 0) {
        /* await promisify(
          mApi().usergroup.addusers.update(userPayload),
          "callback"
        )(); */

        await usergroupApi.updateUsergroupAddUsers({
          updateUsergroupAddUsersRequest: {
            groupIdentifier: userGroup.identifier,
            userIdentifiers: data.addUsers,
          },
        });

        data.progress && data.progress("add-users");
      }

      data.progress && data.progress("done");
      data.success && data.success();
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.usergroup.success"
          ),
          "success"
        )
      );
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.usergroup.error"
          ),
          "error"
        )
      );
      data.fail && data.fail();
    }
  };
};

/**
 * loadStudyprogrammes
 */
const loadStudyprogrammes: LoadStudyprogrammesTriggerType =
  function loadStudyprogrammes() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_STUDYPROGRAMME_TYPES",
          payload: <StudyprogrammeListType>(
            await promisify(mApi().user.studyProgrammes.read(), "callback")()
          ),
        });
        dispatch({
          type: "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
          payload: <StudyprogrammeTypeStatusType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch({
          type: "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
          payload: <StudyprogrammeTypeStatusType>"ERROR",
        });
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("TODO: Error"),
            "error"
          )
        );
      }
    };
  };

/**
 * loadStudents
 * @param data data
 */
const loadStudents: LoadUsersTriggerType = function loadStudents(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const organizationApi = MApi.getOrganizationApi();

    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      /* await promisify(
        mApi().organizationUserManagement.students.read(data.payload),
        "callback"
      )().then((users: UserPanelUsersType) => {
        const payload = { ...users, searchString: data.payload.q };
        dispatch({
          type: "UPDATE_STUDENT_USERS",
          payload: payload,
        });
      }); */

      const users = await organizationApi.getOrganizationStudents({
        q: data.payload.q || "",
        firstResult: data.payload.firstResult,
        maxResults: data.payload.maxResults,
        userGroupIds: data.payload.userGroupIds,
      });

      dispatch({
        type: "UPDATE_STUDENT_USERS",
        payload: {
          ...users,
          searchString: data.payload.q,
        },
      });

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error"
        )
      );

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadStaff
 * @param data data
 */
const loadStaff: LoadUsersTriggerType = function loadStaff(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const organizationApi = MApi.getOrganizationApi();

    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      /* await promisify(
        mApi().organizationUserManagement.staffMembers.read(data.payload),
        "callback"
      )().then((users: UserPanelUsersType) => {
        const payload = { ...users, searchString: data.payload.q };

        dispatch({
          type: "UPDATE_STAFF_USERS",
          payload: payload,
        });
      }); */

      const users = await organizationApi.getOrganizationStaffMembers({
        q: data.payload.q || "",
        firstResult: data.payload.firstResult,
        maxResults: data.payload.maxResults,
        userGroupIds: data.payload.userGroupIds,
      });

      dispatch({
        type: "UPDATE_STAFF_USERS",
        payload: {
          ...users,
          searchString: data.payload.q,
        },
      });

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error"
        )
      );
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadUserGroups
 * @param data data
 */
const loadUserGroups: LoadUsergroupsTriggerType = function loadUserGroups(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const usergroupApi = MApi.getUsergroupApi();

    const maxResults = data.payload.maxResults
      ? data.payload.maxResults + 1
      : 26;

    data.payload.maxResults = maxResults;
    data.payload.archetype = "USERGROUP";

    if (!data.payload.firstResult) {
      data.payload.firstResult = 0;
    }

    try {
      dispatch({
        type: "UPDATE_HAS_MORE_USERGROUPS",
        payload: false,
      });

      /* const userGroups: UserGroupType[] = (await promisify(
        mApi().usergroup.groups.read(data.payload),
        "callback"
      )()) as UserGroupType[]; */

      const userGroups = await usergroupApi.getUsergroups({
        q: data.payload.q || "",
        firstResult: data.payload.firstResult,
        maxResults: data.payload.maxResults,
        userGroupIds: data.payload.userGroupIds,
      });

      dispatch({
        type: "SET_CURRENT_PAYLOAD",
        payload: data.payload,
      });

      dispatch({
        type: "UPDATE_USER_GROUPS",
        payload: userGroups,
      });

      if (userGroups.length > maxResults - 1) {
        dispatch({
          type: "UPDATE_HAS_MORE_USERGROUPS",
          payload: true,
        });
        userGroups.pop();
      } else {
        dispatch({
          type: "UPDATE_HAS_MORE_USERGROUPS",
          payload: false,
        });
      }

      dispatch({
        type: "UPDATE_USER_GROUPS_STATE",
        payload: "READY",
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("Load failed"),
          "error"
        )
      );
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadMoreUserGroups
 */
const loadMoreUserGroups: LoadUsersTriggerType = function loadMoreUserGroups() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const usergroupApi = MApi.getUsergroupApi();

    try {
      const currentState = getState().userGroups;
      const payload = currentState.currentPayload;
      payload.firstResult = payload.firstResult + payload.maxResults - 1;

      /* const userGroups: UserGroup[] = (await promisify(
        mApi().usergroup.groups.read(payload),
        "callback"
      )()) as UserGroup[]; */

      const userGroups = await usergroupApi.getUsergroups({
        q: payload.q,
        firstResult: payload.firstResult,
        maxResults: payload.maxResults,
        userGroupIds: payload.userGroupIds,
      });

      dispatch({
        type: "LOAD_MORE_USER_GROUPS",
        payload: userGroups,
      });

      if (userGroups.length > payload.maxResults - 1) {
        dispatch({
          type: "UPDATE_HAS_MORE_USERGROUPS",
          payload: true,
        });
        userGroups.pop();
      } else {
        dispatch({
          type: "UPDATE_HAS_MORE_USERGROUPS",
          payload: false,
        });
      }

      dispatch({
        type: "UPDATE_USER_GROUPS_STATE",
        payload: "READY",
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("Loadmore failed"),
          "error"
        )
      );
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * setCurrentUserGroup
 * @param id id
 */
const setCurrentUserGroup: SetCurrentUserGroupTriggerType =
  function loadCurrentUserGroup(id: number) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const current: CurrentUserGroupType = getState().userGroups
        .currentUserGroup
        ? getState().userGroups.currentUserGroup
        : null;

      const payload: CurrentUserGroupType = {
        id: id,
        students: current ? current.students : null,
        staff: current ? current.staff : null,
      };

      try {
        dispatch({
          type: "UPDATE_CURRENT_USER_GROUP",
          payload: payload,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("TODO"),
            "error"
          )
        );
      }
    };
  };

/**
 * loadAllCurrentUserGroupStaff
 * @param data data
 */
const loadAllCurrentUserGroupStaff: LoadUsersTriggerType =
  function loadAllCurrentUserGroupUsers(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const organizationApi = MApi.getOrganizationApi();

      const current = getState().userGroups.currentUserGroup
        ? getState().userGroups.currentUserGroup
        : null;

      const payload: CurrentUserGroupType = {
        id: current ? current.id : null,
        students: current ? current.students : null,
        staff: null,
      };

      try {
        /* await promisify(
          mApi().organizationUserManagement.staffMembers.read(data.payload),
          "callback"
        )().then((result: UserSearchResult) => {
          payload.staff = result;
        }),
          dispatch({
            type: "UPDATE_CURRENT_USER_GROUP",
            payload: payload,
          }); */

        const users = await organizationApi.getOrganizationStaffMembers({
          q: data.payload.q || "",
          userGroupIds: data.payload.userGroupIds,
          firstResult: data.payload.firstResult,
          maxResults: data.payload.maxResults,
        });

        dispatch({
          type: "UPDATE_CURRENT_USER_GROUP",
          payload: {
            ...payload,
            staff: users,
          },
        });

        data.success && data.success(payload.staff);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error"
          )
        );
      }
    };
  };

/**
 * loadAllCurrentUserGroupStudents
 * @param data data
 */
const loadAllCurrentUserGroupStudents: LoadUsersTriggerType =
  function loadAllCurrentUserGroupUsers(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const organizationApi = MApi.getOrganizationApi();

      const current = getState().userGroups.currentUserGroup
        ? getState().userGroups.currentUserGroup
        : null;

      const payload: CurrentUserGroupType = {
        id: current ? current.id : null,
        students: null,
        staff: current ? current.staff : null,
      };

      try {
        /* await promisify(
          mApi().organizationUserManagement.students.read(data.payload),
          "callback"
        )().then((result: PagingEnvironmentUserListType) => {
          payload.students = result;
        }),
          dispatch({
            type: "UPDATE_CURRENT_USER_GROUP",
            payload: payload,
          }); */

        const users = await organizationApi.getOrganizationStudents({
          q: data.payload.q,
          userGroupIds: data.payload.userGroupIds,
          firstResult: data.payload.firstResult,
          maxResults: data.payload.maxResults,
        });

        payload.students = users;

        dispatch({
          type: "UPDATE_CURRENT_USER_GROUP",
          payload: payload,
        });

        data.success && data.success(payload.students);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error"
          )
        );
      }
    };
  };

/**
 * loadUsers
 * @param data data
 */
const loadUsers: LoadUsersTriggerType = function loadUsers(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const organizationApi = MApi.getOrganizationApi();

    /* const getStudents = promisify(
      mApi().organizationUserManagement.students.read(data.payload),
      "callback"
    )();
    const getStaffmembers = promisify(
      mApi().organizationUserManagement.staffMembers.read(data.payload),
      "callback"
    )(); */

    const getStudents = organizationApi.getOrganizationStudents({
      q: data.payload.q,
      userGroupIds: data.payload.userGroupIds,
      firstResult: data.payload.firstResult,
      maxResults: data.payload.maxResults,
    });
    const getStaffmembers = organizationApi.getOrganizationStaffMembers({
      q: data.payload.q,
      userGroupIds: data.payload.userGroupIds,
      firstResult: data.payload.firstResult,
      maxResults: data.payload.maxResults,
    });

    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      await Promise.all([
        getStudents.then((users) => {
          const payload = { ...users, searchString: data.payload.q };

          dispatch({
            type: "UPDATE_STUDENT_USERS",
            payload: payload,
          });
        }),
        getStaffmembers.then((users) => {
          const payload = { ...users, searchString: data.payload.q };

          dispatch({
            type: "UPDATE_STAFF_USERS",
            payload: payload,
          });
        }),
      ]);
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"READY",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error"
        )
      );

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadSelectorStudents
 * @param data data
 */
const loadSelectorStudents: LoadUsersTriggerType =
  function loadSelectorStudents(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const organizationApi = MApi.getOrganizationApi();

      /* const getStudents = data.payload.q
        ? mApi().organizationUserManagement.students.read(data.payload)
        : null; */

      const getStudents = data.payload.q
        ? organizationApi.getOrganizationStudents({
            q: data.payload.q,
            userGroupIds: data.payload.userGroupIds,
            firstResult: data.payload.firstResult,
            maxResults: data.payload.maxResults,
          })
        : null;

      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        if (getStudents !== null) {
          /* await promisify(getStudents, "callback")().then(
            (users: UserSearchResult) => {
              dispatch({
                type: "UPDATE_STUDENT_SELECTOR",
                payload: users.results,
              });
            }
          ); */

          const usersResult = await getStudents;

          dispatch({
            type: "UPDATE_STUDENT_SELECTOR",
            payload: usersResult.results,
          });
        } else {
          const payload: Partial<UsersSelectState> = { students: [] };
          dispatch({
            type: "CLEAR_USER_SELECTOR",
            payload,
          });
        }
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error"
          )
        );

        dispatch({
          type: "UPDATE_USERS_STATE",
          payload: <UserStatusType>"ERROR",
        });
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

/**
 * loadSelectorStaff
 * @param data data
 */
const loadSelectorStaff: LoadUsersTriggerType = function loadSelectorStaff(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const organizationApi = MApi.getOrganizationApi();

    /* const getStaff = data.payload.q
      ? mApi().organizationUserManagement.staffMembers.read(data.payload)
      : null; */

    const getStaff = data.payload.q
      ? organizationApi.getOrganizationStaffMembers({
          q: data.payload.q,
          userGroupIds: data.payload.userGroupIds,
          firstResult: data.payload.firstResult,
          maxResults: data.payload.maxResults,
        })
      : null;

    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });
      if (getStaff !== null) {
        /* await promisify(getStaff, "callback")().then(
          (users: UserSearchResult) => {
            dispatch({
              type: "UPDATE_STAFF_SELECTOR",
              payload: users.results,
            });
          }
        ); */

        const userResult = await getStaff;

        dispatch({
          type: "UPDATE_STAFF_SELECTOR",
          payload: userResult.results,
        });
      } else {
        const payload: Partial<UsersSelectState> = { staff: [] };
        dispatch({
          type: "CLEAR_USER_SELECTOR",
          payload,
        });
      }
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error"
        )
      );

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadSelectorUserGroups
 * @param data data
 */
const loadSelectorUserGroups: LoadUsersTriggerType =
  function loadSelectorUserGroups(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const usergroupApi = MApi.getUsergroupApi();

      /* const getUserGroups = data.payload.q
        ? mApi().usergroup.groups.read(data.payload)
        : null;
      */

      const getUserGroups = usergroupApi.getUsergroups({
        q: data.payload.q,
        userGroupIds: data.payload.userGroupIds,
        firstResult: data.payload.firstResult,
        maxResults: data.payload.maxResults,
      });

      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        if (getUserGroups !== null) {
          /* await promisify(getUserGroups, "callback")().then(
            (usergGroups: UserGroup[]) => {
              dispatch({
                type: "UPDATE_GROUP_SELECTOR",
                payload: usergGroups,
              });
            }
          ); */

          const userGroups = await getUserGroups;

          dispatch({
            type: "UPDATE_GROUP_SELECTOR",
            payload: userGroups,
          });
        } else {
          const payload: Partial<UsersSelectState> = { userGroups: [] };
          dispatch({
            type: "CLEAR_USER_SELECTOR",
            payload,
          });
        }
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error"
          )
        );

        dispatch({
          type: "UPDATE_USERS_STATE",
          payload: <UserStatusType>"ERROR",
        });
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

export {
  loadUsers,
  loadAllCurrentUserGroupStaff,
  loadAllCurrentUserGroupStudents,
  updateUsergroup,
  setCurrentUserGroup,
  createUsergroup,
  loadStaff,
  loadUserGroups,
  loadMoreUserGroups,
  loadStudents,
  loadSelectorStaff,
  loadSelectorStudents,
  loadSelectorUserGroups,
  loadStudyprogrammes,
  updateStaffmember,
  updateStudent,
  createStaffmember,
  createStudent,
};
