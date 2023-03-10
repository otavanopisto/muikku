import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import promisify from "~/util/promisify";
import {
  UsersListType,
  UpdateUserGroupStateType,
  CreateUserGroupType,
  ModifyUserGroupUsersType,
  CurrentUserGroupType,
  UserPanelUsersType,
  PagingEnvironmentUserListType,
  UsersSelectType,
  UserStatusType,
  StudyprogrammeListType,
  UpdateUserGroupType,
  UserGroupsStateType,
  StudyprogrammeTypeStatusType,
  UserPayloadType,
  UsergroupPayloadType,
} from "reducers/main-function/users";
import {
  UserGroupType,
  UpdateUserType,
  CreateUserType,
} from "reducers/user-index";
import notificationActions from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";

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
  UserPanelUsersType
>;
export type UPDATE_STAFF_USERS = SpecificActionType<
  "UPDATE_STAFF_USERS",
  UserPanelUsersType
>;
export type LOAD_MORE_USER_GROUPS = SpecificActionType<
  "LOAD_MORE_USER_GROUPS",
  Array<UserGroupType>
>;
export type UPDATE_USER_GROUPS = SpecificActionType<
  "UPDATE_USER_GROUPS",
  Array<UserGroupType>
>;
export type UPDATE_CURRENT_USER_GROUP = SpecificActionType<
  "UPDATE_CURRENT_USER_GROUP",
  CurrentUserGroupType
>;
export type UPDATE_STUDENT_SELECTOR = SpecificActionType<
  "UPDATE_STUDENT_SELECTOR",
  UsersListType
>;
export type UPDATE_STAFF_SELECTOR = SpecificActionType<
  "UPDATE_STAFF_SELECTOR",
  UsersListType
>;
export type UPDATE_GROUP_SELECTOR = SpecificActionType<
  "UPDATE_GROUP_SELECTOR",
  Array<UserGroupType>
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
  Partial<UsersSelectType>
>;

/**
 * CreateStudentTriggerType
 */
