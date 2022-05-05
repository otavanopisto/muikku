import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  GuiderActiveFiltersType,
  GuiderPatchType,
  GuiderStudentsStateType,
  GuiderStudentType,
  GuiderStudentUserProfileLabelType,
  GuiderNotificationStudentsDataType,
  GuiderStudentUserProfileType,
  GuiderCurrentStudentStateType,
  GuiderType,
} from "~/reducers/main-function/guider";
import { loadStudentsHelper } from "./helpers";
import promisify from "~/util/promisify";
import {
  UserFileType,
  StudentUserProfilePhoneType,
  StudentUserProfileEmailType,
  StudentUserAddressType,
  UserGroupType,
} from "reducers/user-index";
import notificationActions from "~/actions/base/notifications";
import {
  GuiderUserLabelType,
  GuiderUserLabelListType,
  GuiderWorkspaceListType,
  GuiderUserGroupListType,
  IContactEvent,
  IContactEventComment,
  ContactTypes,
} from "~/reducers/main-function/guider";
import {
  WorkspaceListType,
  WorkspaceStudentActivityType,
  WorkspaceForumStatisticsType,
  ActivityLogType,
} from "~/reducers/workspaces";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import { colorIntToHex } from "~/util/modifiers";
import {
  PurchaseProductType,
  PurchaseType,
} from "~/reducers/main-function/profile";

export type UPDATE_GUIDER_ACTIVE_FILTERS = SpecificActionType<
  "UPDATE_GUIDER_ACTIVE_FILTERS",
  GuiderActiveFiltersType
>;
export type UPDATE_GUIDER_ALL_PROPS = SpecificActionType<
  "UPDATE_GUIDER_ALL_PROPS",
  GuiderPatchType
>;
export type UPDATE_GUIDER_STATE = SpecificActionType<
  "UPDATE_GUIDER_STATE",
  GuiderStudentsStateType
>;
export type ADD_TO_GUIDER_SELECTED_STUDENTS = SpecificActionType<
  "ADD_TO_GUIDER_SELECTED_STUDENTS",
  GuiderStudentType
>;
export type REMOVE_FROM_GUIDER_SELECTED_STUDENTS = SpecificActionType<
  "REMOVE_FROM_GUIDER_SELECTED_STUDENTS",
  GuiderStudentType
>;
export type SET_CURRENT_GUIDER_STUDENT = SpecificActionType<
  "SET_CURRENT_GUIDER_STUDENT",
  GuiderStudentUserProfileType
>;
export type SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD = SpecificActionType<
  "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD",
  null
>;
export type SET_CURRENT_GUIDER_STUDENT_PROP = SpecificActionType<
  "SET_CURRENT_GUIDER_STUDENT_PROP",
  { property: string; value: any }
>;
export type UPDATE_CURRENT_GUIDER_STUDENT_STATE = SpecificActionType<
  "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
  GuiderCurrentStudentStateType
>;
export type UPDATE_GUIDER_INSERT_PURCHASE_ORDER = SpecificActionType<
  "UPDATE_GUIDER_INSERT_PURCHASE_ORDER",
  PurchaseType
>;
export type DELETE_GUIDER_PURCHASE_ORDER = SpecificActionType<
  "DELETE_GUIDER_PURCHASE_ORDER",
  PurchaseType
>;
export type UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER = SpecificActionType<
  "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER",
  PurchaseType
>;

export type ADD_FILE_TO_CURRENT_STUDENT = SpecificActionType<
  "ADD_FILE_TO_CURRENT_STUDENT",
  UserFileType
>;
export type REMOVE_FILE_FROM_CURRENT_STUDENT = SpecificActionType<
  "REMOVE_FILE_FROM_CURRENT_STUDENT",
  UserFileType
>;
export type UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS",
  PurchaseProductType[]
>;

export type ADD_GUIDER_LABEL_TO_USER = SpecificActionType<
  "ADD_GUIDER_LABEL_TO_USER",
  {
    studentId: string;
    label: GuiderStudentUserProfileLabelType;
  }
>;
export type REMOVE_GUIDER_LABEL_FROM_USER = SpecificActionType<
  "REMOVE_GUIDER_LABEL_FROM_USER",
  {
    studentId: string;
    label: GuiderStudentUserProfileLabelType;
  }
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS",
  GuiderUserLabelListType
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES",
  GuiderWorkspaceListType
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS",
  GuiderUserGroupListType
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL",
  GuiderUserLabelType
