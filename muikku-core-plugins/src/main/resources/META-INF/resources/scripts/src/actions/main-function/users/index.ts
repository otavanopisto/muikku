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

export interface CreateStudentTriggerType {
  (data: {
    student: CreateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface CreateStaffmemberTriggerType {
  (data: {
    staffmember: CreateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface UpdateStudentTriggerType {
  (data: {
    student: UpdateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface UpdateStaffmemberTriggerType {
  (data: {
    staffmember: UpdateUserType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

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

export interface CreateUsergroupTriggerType {
  (data: {
    payload: CreateUserGroupType;
    addUsers?: string[];
    progress?: (state: UpdateUserGroupStateType) => any;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface LoadStudyprogrammesTriggerType {
  (): AnyActionType;
}

export interface LoadUsersTriggerType {
  (data: {
    payload: UserPayloadType;
    success?: (result: PagingEnvironmentUserListType) => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface LoadUsergroupsTriggerType {
  (data: {
    payload: UsergroupPayloadType;
    success?: (result: PagingEnvironmentUserListType) => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface LoadMoreUserTriggerType {
  (): AnyActionType;
}

export interface SetCurrentUserGroupTriggerType {
  (id: number): AnyActionType;
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const createStudent: CreateStudentTriggerType = function createStudent(data) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      await promisify(
        mApi().user.students.create(data.student),
        "callback",
      )().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      });

      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.student.success",
          ),
          "success",
        ),
      );
      data.success && data.success();

      await delay(2000);

      const users: UserPanelUsersType = (await promisify(
        mApi().organizationUserManagement.students.read(),
        "callback",
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
          getState().i18n.text.get(
            "plugin.organization.create.student.error",
            err as any as string,
          ),
          "error",
        ),
      );
      data.fail && data.fail();
    }
  };
};

const updateStudent: UpdateStudentTriggerType = function updateStudent(data) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      await promisify(
        mApi().user.students.basicInfo.update(
          data.student.identifier,
          data.student,
        ),
        "callback",
      )().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      });

      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.update.student.success",
          ),
          "success",
        ),
      );
      data.success && data.success();
      await delay(2000);

      const users: UserPanelUsersType = (await promisify(
        mApi().organizationUserManagement.students.read(),
        "callback",
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
          getState().i18n.text.get("plugin.organization.update.student.error"),
          "error",
        ),
      );
      data.fail && data.fail();
    }
  };
};

const createStaffmember: CreateStaffmemberTriggerType =
  function createStaffmember(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
    ) => {
      try {
        await promisify(
          mApi().user.staffMembers.create(data.staffmember),
          "callback",
        )().then(() => {
          mApi().organizationUserManagement.staffMembers.cacheClear();
        });
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.organization.create.staff.success",
            ),
            "success",
          ),
        );
        data.success && data.success();

        await delay(2000);

        const users: UserPanelUsersType = (await promisify(
          mApi().organizationUserManagement.staffMembers.read(),
          "callback",
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
            getState().i18n.text.get("plugin.organization.create.staff.error"),
            "error",
          ),
        );
        data.fail && data.fail();
      }
    };
  };

const updateStaffmember: UpdateStaffmemberTriggerType =
  function updateStaffmember(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
    ) => {
      try {
        await promisify(
          mApi().user.staffMembers.update(
            data.staffmember.identifier,
            data.staffmember,
          ),
          "callback",
        )().then(() => {
          mApi().organizationUserManagement.staffMembers.cacheClear();
        });
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.organization.update.staff.success",
            ),
            "success",
          ),
        );
        data.success && data.success();

        await delay(2000);

        const users: UserPanelUsersType = (await promisify(
          mApi().organizationUserManagement.staffMembers.read(),
          "callback",
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
            getState().i18n.text.get("plugin.organization.update.staff.error"),
            "error",
          ),
        );
        data.fail && data.fail();
      }
    };
  };

const updateUsergroup: UpdateUsergroupTriggerType = function updateUsergroup(
  data,
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      if (data.update) {
        await promisify(
          mApi().usergroup.groups.update(data.update),
          "callback",
        )();
        data.progress && data.progress("update-group");
      }
      if (data.addUsers) {
        await promisify(
          mApi().usergroup.addusers.update(data.addUsers),
          "callback",
        )();
        data.progress && data.progress("add-users");
      }
      if (data.removeUsers) {
        await promisify(
          mApi().usergroup.removeusers.update(data.removeUsers),
          "callback",
        )();
        data.progress && data.progress("remove-users");
      }
      data.progress && data.progress("done");
      data.success && data.success();
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.update.usergroup.success",
          ),
          "success",
        ),
      );
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.update.usergroup.error",
          ),
          "error",
        ),
      );
      data.fail && data.fail();
    }
  };
};

