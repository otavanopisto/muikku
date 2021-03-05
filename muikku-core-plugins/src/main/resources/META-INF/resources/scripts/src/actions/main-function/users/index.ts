import mApi, { MApiError } from '~/lib/mApi';
import { AnyActionType, SpecificActionType } from '~/actions';
import promisify from '~/util/promisify';
import { UsersListType, UpdateUserGroupStateType, CreateUserGroupType, ModifyUserGroupUsersType,
  CurrentUserGroupType, UserPanelUsersType, OrganizationUsersListType, UsersSelectType, UserStatusType,
  StudyprogrammeListType, UpdateUserGroupType, UserGroupListType, StudyprogrammeTypeStatusType } from 'reducers/main-function/users';
import { UserGroupType, UpdateUserType, CreateUserType, UserType} from 'reducers/user-index';
import {SelectItem} from '~/actions/workspaces/index'
import notificationActions from '~/actions/base/notifications';
import { StateType } from '~/reducers';
import { type } from 'os';
export type UPDATE_STUDENT_USERS = SpecificActionType<"UPDATE_STUDENT_USERS", UserPanelUsersType>
export type UPDATE_STAFF_USERS = SpecificActionType<"UPDATE_STAFF_USERS", UserPanelUsersType>
export type UPDATE_USER_GROUPS = SpecificActionType<"UPDATE_USER_GROUPS", Array<UserGroupType>>
export type UPDATE_CURRENT_USER_GROUP= SpecificActionType<"UPDATE_CURRENT_USER_GROUP", CurrentUserGroupType>
export type UPDATE_STUDENT_SELECTOR = SpecificActionType<"UPDATE_STUDENT_SELECTOR", UsersListType>
export type UPDATE_STAFF_SELECTOR = SpecificActionType<"UPDATE_STAFF_SELECTOR", UsersListType>
export type UPDATE_GROUP_SELECTOR = SpecificActionType<"UPDATE_GROUP_SELECTOR", Array<UserGroupType>>
export type UPDATE_USERS_STATE = SpecificActionType<"UPDATE_USERS_STATE", UserStatusType>
export type UPDATE_STUDYPROGRAMME_TYPES = SpecificActionType<"UPDATE_STUDYPROGRAMME_TYPES", StudyprogrammeListType>
export type UPDATE_STUDYPROGRAMME_STATUS_TYPE = SpecificActionType<"UPDATE_STUDYPROGRAMME_STATUS_TYPE", StudyprogrammeTypeStatusType>
export type CLEAR_USER_SELECTOR = SpecificActionType<"CLEAR_USER_SELECTOR", Partial<UsersSelectType>>