>;
export type UPDATE_GUIDER_AVAILABLE_FILTER_LABEL = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTER_LABEL",
  {
    labelId: number;
    update: {
      name: string;
      description: string;
      color: string;
    };
  }
>;
export type UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS = SpecificActionType<
  "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS",
  {
    labelId: number;
    update: {
      flagName: string;
      flagColor: string;
    };
  }
>;
export type DELETE_GUIDER_AVAILABLE_FILTER_LABEL = SpecificActionType<
  "DELETE_GUIDER_AVAILABLE_FILTER_LABEL",
  number
>;
export type DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS = SpecificActionType<
  "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS",
  number
>;
export type TOGGLE_ALL_STUDENTS = SpecificActionType<
  "TOGGLE_ALL_STUDENTS",
  undefined
>;

export type DELETE_CONTACT_EVENT = SpecificActionType<
  "DELETE_CONTACT_EVENT",
  number
>;

export type DELETE_CONTACT_EVENT_COMMENT = SpecificActionType<
  "DELETE_CONTACT_EVENT_COMMENT",
  { contactLogEntryId: number; commentId: number }
>;

export interface LoadStudentsTriggerType {
  (filters: GuiderActiveFiltersType): AnyActionType;
}

export interface LoadMoreStudentsTriggerType {
  (): AnyActionType;
}

export interface LoadStudentTriggerType {
  (id: string, forceLoad?: boolean): AnyActionType;
}

export interface LoadStudentDataTriggerType {
  (id: number, forceLoad?: boolean): AnyActionType;
}

export interface CreateContactEventTriggerType {
  (
    userEntityId: number,
    payload: {
      text: string;
      entryDate: string;
      type: ContactTypes;
    }
  ): AnyActionType;
}

export interface DeleteContactEventTriggerType {
  (studentUserEntityId: number, contactLogEntryId: number): AnyActionType;
}
export interface EditContactEventTriggerType {
  (
    userEntityId: number,
    contactLogEntryId: number,
    payload: {
      text: string;
      entryDate: string;
      type: ContactTypes;
      creatorId: number;
    }
  ): AnyActionType;
}

export interface CreateContactEventCommentTriggerType {
  (
    userEntityId: number,
    contactLogEntryId: number,
    payload: {
      text: string;
      commentDate: string;
    }
  ): AnyActionType;
}

export interface DeleteContactEventCommentTriggerType {
  (
    studentUserEntityId: number,
    contactLogEntryId: number,
    commentId: number
  ): AnyActionType;
}
export interface EditContactEventCommentTriggerType {
  (
    userEntityId: number,
    contactLogEntryId: number,
    commentId: number,
    payload: {
      text: string;
      commentDate: string;
      creatorId: number;
    }
  ): AnyActionType;
}

export interface AddToGuiderSelectedStudentsTriggerType {
  (student: GuiderStudentType): AnyActionType;
}

export interface RemoveFromGuiderSelectedStudentsTriggerType {
  (student: GuiderStudentType): AnyActionType;
}

export interface AddGuiderLabelToCurrentUserTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

export interface RemoveGuiderLabelFromCurrentUserTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

export interface AddGuiderLabelToSelectedUsersTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

export interface RemoveGuiderLabelFromSelectedUsersTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

export interface AddFileToCurrentStudentTriggerType {
  (file: UserFileType): AnyActionType;
}

export interface RemoveFileFromCurrentStudentTriggerType {
  (file: UserFileType): AnyActionType;
}

export interface UpdateLabelFiltersTriggerType {
  (): AnyActionType;
}

export interface UpdateWorkspaceFiltersTriggerType {
  (): AnyActionType;
}

export interface CreateGuiderFilterLabelTriggerType {
  (name: string): AnyActionType;
}