const createUsergroup: CreateUsergroupTriggerType = function createUsergroup(
  data,
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      const userGroup: UserGroupType = (await promisify(
        mApi().usergroup.groups.create(data.payload),
        "callback",
      )()) as UserGroupType;

      data.progress && data.progress("update-group");

      const userPayload: ModifyUserGroupUsersType = {
        groupIdentifier: userGroup.identifier,
        userIdentifiers: data.addUsers,
      };

      if (data.addUsers && data.addUsers.length > 0) {
        await promisify(
          mApi().usergroup.addusers.update(userPayload),
          "callback",
        )();
        data.progress && data.progress("add-users");
      }

      data.progress && data.progress("done");
      data.success && data.success();
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.usergroup.success",
          ),
          "success",
        ),
      );
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.organization.create.usergroup.error",
          ),
          "error",
        ),
      );
      data.fail && data.fail();
    }
  };
};

const loadStudyprogrammes: LoadStudyprogrammesTriggerType =
  function loadStudyprogrammes() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
            "error",
          ),
        );
      }
    };
  };

const loadStudents: LoadUsersTriggerType = function loadStudents(data) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      await promisify(
        mApi().organizationUserManagement.students.read(data.payload),
        "callback",
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
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error",
        ),
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

const loadStaff: LoadUsersTriggerType = function loadStaff(data) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });
      await promisify(
        mApi().organizationUserManagement.staffMembers.read(data.payload),
        "callback",
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
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error",
        ),
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

const loadUserGroups: LoadUsergroupsTriggerType = function loadUserGroups(
  data,
) {
  const maxResults = data.payload.maxResults ? data.payload.maxResults + 1 : 26;

  data.payload.maxResults = maxResults;
  data.payload.archetype = "USERGROUP";

  if (!data.payload.firstResult) {
    data.payload.firstResult = 0;
  }

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      dispatch({
        type: "UPDATE_HAS_MORE_USERGROUPS",
        payload: false,
      });

      const userGroups: UserGroupType[] = (await promisify(
        mApi().usergroup.groups.read(data.payload),
        "callback",
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
          getState().i18n.text.get("Load failed"),
          "error",
        ),
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

const loadMoreUserGroups: LoadUsersTriggerType = function loadMoreUserGroups() {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      const currentState = getState().userGroups;
      const payload = currentState.currentPayload;
      payload.firstResult = payload.firstResult + payload.maxResults - 1;
      const userGroups: UserGroupType[] = (await promisify(
        mApi().usergroup.groups.read(payload),
        "callback",
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
          getState().i18n.text.get("Loadmore failed"),
          "error",
        ),
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

const setCurrentUserGroup: SetCurrentUserGroupTriggerType =
  function loadCurrentUserGroup(id: number) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
            "error",
          ),
        );
      }
    };
  };

const loadAllCurrentUserGroupStaff: LoadUsersTriggerType =
  function loadAllCurrentUserGroupUsers(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
          "callback",
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
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error",
          ),
        );
      }
    };
  };

const loadAllCurrentUserGroupStudents: LoadUsersTriggerType =
  function loadAllCurrentUserGroupUsers(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
          "callback",
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
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error",
          ),
        );
      }
    };
  };

const loadUsers: LoadUsersTriggerType = function loadUsers(data) {
  const getStudents = promisify(
    mApi().organizationUserManagement.students.read(data.payload),
    "callback",
  )();
  const getStaffmembers = promisify(
    mApi().organizationUserManagement.staffMembers.read(data.payload),
    "callback",
  )();

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
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
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error",
        ),
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

const loadSelectorStudents: LoadUsersTriggerType =
  function loadSelectorStudents(data) {
    const getStudents = data.payload.q
      ? mApi().organizationUserManagement.students.read(data.payload)
      : null;

    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
            },
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
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error",
          ),
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

const loadSelectorStaff: LoadUsersTriggerType = function loadSelectorStaff(
  data,
) {
  const getStaff = data.payload.q
    ? mApi().organizationUserManagement.staffMembers.read(data.payload)
    : null;

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
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
          },
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
          getState().i18n.text.get("plugin.guider.errormessage.user"),
          "error",
        ),
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

const loadSelectorUserGroups: LoadUsersTriggerType =
  function loadSelectorUserGroups(data) {
    const getUserGroups = data.payload.q
      ? mApi().usergroup.groups.read(data.payload)
      : null;

    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
            },
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
            getState().i18n.text.get("plugin.guider.errormessage.user"),
            "error",
          ),
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