export interface CreateStudentTriggerType {
  (data: {
    student: CreateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * CreateStaffmemberTriggerType
 */
export interface CreateStaffmemberTriggerType {
  (data: {
    staffmember: CreateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UpdateStudentTriggerType
 */
export interface UpdateStudentTriggerType {
  (data: {
    student: UpdateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UpdateStaffmemberTriggerType
 */
export interface UpdateStaffmemberTriggerType {
  (data: {
    staffmember: UpdateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UpdateUsergroupTriggerType
 */
export interface UpdateUsergroupTriggerType {
  (data: {
    update: UpdateUserGroupType;
    addUsers?: ModifyUserGroupUsersType;
    removeUsers?: ModifyUserGroupUsersType;
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
    payload: CreateUserGroupType;
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
    success?: (result: PagingEnvironmentUserListType) => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * LoadUsergroupsTriggerType
 */
export interface LoadUsergroupsTriggerType {
  (data: {
    payload: UsergroupPayloadType;
    success?: (result: PagingEnvironmentUserListType) => any;
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
 * @param ms
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      await promisify(
        mApi().user.students.create(data.student),
        "callback"
      )().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      });

      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.createSuccess", { ns: "users" }),
          "success"
        )
      );
      data.success && data.success();

      await delay(2000);

      const users: UserPanelUsersType = (await promisify(
        mApi().organizationUserManagement.students.read(),
        "callback"
      )()) as UserPanelUsersType;

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
          i18n.t("notifications.createError", {
            error: err,
            ns: "users",
          }),
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      await promisify(
        mApi().user.students.basicInfo.update(
          data.student.identifier,
          data.student
        ),
        "callback"
      )().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      });

      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.updateSuccess", { ns: "users" }),
          "success"
        )
      );
      data.success && data.success();
      await delay(2000);

      const users: UserPanelUsersType = (await promisify(
        mApi().organizationUserManagement.students.read(),
        "callback"
      )()) as UserPanelUsersType;

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
          i18n.t("notifications.updateError", { ns: "users" }),
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
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().user.staffMembers.create(data.staffmember),
          "callback"
        )().then(() => {
          mApi().organizationUserManagement.staffMembers.cacheClear();
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createSuccess", { ns: "users" }),
            "success"
          )
        );
        data.success && data.success();

        await delay(2000);

        const users: UserPanelUsersType = (await promisify(
          mApi().organizationUserManagement.staffMembers.read(),
          "callback"
        )()) as UserPanelUsersType;
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
            i18n.t("notifications.createError", { ns: "users" }),
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
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().user.staffMembers.update(
            data.staffmember.identifier,
            data.staffmember
          ),
          "callback"
        )().then(() => {
          mApi().organizationUserManagement.staffMembers.cacheClear();
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateSuccess", {
              ns: "users",
              context: "staff",
            }),
            "success"
          )
        );
        data.success && data.success();

        await delay(2000);

        const users: UserPanelUsersType = (await promisify(
          mApi().organizationUserManagement.staffMembers.read(),
          "callback"
        )()) as UserPanelUsersType;
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
            i18n.t("notifications.updateError", { ns: "users" }),
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      if (data.update) {
        await promisify(
          mApi().usergroup.groups.update(data.update),
          "callback"
        )();
        data.progress && data.progress("update-group");
      }
      if (data.addUsers) {
        await promisify(
          mApi().usergroup.addusers.update(data.addUsers),
          "callback"
        )();
        data.progress && data.progress("add-users");
      }
      if (data.removeUsers) {
        await promisify(
          mApi().usergroup.removeusers.update(data.removeUsers),
          "callback"
        )();
        data.progress && data.progress("remove-users");
      }
      data.progress && data.progress("done");
      data.success && data.success();
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.updateSuccess", {
            ns: "users",
            context: "userGroup",
          }),
          "success"
        )
      );
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.updateError", {
            ns: "users",
            context: "userGroup",
          }),
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      const userGroup: UserGroupType = (await promisify(
        mApi().usergroup.groups.create(data.payload),
        "callback"
      )()) as UserGroupType;

      data.progress && data.progress("update-group");

      const userPayload: ModifyUserGroupUsersType = {
        groupIdentifier: userGroup.identifier,
        userIdentifiers: data.addUsers,
      };

      if (data.addUsers && data.addUsers.length > 0) {
        await promisify(
          mApi().usergroup.addusers.update(userPayload),
          "callback"
        )();
        data.progress && data.progress("add-users");
      }

      data.progress && data.progress("done");
      data.success && data.success();
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.createSuccess", {
            ns: "users",
            context: "userGroup",
          }),
          "success"
        )
      );
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.createError", {
            ns: "users",
            context: "userGroup",
          }),
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
      dispatch: (arg: AnyActionType) => any,
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
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "studyProgrammes",
            }),
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      await promisify(
        mApi().organizationUserManagement.students.read(data.payload),
        "callback"
      )().then((users: UserPanelUsersType) => {
        const payload = { ...users, searchString: data.payload.q };
        dispatch({
          type: "UPDATE_STUDENT_USERS",
          payload: payload,
        });
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
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "students",
            count: 0,
          }),
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });
      await promisify(
        mApi().organizationUserManagement.staffMembers.read(data.payload),
        "callback"
      )().then((users: UserPanelUsersType) => {
        const payload = { ...users, searchString: data.payload.q };

        dispatch({
          type: "UPDATE_STAFF_USERS",
          payload: payload,
        });
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
          i18n.t("notifications.loadError", { ns: "users", context: "staff" }),
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
  const maxResults = data.payload.maxResults ? data.payload.maxResults + 1 : 26;

  data.payload.maxResults = maxResults;
  data.payload.archetype = "USERGROUP";

  if (!data.payload.firstResult) {
    data.payload.firstResult = 0;
  }

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "UPDATE_HAS_MORE_USERGROUPS",
        payload: false,
      });

      const userGroups: UserGroupType[] = (await promisify(
        mApi().usergroup.groups.read(data.payload),
        "callback"
      )()) as UserGroupType[];

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
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "userGroups",
          }),
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
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      const currentState = getState().userGroups;
      const payload = currentState.currentPayload;
      payload.firstResult = payload.firstResult + payload.maxResults - 1;
      const userGroups: UserGroupType[] = (await promisify(
        mApi().usergroup.groups.read(payload),
        "callback"
      )()) as UserGroupType[];

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
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "userGroups",
          }),
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
  function setCurrentUserGroup(id: number) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
            i18n.t("notifications.setError", { ns: "users" }),
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
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const current = getState().userGroups.currentUserGroup
        ? getState().userGroups.currentUserGroup
        : null;

      const payload: CurrentUserGroupType = {
        id: current ? current.id : null,
        students: current ? current.students : null,
        staff: null,
      };

      try {
        await promisify(
          mApi().organizationUserManagement.staffMembers.read(data.payload),
          "callback"
        )().then((result: PagingEnvironmentUserListType) => {
          payload.staff = result;
        }),
          dispatch({
            type: "UPDATE_CURRENT_USER_GROUP",
            payload: payload,
          });

        data.success && data.success(payload.staff);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "userGroupStaff",
            }),
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
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const current = getState().userGroups.currentUserGroup
        ? getState().userGroups.currentUserGroup
        : null;

      const payload: CurrentUserGroupType = {
        id: current ? current.id : null,
        students: null,
        staff: current ? current.staff : null,
      };

      try {
        await promisify(
          mApi().organizationUserManagement.students.read(data.payload),
          "callback"
        )().then((result: PagingEnvironmentUserListType) => {
          payload.students = result;
        }),
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
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "userGroupStudents",
            }),
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
  const getStudents = promisify(
    mApi().organizationUserManagement.students.read(data.payload),
    "callback"
  )();
  const getStaffmembers = promisify(
    mApi().organizationUserManagement.staffMembers.read(data.payload),
    "callback"
  )();

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      await Promise.all([
        getStudents.then((users: UserPanelUsersType) => {
          const payload = { ...users, searchString: data.payload.q };

          dispatch({
            type: "UPDATE_STUDENT_USERS",
            payload: payload,
          });
        }),
        getStaffmembers.then((users: UserPanelUsersType) => {
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
          i18n.t("notifications.loadError", { ns: "users" }),
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
    const getStudents = data.payload.q
      ? mApi().organizationUserManagement.students.read(data.payload)
      : null;

    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        if (getStudents !== null) {
          await promisify(getStudents, "callback")().then(
            (users: PagingEnvironmentUserListType) => {
              dispatch({
                type: "UPDATE_STUDENT_SELECTOR",
                payload: users.results,
              });
            }
          );
        } else {
          const payload: Partial<UsersSelectType> = { students: [] };
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
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "students",
              count: 0,
            }),
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
  const getStaff = data.payload.q
    ? mApi().organizationUserManagement.staffMembers.read(data.payload)
    : null;

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });
      if (getStaff !== null) {
        await promisify(getStaff, "callback")().then(
          (users: PagingEnvironmentUserListType) => {
            dispatch({
              type: "UPDATE_STAFF_SELECTOR",
              payload: users.results,
            });
          }
        );
      } else {
        const payload: Partial<UsersSelectType> = { staff: [] };
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
          i18n.t("notifications.loadError", { ns: "users", context: "staff" }),
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
    const getUserGroups = data.payload.q
      ? mApi().usergroup.groups.read(data.payload)
      : null;

    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        if (getUserGroups !== null) {
          await promisify(getUserGroups, "callback")().then(
            (usergGroups: UserGroupType[]) => {
              dispatch({
                type: "UPDATE_GROUP_SELECTOR",
                payload: usergGroups,
              });
            }
          );
        } else {
          const payload: Partial<UsersSelectType> = { userGroups: [] };
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
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "userGroups",
            }),
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