export interface UpdateGuiderFilterLabelTriggerType {
  (data: {
    label: GuiderUserLabelType;
    name: string;
    description: string;
    color: string;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface RemoveGuiderFilterLabelTriggerType {
  (data: {
    label: GuiderUserLabelType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface UpdateAvailablePurchaseProductsTriggerType {
  (): AnyActionType;
}

export interface DoOrderForCurrentStudentTriggerType {
  (order: PurchaseProductType): AnyActionType;
}

export interface DeleteOrderFromCurrentStudentTriggerType {
  (order: PurchaseType): AnyActionType;
}

export interface CompleteOrderFromCurrentStudentTriggerType {
  (order: PurchaseType): AnyActionType;
}
export interface ToggleAllStudentsTriggerType {
  (): AnyActionType;
}

const toggleAllStudents: ToggleAllStudentsTriggerType =
  function toggleAllStudents() {
    return {
      type: "TOGGLE_ALL_STUDENTS",
      payload: null,
    };
  };

let addFileToCurrentStudent: AddFileToCurrentStudentTriggerType =
  function addFileToCurrentStudent(file) {
    return {
      type: "ADD_FILE_TO_CURRENT_STUDENT",
      payload: file,
    };
  };

/**
 *
 * @param file
 * @returns a thunk function
 */

const removeFileFromCurrentStudent: RemoveFileFromCurrentStudentTriggerType =
  function removeFileFromCurrentStudent(file) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(mApi().guider.files.del(file.id), "callback")();
        dispatch({
          type: "REMOVE_FILE_FROM_CURRENT_STUDENT",
          payload: file,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errormessage.fileRemoveFailed"
            ),
            "error"
          )
        );
      }
    };
  };

let loadStudents: LoadStudentsTriggerType = function loadStudents(filters) {
  return loadStudentsHelper.bind(this, filters, true);
};

let loadMoreStudents: LoadMoreStudentsTriggerType =
  function loadMoreStudents() {
    return loadStudentsHelper.bind(this, null, false);
  };

let addToGuiderSelectedStudents: AddToGuiderSelectedStudentsTriggerType =
  function addToGuiderSelectedStudents(student) {
    return {
      type: "ADD_TO_GUIDER_SELECTED_STUDENTS",
      payload: student,
    };
  };

let removeFromGuiderSelectedStudents: RemoveFromGuiderSelectedStudentsTriggerType =
  function removeFromGuiderSelectedStudents(student) {
    return {
      type: "REMOVE_FROM_GUIDER_SELECTED_STUDENTS",
      payload: student,
    };
  };

/**
 * loadStudent thunk action creator
 * @param id
 * @returns a thunk function
 */
const loadStudent: LoadStudentTriggerType = function loadStudent(id) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      const currentUserSchoolDataIdentifier =
        getState().status.userSchoolDataIdentifier;

      const canListUserOrders = getState().status.permissions.LIST_USER_ORDERS;

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      dispatch({
        type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
        payload: <GuiderCurrentStudentStateType>"LOADING",
      });

      await Promise.all([
        promisify(mApi().guider.students.read(id), "callback")().then(
          (basic: GuiderStudentType) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "basic", value: basic },
            });
          }
        ),
        promisify(
          mApi().usergroup.groups.read({ userIdentifier: id }),
          "callback"
        )().then((usergroups: UserGroupType[]) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "usergroups", value: usergroups },
          });
        }),
        promisify(
          mApi().user.students.flags.read(id, {
            ownerIdentifier: currentUserSchoolDataIdentifier,
          }),
          "callback"
        )().then((labels: Array<GuiderStudentUserProfileLabelType>) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "labels", value: labels },
          });
        }),
        promisify(
          mApi().user.students.phoneNumbers.read(id),
          "callback"
        )().then((phoneNumbers: Array<StudentUserProfilePhoneType>) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "phoneNumbers", value: phoneNumbers },
          });
        }),
        promisify(mApi().user.students.emails.read(id), "callback")().then(
          (emails: Array<StudentUserProfileEmailType>) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "emails", value: emails },
            });
          }
        ),
        promisify(mApi().user.students.addresses.read(id), "callback")().then(
          (addresses: Array<StudentUserAddressType>) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "addresses", value: addresses },
            });
          }
        ),
        promisify(mApi().guider.users.files.read(id), "callback")().then(
          (files: Array<UserFileType>) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "files", value: files },
            });
          }
        ),
        promisify(mApi().records.hops.read(id), "callback")().then(
          (hops: HOPSDataType) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "hops", value: hops },
            });
          }
        ),
        promisify(
          mApi().guider.users.latestNotifications.read(id),
          "callback"
        )().then((notifications: GuiderNotificationStudentsDataType) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "notifications", value: notifications },
          });
        }),
        promisify(
          mApi().workspace.workspaces.read({
            userIdentifier: id,
            includeInactiveWorkspaces: false,
          }),
          "callback"
        )().then(async (workspaces: WorkspaceListType) => {
          if (workspaces && workspaces.length) {
            await Promise.all([
              Promise.all(
                workspaces.map(async (workspace, index) => {
                  let activity: WorkspaceStudentActivityType = <
                    WorkspaceStudentActivityType
                  >await promisify(
                    mApi().guider.workspaces.studentactivity.read(
                      workspace.id,
                      id
                    ),
                    "callback"
                  )();
                  workspaces[index].studentActivity = activity;
                })
              ),
              Promise.all(
                workspaces.map(async (workspace, index) => {
                  let statistics: WorkspaceForumStatisticsType = <
                    WorkspaceForumStatisticsType
                  >await promisify(
                    mApi().workspace.workspaces.forumStatistics.read(
                      workspace.id,
                      { userIdentifier: id }
                    ),
                    "callback"
                  )();
                  workspaces[index].forumStatistics = statistics;
                })
              ),
              Promise.all(
                workspaces.map(async (workspace, index) => {
                  let activityLogs: ActivityLogType[] = <ActivityLogType[]>(
                    await promisify(
                      mApi().activitylogs.user.workspace.read(id, {
                        workspaceEntityId: workspace.id,
                        from: new Date(new Date().getFullYear() - 2, 0),
                        to: new Date(),
                      }),
                      "callback"
                    )()
                  );
                  workspaces[index].activityLogs = activityLogs;
                })
              ),
            ]);
          }
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "currentWorkspaces", value: workspaces },
          });
        }),
        canListUserOrders &&
          promisify(mApi().ceepos.user.orders.read(id), "callback")().then(
            (pOrders: PurchaseType[]) => {
              dispatch({
                type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                payload: { property: "purchases", value: pOrders },
              });
            }
          ),
      ]);

      dispatch({
        type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
        payload: <GuiderCurrentStudentStateType>"READY",
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
        type: "UPDATE_GUIDER_ALL_PROPS",
        payload: {
          currentState: <GuiderCurrentStudentStateType>"ERROR",
        },
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadStudentHistory thunk action creator
 * @param id student id
 * @param forceLoad should the history load be forced
 * @returns a thunk function
 */
const loadStudentHistory: LoadStudentTriggerType = function loadStudentHistory(
  id,
  forceLoad
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      const historyLoaded = !!getState().guider.currentStudent.pastWorkspaces;

      if (historyLoaded && !forceLoad) {
        return;
      }

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      dispatch({
        type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
        payload: <GuiderCurrentStudentStateType>"LOADING",
      });

      await Promise.all([
        promisify(
          mApi().workspace.workspaces.read({
            userIdentifier: id,
            includeInactiveWorkspaces: true,
          }),
          "callback"
        )().then(async (workspaces: WorkspaceListType) => {
          if (workspaces && workspaces.length) {
            await Promise.all([
              Promise.all(
                workspaces.map(async (workspace, index) => {
                  const activity: WorkspaceStudentActivityType = <
                    WorkspaceStudentActivityType
                  >await promisify(
                    mApi().guider.workspaces.studentactivity.read(
                      workspace.id,
                      id
                    ),
                    "callback"
                  )();
                  workspaces[index].studentActivity = activity;
                })
              ),
              Promise.all(
                workspaces.map(async (workspace, index) => {
                  const statistics: WorkspaceForumStatisticsType = <
                    WorkspaceForumStatisticsType
                  >await promisify(
                    mApi().workspace.workspaces.forumStatistics.read(
                      workspace.id,
                      { userIdentifier: id }
                    ),
                    "callback"
                  )();
                  workspaces[index].forumStatistics = statistics;
                })
              ),
              Promise.all(
                workspaces.map(async (workspace, index) => {
                  const activityLogs: ActivityLogType[] = <ActivityLogType[]>(
                    await promisify(
                      mApi().activitylogs.user.workspace.read(id, {
                        workspaceEntityId: workspace.id,
                        from: new Date(new Date().getFullYear() - 2, 0),
                        to: new Date(),
                      }),
                      "callback"
                    )()
                  );
                  workspaces[index].activityLogs = activityLogs;
                })
              ),
            ]);
          }
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "pastWorkspaces", value: workspaces },
          });
        }),
        promisify(
          mApi().activitylogs.user.workspace.read(id, {
            from: new Date(new Date().getFullYear() - 2, 0),
            to: new Date(),
          }),
          "callback"
        )().then((activityLogs: ActivityLogType[]) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "activityLogs", value: activityLogs },
          });
        }),
      ]);
      dispatch({
        type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
        payload: <GuiderCurrentStudentStateType>"READY",
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
        type: "UPDATE_GUIDER_ALL_PROPS",
        payload: {
          currentState: <GuiderCurrentStudentStateType>"ERROR",
        },
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/**
 * loadStudentGuiderRelations thunk action creator
 * @param id student id
 * @param forceLoad should the guiderRelation load be forced
 * @returns a thunk function
 */
const loadStudentGuiderRelations: LoadStudentDataTriggerType =
  function loadStudentGuiderRelations(id, forceLoad) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const contactLogsLoaded =
          !!getState().guider.currentStudent.contactLogs;

        if (contactLogsLoaded && !forceLoad) {
          return;
        }

        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        dispatch({
          type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
          payload: <GuiderCurrentStudentStateType>"LOADING",
        });

        await promisify(
          mApi().guider.users.contactLog.read(id),
          "callback"
        )().then((contactLogs: IContactEvent[]) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "contactLogs", value: contactLogs },
          });
        });

        dispatch({
          type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
          payload: <GuiderCurrentStudentStateType>"READY",
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
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

/** createContactEvent thunk action creator
 * @param userEntityId id for the user in subject
 * @param payload event data payload
 * @returns a thunk function
 */
const createContactEvent: CreateContactEventTriggerType =
  function createContactEvent(userEntityId, payload) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const contactLogs = getState().guider.currentStudent.contactLogs;
        await promisify(
          mApi().guider.student.contactLog.create(userEntityId, payload),
          "callback"
        )().then((contactLog: IContactEvent) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: [...contactLogs, ...[contactLog]],
            },
          });
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
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