export interface CreateStudentTriggerType {
  (data: {
    student: CreateUserType,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface CreateStaffmemberTriggerType {
  (data: {
    staffmember: CreateUserType,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface UpdateStudentTriggerType {
  (data: {
    student: UpdateUserType,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface UpdateStaffmemberTriggerType {
  (data: {
    staffmember: UpdateUserType,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface UpdateUsergroupTriggerType {
  (data: {
    update: UpdateUserGroupType,
    addUsers?: ModifyUserGroupUsersType,
    removeUsers?: ModifyUserGroupUsersType,
    progress?: (state: UpdateUserGroupStateType) => any,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface CreateUsergroupTriggerType {
  (data: {
    payload: CreateUserGroupType,
    addUsers?: string[],
    progress?: (state: UpdateUserGroupStateType) => any,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface LoadStudyprogrammesTriggerType {
  (): AnyActionType
}

// export interface LoadUsersTriggerType {
//   (data: {
//     q: string | null,
//     firstResult?: number | null,
//     lastResult?: number | null,
//     maxResults?: number | null,
//     userGroupIds?: number[],
//   }): AnyActionType
// }



export interface LoadUsersTriggerType {
  (data: {
    payload: {
      q: string | null,
      firstResult?: number | null,
      lastResult?: number | null,
      maxResults?: number | null,
      userGroupIds?: number[],
      }
    success?: (result: OrganizationUsersListType)=> any,
    fail?: ()=> any,
    endpoint? : any,
  }

  ): AnyActionType
}

export interface LoadUsersWrapperType {
  data: {
    payload: {
      q: string | null,
      firstResult?: number | null,
      lastResult?: number | null,
      maxResults?: number | null,
      userGroupIds?: number[],
      }
    success?: (result: OrganizationUsersListType)=> any,
    fail?: ()=> any,
    endpoint? : any,
  }
}


export interface SetCurrentUserGroupTriggerType {
  (id: number):AnyActionType
}


function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

let createStudent: CreateStudentTriggerType = function createStudent(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      await promisify(mApi().user.students.create(data.student), 'callback')().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      });

      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.student.success"), 'success'));
      data.success && data.success();

      await delay(2000);

      let users: UserPanelUsersType = await promisify(mApi().organizationUserManagement.students.read(), 'callback')() as UserPanelUsersType;

      dispatch({
        type: "UPDATE_STUDENT_USERS",
        payload: users
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.student.error"), 'error'));
      data.fail && data.fail();
    }
  }
}

let updateStudent: UpdateStudentTriggerType = function updateStudent(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      await promisify(mApi().user.students.basicInfo.update(data.student.identifier, data.student), 'callback')().then(() => {
        mApi().organizationUserManagement.students.cacheClear();
      });

      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.update.student.success"), 'success'));
      data.success && data.success();
      await delay(2000);

      let users: UserPanelUsersType = await promisify(mApi().organizationUserManagement.students.read(), 'callback')() as UserPanelUsersType;

      dispatch({
        type: "UPDATE_STUDENT_USERS",
        payload: users
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.update.student.error"), 'error'));
      data.fail && data.fail();
    }
  }
}

let createStaffmember: CreateStaffmemberTriggerType = function createStaffmember(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      await promisify(mApi().user.staffMembers.create(data.staffmember), 'callback')().then(() => {
        mApi().organizationUserManagement.staffMembers.cacheClear();
      });
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.staff.success"), 'success'));
      data.success && data.success();

      await delay(2000);

      let users: UserPanelUsersType = await promisify(mApi().organizationUserManagement.staffMembers.read(), 'callback')() as UserPanelUsersType;
      dispatch({
        type: "UPDATE_STAFF_USERS",
        payload: users
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.staff.error"), 'error'));
      data.fail && data.fail();
    }
  }
}

let updateStaffmember: UpdateStaffmemberTriggerType = function updateStaffmember(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      await promisify(mApi().user.staffMembers.update(data.staffmember.identifier, data.staffmember), 'callback')().then(() => {
        mApi().organizationUserManagement.staffMembers.cacheClear();
      });
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.update.staff.success"), 'success'));
      data.success && data.success();

      await delay(2000);

      let users: UserPanelUsersType = await promisify(mApi().organizationUserManagement.staffMembers.read(), 'callback')() as UserPanelUsersType;
      dispatch({
        type: "UPDATE_STAFF_USERS",
        payload: users
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.update.staff.error"), 'error'));
      data.fail && data.fail();
    }
  }
}

let updateUsergroup: UpdateUsergroupTriggerType = function updateUsergroup(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: ()=> StateType) => {
    try {
      if(data.update) {
        await promisify(mApi().usergroup.groups.update(data.update), 'callback')();
        data.progress && data.progress("update-group");
      }
      if(data.addUsers) {
        await promisify(mApi().usergroup.addusers.update(data.addUsers), 'callback')();
        data.progress && data.progress("add-users");
      }
      if(data.removeUsers) {
        await promisify(mApi().usergroup.removeusers.update(data.removeUsers), 'callback')();
        data.progress && data.progress("remove-users");
      }
      data.progress && data.progress("done");
      data.success && data.success();
    } catch (err) {
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.update.usergroup.error"), 'error'));
      data.fail && data.fail();
    }
  }
}

let createUsergroup: CreateUsergroupTriggerType = function createUsergroup(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: ()=> StateType) => {
    try {

      let userGroup:UserGroupType =  await promisify(mApi().usergroup.groups.create(data.payload), 'callback')() as UserGroupType;

      data.progress && data.progress("update-group");

      let userPayload:ModifyUserGroupUsersType = {
        groupIdentifier: userGroup.identifier,
        userIdentifiers: data.addUsers
      }

      if(data.addUsers.length > 0) {
        await promisify(mApi().usergroup.addusers.update(userPayload), 'callback')();
        data.progress && data.progress("add-users");
      }

      data.progress && data.progress("done");
      data.success && data.success();
    } catch (err) {
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.update.usergroup.error"), 'error'));
      data.fail && data.fail();
    }
  }
}




let loadStudyprogrammes: LoadStudyprogrammesTriggerType = function loadStudyprogrammes() {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "UPDATE_STUDYPROGRAMME_TYPES",
        payload: <StudyprogrammeListType>(await promisify(mApi().user.studyProgrammes.read(), 'callback')())
      });
      dispatch({
        type: "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
        payload: <StudyprogrammeTypeStatusType>"READY"
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch({
        type: "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
        payload: <StudyprogrammeTypeStatusType>"ERROR"
      });
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("TODO: Error"), 'error'));
    }
  }
}


let loadStudents: LoadUsersTriggerType = function loadStudents(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });

      await promisify(mApi().organizationUserManagement.students.read(data.payload), 'callback')().then((users: UserPanelUsersType) => {
        let payload = { ...users, searchString: data.payload.q };
        dispatch({
          type: "UPDATE_STUDENT_USERS",
          payload: payload
        });
      });

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

let loadStaff: LoadUsersTriggerType = function loadStaff(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      await promisify(mApi().organizationUserManagement.staffMembers.read(data.payload), 'callback')().then((users: UserPanelUsersType) => {
        let payload = { ...users, searchString: data.payload.q };

        dispatch({
          type: "UPDATE_STAFF_USERS",
          payload: payload
        });
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

let loadUsergroups: LoadUsersTriggerType = function loadUserGroups(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      await promisify(mApi().usergroup.groups.read(data.payload), 'callback')().then((result: UserGroupType[]) => {
        dispatch({
          type: "UPDATE_USER_GROUPS",
          payload: result
        });
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

let setCurrentUserGroup: SetCurrentUserGroupTriggerType = function loadCurrentUserGroup(id: number) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {

    let current:CurrentUserGroupType = getState().userGroups.currentUserGroup ? getState().userGroups.currentUserGroup : null;

    let payload:CurrentUserGroupType = {
      id: id,
      students: current ? current.students : null,
      staff: current? current.staff: null,
    };

    try {
      dispatch({
        type: "UPDATE_CURRENT_USER_GROUP",
        payload: payload
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("TODO"), 'error'));
    }
  }
}

// let loadAllCurrentUserGroupStudents: LoadUsersTriggerType = function loadAllCurrentUserGroupUsers(data) {
//   return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
//     let payload:CurrentUserGroupType = {
//       id: getState().userGroups.currentUserGroup ? getState().userGroups.currentUserGroup.id : null,
//       users: null
//     };

//     try {
//       await promisify(mApi().organizationUserManagement.students.read(data.payload), 'callback')().then((result: OrganizationUsersListType) => {
//         payload.users = result;
//       }),

//       dispatch({
//         type: "UPDATE_CURRENT_USER_GROUP",
//         payload: payload
//       });

//       data.success && data.success(payload.users);

//     } catch (err) {
//       if (!(err instanceof MApiError)) {
//         throw err;
//       }
//       dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
//     }
//   }
// }

let loadAllCurrentUserGroupStaff: LoadUsersTriggerType = function loadAllCurrentUserGroupUsers(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {

    let test = getState().userGroups.currentUserGroup ? getState().userGroups.currentUserGroup : null;

    let current = getState().userGroups.currentUserGroup ? getState().userGroups.currentUserGroup : null;

    let payload:CurrentUserGroupType = {
      id: current? current.id : null,
      students: current? current.students: null,
      staff: null,
    };

    try {
      await promisify(mApi().organizationUserManagement.staffMembers.read(data.payload), 'callback')().then((result: OrganizationUsersListType) => {
        payload.staff = result;
      }),

      dispatch({
        type: "UPDATE_CURRENT_USER_GROUP",
        payload: payload
      });

      data.success && data.success(payload.staff);

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
    }
  }
}

let loadAllCurrentUserGroupStudents: LoadUsersTriggerType = function loadAllCurrentUserGroupUsers(data) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {

    let current = getState().userGroups.currentUserGroup ? getState().userGroups.currentUserGroup : null;

    let payload:CurrentUserGroupType = {
      id: current? current.id : null,
      students: null,
      staff: current? current.staff: null,
    };

    try {
      await promisify(mApi().organizationUserManagement.students.read(data.payload), 'callback')().then((result: OrganizationUsersListType) => {
        payload.students = result;
      }),

      dispatch({
        type: "UPDATE_CURRENT_USER_GROUP",
        payload: payload
      });

      data.success && data.success(payload.students);

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
    }
  }
}

// let loadAllCurrentUserGroupStaff:LoadUsersTriggerType = function loadAllCurrentUserGroupStaff(data) {
//    data.endpoint = mApi().organizationUserManagement.staff.read;
//    return loadAllCurrentUserGroupUsers.bind(this, data);
// }

// let loadAllCurrentUserGroupStudents: LoadUsersTriggerType = function loadAllCurrentUserGroupStudents(data) {
//    data.endpoint = mApi().organizationUserManagement.students.read
//    return loadAllCurrentUserGroupUsers.bind(this, data);
// }


let loadUsers: LoadUsersTriggerType = function loadUsers(data) {

  let getStudents = promisify(mApi().organizationUserManagement.students.read(data.payload), 'callback')();
  let getStaffmembers = promisify(mApi().organizationUserManagement.staffMembers.read(data.payload), 'callback')();

  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });

      await Promise.all([
        getStudents.then((users: UserPanelUsersType) => {
          let payload = { ...users, searchString: data.payload.q };

          dispatch({
            type: "UPDATE_STUDENT_USERS",
            payload: payload
          });
        }),
        getStaffmembers.then((users: UserPanelUsersType) => {
          let payload = { ...users, searchString: data.payload.q };

          dispatch({
            type: "UPDATE_STAFF_USERS",
            payload: payload
          });
        }),
      ]);
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"READY"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

let loadSelectorStudents: LoadUsersTriggerType = function loadSelectorStudents(data) {

  let getStudents = data.payload.q? mApi().organizationUserManagement.students.read(data.payload) : null;

  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      if (getStudents !== null) {
        await promisify(getStudents, 'callback')().then((users: OrganizationUsersListType) => {
          dispatch({
            type: "UPDATE_STUDENT_SELECTOR",
            payload: users.results
          });
        });
      } else {
        let payload: Partial<UsersSelectType> = { students: [] };
        dispatch({
          type: "CLEAR_USER_SELECTOR",
          payload
        });
      }
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

let loadSelectorStaff: LoadUsersTriggerType = function loadSelectorStaff(data) {

  let getStaff = data.payload.q? mApi().organizationUserManagement.staffMembers.read(data.payload) : null;

  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      if (getStaff !== null) {
        await promisify(getStaff, 'callback')().then((users: OrganizationUsersListType) => {
          dispatch({
            type: "UPDATE_STAFF_SELECTOR",
            payload: users.results
          });
        });
      } else {
        let payload: Partial<UsersSelectType> = { staff: [] };
        dispatch({
          type: "CLEAR_USER_SELECTOR",
          payload
        });
      }
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

let loadSelectorUserGroups: LoadUsersTriggerType = function loadSelectorUserGroups(data) {
  let getUserGroups = data.payload.q ? mApi().usergroup.groups.read(data.payload) : null;

  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      if (getUserGroups !== null) {
        await promisify(getUserGroups, 'callback')().then((usergGroups: UserGroupType[]) => {
          dispatch({
            type: "UPDATE_GROUP_SELECTOR",
            payload: usergGroups
          });
        });
      } else {
        let payload: Partial<UsersSelectType> = { usergroups: [] };
        dispatch({
          type: "CLEAR_USER_SELECTOR",
          payload
        });
      }
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));

      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    }
  }
}

export { loadUsers, loadAllCurrentUserGroupStaff, loadAllCurrentUserGroupStudents, updateUsergroup, setCurrentUserGroup, createUsergroup, loadStaff, loadUsergroups, loadStudents, loadSelectorStaff, loadSelectorStudents, loadSelectorUserGroups, loadStudyprogrammes, updateStaffmember, updateStudent, createStaffmember, createStudent };