/** deleteContactEvent thunk action creator
 * @param userEntityId id for the user in subject
 * @param payload event data payload
 * @returns a thunk function
 */
const deleteContactEvent: DeleteContactEventTriggerType =
  function deleteContactEvent(studentUserEntityId, contactLogEntryId) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().guider.student.contactLog.del(
            studentUserEntityId,
            contactLogEntryId
          ),
          "callback"
        )();

        dispatch({
          type: "DELETE_CONTACT_EVENT",
          payload: contactLogEntryId,
        });

        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("TODO"),
            "success"
          )
        );
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
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
      }
    };
  };

/**
 * editContactEvent thunk action creator
 * @param userEntityId student user id
 * @param contactLogEntryId id of the edited contact log
 * @param payload edit payload
 * @returns a thunk function
 */
const editContactEvent: EditContactEventTriggerType = function editContactEvent(
  userEntityId,
  contactLogEntryId,
  payload
) {
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
        mApi().guider.student.contactLog.update(
          userEntityId,
          contactLogEntryId,
          payload
        ),
        "callback"
      )().then((contactLog: IContactEvent) => {
        // Make a shallow copy of the current state of contactLogs
        const contactLogs = [...getState().guider.currentStudent.contactLogs];

        // Find the index of the edited contactLog
        const contactLogIndex = contactLogs.findIndex(
          (log) => log.id === contactLog.id
        );

        // Replace the edited contactLog with the new one
        contactLogs.splice(contactLogIndex, 1, contactLog);

        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogs",
            value: contactLogs,
          },
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
          "error"
        )
      );
      dispatch({
        type: "UPDATE_GUIDER_ALL_PROPS",
        payload: {
          currentState: <GuiderCurrentStudentStateType>"ERROR",
        },
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

/** createContactEventComment thunk action creator
 * @param userEntityId id for the user in subject
 * @param entryId id for the entry to be replied
 * @param payload event data payload
 * @returns a thunk function
 */
const createContactEventComment: CreateContactEventCommentTriggerType =
  function createContactEventComment(userEntityId, entryId, payload) {
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
          mApi().guider.student.contactLog.comments.create(
            userEntityId,
            entryId,
            payload
          ),
          "callback"
        )().then((comment: IContactEventComment) => {
          // Make a shallow copy of the current state contactLogs
          const contactLogs = [...getState().guider.currentStudent.contactLogs];

          // Add the new comment to the current contactEvent
          const contactEvent = contactLogs.find(
            (log) => log.id === comment.entry
          );
          contactEvent.comments.push(comment);

          // Find the index of the updated contactevent
          const contactEventIndex = contactLogs.findIndex(
            (log) => log.id === contactEvent.id
          );

          // Replace the existing contactEvent at the correct index
          contactLogs.splice(contactEventIndex, 1, contactEvent);

          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: contactLogs,
            },
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
            "error"
          )
        );
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

/** deleteContactEventComment thunk action creator
 * @param studentUserEntityId id for the user in subject
 * @param contactLogEntryId id of the contactLogEntry
 * @param commentId id for the comment
 * @returns a thunk function
 */
const deleteContactEventComment: DeleteContactEventCommentTriggerType =
  function deleteContactEventComment(
    studentUserEntityId,
    contactLogEntryId,
    commentId
  ) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().guider.student.contactLog.comments.del(
            studentUserEntityId,
            contactLogEntryId,
            commentId
          ),
          "callback"
        )();

        dispatch({
          type: "DELETE_CONTACT_EVENT_COMMENT",
          payload: { contactLogEntryId, commentId },
        });

        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("TODO"),
            "success"
          )
        );
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
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
      }
    };
  };

/** editContactEventComment thunk action creator
 * @param userEntityId id for the user in subject
 * @param entryId id for the entry to be replied
 * @param payload event data payload
 * @returns a thunk function
 */
const editContactEventComment: EditContactEventCommentTriggerType =
  function editContactEventComment(
    userEntityId,
    contactLogEntryId,
    commentId,
    payload
  ) {
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
          mApi().guider.student.contactLog.comments.update(
            userEntityId,
            contactLogEntryId,
            commentId,
            payload
          ),
          "callback"
        )().then((comment: IContactEventComment) => {
          // Make a shallow copy of the current state contactLogs
          const contactLogs = [...getState().guider.currentStudent.contactLogs];

          // find the current contactEvent
          const contactEvent = contactLogs.find(
            (log) => log.id === comment.entry
          );

          // get the index number of the comment inside the contactEvent
          const commmentIndex = contactEvent.comments.findIndex(
            (c) => c.id === comment.id
          );

          // replace the comment with the updated comment
          contactEvent.comments.splice(commmentIndex, 1, comment);

          // find the index of the current contactEvent
          const contactEventIndex = contactLogs.findIndex(
            (log) => log.id === contactEvent.id
          );

          // Replace the existing contactEvent at the correct index
          contactLogs.splice(contactEventIndex, 1, contactEvent);

          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: contactLogs,
            },
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
            "error"
          )
        );
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

async function removeLabelFromUserUtil(
  student: GuiderStudentType,
  flags: Array<GuiderStudentUserProfileLabelType>,
  label: GuiderUserLabelType,
  dispatch: (arg: AnyActionType) => any,
  getState: () => StateType
) {
  try {
    let relationLabel: GuiderStudentUserProfileLabelType = flags.find(
      (flag) => flag.flagId === label.id
    );
    if (relationLabel) {
      await promisify(
        mApi().user.students.flags.del(student.id, relationLabel.id),
        "callback"
      )();
      dispatch({
        type: "REMOVE_GUIDER_LABEL_FROM_USER",
        payload: {
          studentId: student.id,
          label: relationLabel,
        },
      });
    }
  } catch (err) {
    if (!(err instanceof MApiError)) {
      throw err;
    }
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get("plugin.guider.errormessage.label.remove"),
        "error"
      )
    );
  }
}

async function addLabelToUserUtil(
  student: GuiderStudentType,
  flags: Array<GuiderStudentUserProfileLabelType>,
  label: GuiderUserLabelType,
  dispatch: (arg: AnyActionType) => any,
  getState: () => StateType
) {
  try {
    let relationLabel: GuiderStudentUserProfileLabelType = flags.find(
      (flag) => flag.flagId === label.id
    );
    if (!relationLabel) {
      let createdLabelRelation: GuiderStudentUserProfileLabelType = <
        GuiderStudentUserProfileLabelType
      >await promisify(
        mApi().user.students.flags.create(student.id, {
          flagId: label.id,
          studentIdentifier: student.id,
        }),
        "callback"
      )();
      dispatch({
        type: "ADD_GUIDER_LABEL_TO_USER",
        payload: {
          studentId: student.id,
          label: createdLabelRelation,
        },
      });
    }
  } catch (err) {
    if (!(err instanceof MApiError)) {
      throw err;
    }
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get("plugin.guider.errormessage.label.add"),
        "error"
      )
    );
  }
}

let addGuiderLabelToCurrentUser: AddGuiderLabelToCurrentUserTriggerType =
  function addGuiderLabelToCurrentUser(label) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let guider: GuiderType = getState().guider;
      let student = guider.currentStudent;
      addLabelToUserUtil(
        student.basic,
        student.labels,
        label,
        dispatch,
        getState
      );
    };
  };

let removeGuiderLabelFromCurrentUser: RemoveGuiderLabelFromCurrentUserTriggerType =
  function removeGuiderLabelFromCurrentUser(label) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let guider: GuiderType = getState().guider;
      let student = guider.currentStudent;
      removeLabelFromUserUtil(
        student.basic,
        student.labels,
        label,
        dispatch,
        getState
      );
    };
  };

let addGuiderLabelToSelectedUsers: AddGuiderLabelToSelectedUsersTriggerType =
  function addGuiderLabelToSelectedUsers(label) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let guider: GuiderType = getState().guider;
      guider.selectedStudents.forEach((student: GuiderStudentType) => {
        addLabelToUserUtil(student, student.flags, label, dispatch, getState);
      });
    };
  };

let removeGuiderLabelFromSelectedUsers: RemoveGuiderLabelFromSelectedUsersTriggerType =
  function removeGuiderLabelFromSelectedUsers(label) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let guider: GuiderType = getState().guider;
      guider.selectedStudents.forEach((student: GuiderStudentType) => {
        removeLabelFromUserUtil(
          student,
          student.flags,
          label,
          dispatch,
          getState
        );
      });
    };
  };

let updateLabelFilters: UpdateLabelFiltersTriggerType =
  function updateLabelFilters() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let currentUser = getState().status.userSchoolDataIdentifier;
      try {
        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS",
          payload: <GuiderUserLabelListType>await promisify(
              mApi().user.flags.read({
                ownerIdentifier: currentUser,
              }),
              "callback"
            )() || [],
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.labels"),
            "error"
          )
        );
      }
    };
  };

let updateWorkspaceFilters: UpdateWorkspaceFiltersTriggerType =
  function updateWorkspaceFilters() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let currentUser = getState().status.userSchoolDataIdentifier;
      try {
        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES",
          payload: <GuiderWorkspaceListType>await promisify(
              mApi().workspace.workspaces.read({
                userIdentifier: currentUser,
                includeInactiveWorkspaces: true,
                maxResults: 500,
                orderBy: "alphabet",
              }),
              "callback"
            )() || [],
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.workspaces"),
            "error"
          )
        );
      }
    };
  };

let updateUserGroupFilters: UpdateWorkspaceFiltersTriggerType =
  function updateUserGroupFilters() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let currentUser = getState().status.userSchoolDataIdentifier;
      try {
        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS",
          payload: <GuiderUserGroupListType>await promisify(
              mApi().usergroup.groups.read({
                userIdentifier: currentUser,
                maxResults: 500,
              }),
              "callback"
            )() || [],
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.userGroups"),
            "error"
          )
        );
      }
    };
  };

let createGuiderFilterLabel: CreateGuiderFilterLabelTriggerType =
  function createGuiderFilterLabel(name) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      if (!name) {
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errormessage.createUpdateLabels.missing.title"
            ),
            "error"
          )
        );
      }

      let currentUserSchoolDataIdentifier =
        getState().status.userSchoolDataIdentifier;

      let color: number = Math.round(Math.random() * 16777215);
      let label = {
        name,
        color: colorIntToHex(color),
        description: "",
        ownerIdentifier: currentUserSchoolDataIdentifier,
      };

      try {
        let newLabel: GuiderUserLabelType = <GuiderUserLabelType>(
          await promisify(mApi().user.flags.create(label), "callback")()
        );
        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL",
          payload: newLabel,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.label.create"),
            "error"
          )
        );
      }
    };
  };

let updateGuiderFilterLabel: UpdateGuiderFilterLabelTriggerType =
  function updateGuiderFilterLabel(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      if (!data.name) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errormessage.createUpdateLabels.missing.title"
            ),
            "error"
          )
        );
      }

      let newLabel: GuiderUserLabelType = Object.assign({}, data.label, {
        name: data.name,
        description: data.description,
        color: data.color,
      });

      try {
        await promisify(
          mApi().user.flags.update(data.label.id, newLabel),
          "callback"
        )();
        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTER_LABEL",
          payload: {
            labelId: newLabel.id,
            update: {
              name: data.name,
              description: data.description,
              color: data.color,
            },
          },
        });
        dispatch({
          type: "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS",
          payload: {
            labelId: newLabel.id,
            update: {
              flagName: data.name,
              flagColor: data.color,
            },
          },
        });
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.label.update"),
            "error"
          )
        );
      }
    };
  };

let removeGuiderFilterLabel: RemoveGuiderFilterLabelTriggerType =
  function removeGuiderFilterLabel(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(mApi().user.flags.del(data.label.id), "callback")();
        dispatch({
          type: "DELETE_GUIDER_AVAILABLE_FILTER_LABEL",
          payload: data.label.id,
        });
        dispatch({
          type: "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS",
          payload: data.label.id,
        });
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.label.remove"),
            "error"
          )
        );
      }
    };
  };

const updateAvailablePurchaseProducts: UpdateAvailablePurchaseProductsTriggerType =
  function updateAvailablePurchaseProducts() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const value: PurchaseProductType[] = (await promisify(
          mApi().ceepos.products.read(),
          "callback"
        )()) as any;
        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS",
          payload: value,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errormessage.purchaseproducts"
            ),
            "error"
          )
        );
      }
    };
  };

const doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType =
  function doOrderForCurrentStudent(order: PurchaseProductType) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const state = getState();
        const value: PurchaseType = (await promisify(
          mApi().ceepos.order.create({
            studentIdentifier: state.guider.currentStudent.basic.id,
            product: order,
          }),
          "callback"
        )()) as any;
        dispatch({
          type: "UPDATE_GUIDER_INSERT_PURCHASE_ORDER",
          payload: value,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errormessage.purchasefailed"
            ),
            "error"
          )
        );
      }
    };
  };

const deleteOrderFromCurrentStudent: DeleteOrderFromCurrentStudentTriggerType =
  function deleteOrderFromCurrentStudent(order: PurchaseType) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(mApi().ceepos.order.del(order.id), "callback")();
        dispatch({
          type: "DELETE_GUIDER_PURCHASE_ORDER",
          payload: order,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get("plugin.guider.errormessage.deletefailed"),
            "error"
          )
        );
      }
    };
  };

const completeOrderFromCurrentStudent: CompleteOrderFromCurrentStudentTriggerType =
  function completeOrderFromCurrentStudent(order: PurchaseType) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const value: PurchaseType = (await promisify(
          mApi().ceepos.manualCompletion.create(order.id),
          "callback"
        )()) as any;

        dispatch({
          type: "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER",
          payload: value,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errormessage.completefailed"
            ),
            "error"
          )
        );
      }
    };
  };

export {
  loadStudents,
  loadMoreStudents,
  loadStudent,
  loadStudentHistory,
  loadStudentGuiderRelations,
  createContactEvent,
  deleteContactEvent,
  editContactEvent,
  createContactEventComment,
  deleteContactEventComment,
  editContactEventComment,
  addToGuiderSelectedStudents,
  removeFromGuiderSelectedStudents,
  addGuiderLabelToCurrentUser,
  removeGuiderLabelFromCurrentUser,
  addGuiderLabelToSelectedUsers,
  removeGuiderLabelFromSelectedUsers,
  addFileToCurrentStudent,
  removeFileFromCurrentStudent,
  updateLabelFilters,
  updateWorkspaceFilters,
  createGuiderFilterLabel,
  updateGuiderFilterLabel,
  removeGuiderFilterLabel,
  toggleAllStudents,
  updateAvailablePurchaseProducts,
  updateUserGroupFilters,
  doOrderForCurrentStudent,
  deleteOrderFromCurrentStudent,
  completeOrderFromCurrentStudent,
};
