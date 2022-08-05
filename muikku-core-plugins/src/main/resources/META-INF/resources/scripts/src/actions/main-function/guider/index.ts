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
  IContactLogEvent,
  IContactLogs,
  IContactLogEventComment,
  ContactTypes,
} from "~/reducers/main-function/guider";
import {
  WorkspaceListType,
  WorkspaceForumStatisticsType,
  ActivityLogType,
  WorkspaceStudentActivityType,
} from "~/reducers/workspaces";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import { colorIntToHex } from "~/util/modifiers";
import { Dispatch } from "react-redux";
import {
  PurchaseProductType,
  PurchaseType,
} from "~/reducers/main-function/profile";
import { LoadingState } from "~/@types/shared";

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
  { property: keyof GuiderStudentUserProfileType; value: any }
>;

export type UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE = SpecificActionType<
  "UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE",
  { property: "hopsPhase"; value: number }
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
/**
 * LoadStudentsTriggerType action creator type
 */
export interface LoadStudentsTriggerType {
  (filters: GuiderActiveFiltersType): AnyActionType;
}
/**
 * LoadMoreStudentsTriggerType action creator type
 */
export interface LoadMoreStudentsTriggerType {
  (): AnyActionType;
}
/**
 * LoadStudentTriggerType action creator type
 */
export interface LoadStudentTriggerType {
  (id: string, forceLoad?: boolean): AnyActionType;
}
/**
 * action creator type
 */
export interface LoadStudentDataTriggerType {
  (id: number, forceLoad?: boolean): AnyActionType;
}

/**
 * action creator type
 */
export interface LoadContactLogsTriggerType {
  (
    id: number,
    resultsPerPage: number,
    page: number,
    forceLoad?: boolean
  ): AnyActionType;
}
/**
 * action creator type
 */
export interface CreateContactLogEventTriggerType {
  (
    userEntityId: number,
    payload: {
      text: string;
      entryDate: string;
      type: ContactTypes;
    },
    onSuccess?: () => void,
    onFail?: () => void
  ): AnyActionType;
}

/**
 * DeleteContactLogEventTriggerType action creator type
 */
export interface DeleteContactLogEventTriggerType {
  (
    studentUserEntityId: number,
    contactLogEntryId: number,
    onSuccess?: () => void,
    onFail?: () => void
  ): AnyActionType;
}
/**
 * EditContactLogEventTriggerType action creator type
 */
export interface EditContactLogEventTriggerType {
  (
    userEntityId: number,
    contactLogEntryId: number,
    payload: {
      text: string;
      entryDate: string;
      type: ContactTypes;
      creatorId: number;
    },
    onSuccess?: () => void,
    onFail?: () => void
  ): AnyActionType;
}
/**
 * CreateContactLogEventCommentTriggerType action creator type
 */
export interface CreateContactLogEventCommentTriggerType {
  (
    userEntityId: number,
    contactLogEntryId: number,
    payload: {
      text: string;
      commentDate: string;
    },
    onSuccess?: () => void,
    onFail?: () => void
  ): AnyActionType;
}
/**
 * DeleteContactLogEventCommentTriggerType action creator type
 */
export interface DeleteContactLogEventCommentTriggerType {
  (
    studentUserEntityId: number,
    contactLogEntryId: number,
    commentId: number,
    onSuccess?: () => void,
    onFail?: () => void
  ): AnyActionType;
}
/**
 * EditContactLogEventCommentTriggerType action creator type
 */
export interface EditContactLogEventCommentTriggerType {
  (
    userEntityId: number,
    contactLogEntryId: number,
    commentId: number,
    payload: {
      text: string;
      commentDate: string;
      creatorId: number;
    },
    onSuccess?: () => void,
    onFail?: () => void
  ): AnyActionType;
}

/**
 * AddToGuiderSelectedStudentsTriggerType action creator type
 */
export interface AddToGuiderSelectedStudentsTriggerType {
  (student: GuiderStudentType): AnyActionType;
}

/**
 * RemoveFromGuiderSelectedStudentsTriggerType action creator type
 */
export interface RemoveFromGuiderSelectedStudentsTriggerType {
  (student: GuiderStudentType): AnyActionType;
}

/**
 * AddGuiderLabelToCurrentUserTriggerType action creator type
 */
export interface AddGuiderLabelToCurrentUserTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

/**
 * RemoveGuiderLabelFromCurrentUserTriggerType action creator type
 */
export interface RemoveGuiderLabelFromCurrentUserTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}
/**
 * AddGuiderLabelToSelectedUsersTriggerType action creator type
 */
export interface AddGuiderLabelToSelectedUsersTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

/**
 * RemoveGuiderLabelFromSelectedUsersTriggerType action creator type
 */
export interface RemoveGuiderLabelFromSelectedUsersTriggerType {
  (label: GuiderUserLabelType): AnyActionType;
}

/**
 * AddFileToCurrentStudentTriggerType action creator type
 */
export interface AddFileToCurrentStudentTriggerType {
  (file: UserFileType): AnyActionType;
}

/**
 * RemoveFileFromCurrentStudentTriggerType action creator type
 */
export interface RemoveFileFromCurrentStudentTriggerType {
  (file: UserFileType): AnyActionType;
}

/**
 * UpdateLabelFiltersTriggerType action creator type
 */
export interface UpdateLabelFiltersTriggerType {
  (): AnyActionType;
}

/**
 * UpdateWorkspaceFiltersTriggerType action creator type
 */
export interface UpdateWorkspaceFiltersTriggerType {
  (): AnyActionType;
}

/**
 * CreateGuiderFilterLabelTriggerType action creator type
 */
export interface CreateGuiderFilterLabelTriggerType {
  (name: string): AnyActionType;
}

/**
 * UpdateGuiderFilterLabelTriggerType action creator type
 */
export interface UpdateGuiderFilterLabelTriggerType {
  (data: {
    label: GuiderUserLabelType;
    name: string;
    description: string;
    color: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateCurrentStudentHopsPhaseTriggerType action creator type
 */
export interface UpdateCurrentStudentHopsPhaseTriggerType {
  (data: { value: string }): AnyActionType;
}

/**
 * RemoveGuiderFilterLabelTriggerType action creator type
 */
export interface RemoveGuiderFilterLabelTriggerType {
  (data: {
    label: GuiderUserLabelType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateAvailablePurchaseProductsTriggerType action creator type
 */
export interface UpdateAvailablePurchaseProductsTriggerType {
  (): AnyActionType;
}

/**
 * DoOrderForCurrentStudentTriggerType action creator type
 */
export interface DoOrderForCurrentStudentTriggerType {
  (order: PurchaseProductType): AnyActionType;
}

/**
 * DeleteOrderFromCurrentStudentTriggerType action creator type
 */
export interface DeleteOrderFromCurrentStudentTriggerType {
  (order: PurchaseType): AnyActionType;
}

/**
 * CompleteOrderFromCurrentStudentTriggerType action creator type
 */
export interface CompleteOrderFromCurrentStudentTriggerType {
  (order: PurchaseType): AnyActionType;
}

/**
 * ToggleAllStudentsTriggerType
 */
export interface ToggleAllStudentsTriggerType {
  (): AnyActionType;
}

/**
 * toggleAllStudents thunk action creator
 * @returns a thunk function for toggling all students selection
 */
const toggleAllStudents: ToggleAllStudentsTriggerType =
  function toggleAllStudents() {
    return {
      type: "TOGGLE_ALL_STUDENTS",
      payload: null,
    };
  };

/**
 * addFileToCurrentStudent thunk action creator
 * @param file file to be added
 * @returns thunk action for adding a file to a student
 */
const addFileToCurrentStudent: AddFileToCurrentStudentTriggerType =
  function addFileToCurrentStudent(file) {
    return {
      type: "ADD_FILE_TO_CURRENT_STUDENT",
      payload: file,
    };
  };

/**
 * removeFileFromCurrentStudent thunk action creator
 * @param file file to be removed
 * @returns a thunk function for removing a file from a student
 */
const removeFileFromCurrentStudent: RemoveFileFromCurrentStudentTriggerType =
  function removeFileFromCurrentStudent(file) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
/**
 * loadStudents thunk action creator
 * @param filters filters to be applied
 * @returns a thunk function through helper to load students
 */
const loadStudents: LoadStudentsTriggerType = function loadStudents(filters) {
  return loadStudentsHelper.bind(this, filters, true);
};

/**
 * loadMoreStudents thunk action creator
 * @returns a thunk function for loading more students
 */
const loadMoreStudents: LoadMoreStudentsTriggerType =
  function loadMoreStudents() {
    return loadStudentsHelper.bind(this, null, false);
  };

/**
 * addToGuiderSelectedStudents thunk action creator
 * @param student student to be added
 * @returns a thunk function for selecting a student
 */
const addToGuiderSelectedStudents: AddToGuiderSelectedStudentsTriggerType =
  function addToGuiderSelectedStudents(student) {
    return {
      type: "ADD_TO_GUIDER_SELECTED_STUDENTS",
      payload: student,
    };
  };

/**
 * removeFromGuiderSelectedStudents thunk action creator
 * @param student student to be removed
 * @returns a thunk function for removing from student selection
 */
const removeFromGuiderSelectedStudents: RemoveFromGuiderSelectedStudentsTriggerType =
  function removeFromGuiderSelectedStudents(student) {
    return {
      type: "REMOVE_FROM_GUIDER_SELECTED_STUDENTS",
      payload: student,
    };
  };

/**
 * loadStudent thunk action creator
 * @param id student id
 * @returns a thunk function for loading the student data
 */
const loadStudent: LoadStudentTriggerType = function loadStudent(id) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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

            // After basic data is loaded, check if current user of guider has permissions
            // to see/use current student hops
            promisify(mApi().hops.isHopsAvailable.read(id), "callback")().then(
              (hopsAvailable: boolean) => {
                dispatch({
                  type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                  payload: {
                    property: "hopsAvailable",
                    value: hopsAvailable,
                  },
                });

                // after basic data is loaded and hops availability checked, then check if hopsPhase property
                // is used and what values it contains
                promisify(
                  mApi().user.properties.read(basic.userEntityId, {
                    properties: "hopsPhase",
                  }),
                  "callback"
                )().then((properties: any) => {
                  dispatch({
                    type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                    payload: {
                      property: "hopsPhase",
                      value: properties[0].value,
                    },
                  });
                });
              }
            );
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
          mApi().guider.students.workspaces.read(id),
          "callback"
        )().then(async (workspaces: WorkspaceListType) => {
          if (workspaces && workspaces.length) {
            await Promise.all([
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
 * @returns a thunk function for loading the student history tab
 */
const loadStudentHistory: LoadStudentTriggerType = function loadStudentHistory(
  id,
  forceLoad
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    try {
      const historyLoaded = !!getState().guider.currentStudent.pastWorkspaces;

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      dispatch({
        type: "SET_CURRENT_GUIDER_STUDENT_PROP",
        payload: {
          property: "activityLogState",
          value: <LoadingState>"LOADING",
        },
      });

      const promises = [
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
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "activityLogState",
              value: <LoadingState>"READY",
            },
          });
        }),
      ];
      if (!historyLoaded || forceLoad) {
        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "pastWorkspacesState",
            value: <LoadingState>"LOADING",
          },
        });
        promises.push(
          promisify(
            mApi().guider.students.workspaces.read(id),
            "callback"
          )().then(async (workspaces: WorkspaceListType) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "pastWorkspaces", value: workspaces },
            });
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: {
                property: "pastWorkspacesState",
                value: <LoadingState>"READY",
              },
            });
          })
        );
      }

      await Promise.all([promises]);

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
        type: "SET_CURRENT_GUIDER_STUDENT_PROP",
        payload: {
          property: "pastWorkspacesState",
          value: <LoadingState>"ERROR",
        },
      });
      dispatch({
        type: "SET_CURRENT_GUIDER_STUDENT_PROP",
        payload: {
          property: "activityLogState",
          value: <LoadingState>"ERROR",
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
 * @returns a thunk function for loading guidance relations tab
 */
const loadStudentGuiderRelations: LoadStudentDataTriggerType =
  function loadStudentGuiderRelations(id, forceLoad) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const contactLogsLoaded =
          getState().guider.currentStudent.contactLogState === "READY";

        if (contactLogsLoaded && !forceLoad) {
          return;
        }

        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogState",
            value: <LoadingState>"LOADING",
          },
        });

        await promisify(
          mApi().guider.users.contactLog.read(id),
          "callback"
        )().then((contactLogs: IContactLogs) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "contactLogs", value: contactLogs },
          });
        });

        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogState",
            value: <LoadingState>"READY",
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
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogState",
            value: <LoadingState>"ERROR",
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
 * loadStudentContactLogs thunk action creator
 * @param id student id
 * @param resultsPerPage results per page
 * @param page results per page
 * @param forceLoad forces the load
 * @returns a thunk function for loading guidance relations tab
 */
const loadStudentContactLogs: LoadContactLogsTriggerType =
  function loadStudentContactLogs(id, resultsPerPage, page, forceLoad) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const contactLogsLoaded =
          getState().guider.currentStudent.contactLogState === "READY";

        if (contactLogsLoaded && !forceLoad) {
          return;
        }

        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogState",
            value: <LoadingState>"LOADING",
          },
        });
        await promisify(
          mApi().guider.users.contactLog.read(id, { resultsPerPage, page }),
          "callback"
        )().then((contactLogs: IContactLogs) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "contactLogs", value: contactLogs },
          });
        });
        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogState",
            value: <LoadingState>"READY",
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
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "contactLogState",
            value: <LoadingState>"ERROR",
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
 * createContactLogEvent thunk action creator
 * @param studentUserEntityId id for the student in subject
 * @param payload event data payload
 * @param onSuccess callback
 * @param onFail callback
 * @returns a thunk function for creating a contact log event
 */
const createContactLogEvent: CreateContactLogEventTriggerType =
  function createContactLogEvent(
    studentUserEntityId,
    payload,
    onSuccess,
    onFail
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        const contactLogs = JSON.parse(
          JSON.stringify(getState().guider.currentStudent.contactLogs)
        ) as IContactLogs;

        await promisify(
          mApi().guider.student.contactLog.create(studentUserEntityId, payload),
          "callback"
        )().then((contactLog: IContactLogEvent) => {
          contactLogs.results = [...[contactLog], ...contactLogs.results];
          contactLogs.totalHitCount = contactLogs.totalHitCount + 1;

          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: contactLogs,
            },
          });
        });
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.successMessage.contactLogs.contactLog.onCreate"
            ),
            "success"
          )
        );
        onSuccess && onSuccess();
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
            getState().i18n.text.get(
              "plugin.guider.errorMessage.contactLogs.contactLog.onCreate"
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        onFail && onFail();
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }
    };
  };

/**
 * deleteContactLogEvent thunk action creator
 * @param studentUserEntityId id for the user in subject
 * @param contactLogEntryId contact log entry to be deleted
 * @param onSuccess callback
 * @param onFail callback
 * @returns a thunk function for deleting a contact log event
 */
const deleteContactLogEvent: DeleteContactLogEventTriggerType =
  function deleteContactLogEvent(
    studentUserEntityId,
    contactLogEntryId,
    onSuccess,
    onFail
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
            getState().i18n.text.get(
              "plugin.guider.successMessage.contactLogs.contactLog.onDelete"
            ),
            "success"
          )
        );
        onSuccess && onSuccess();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errorMessage.contactLogs.contactLog.onDelete"
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        onFail && onFail();
      }
    };
  };

/**
 * editContactLogEvent thunk action creator
 * @param studentUserEntityId student user id
 * @param contactLogEntryId id of the edited contact log
 * @param payload edit payload
 * @param onSuccess callback
 * @param onFail callback
 * @returns a thunk function for editing a contact log event
 */
const editContactLogEvent: EditContactLogEventTriggerType =
  function editContactLogEvent(
    studentUserEntityId,
    contactLogEntryId,
    payload,
    onSuccess,
    onFail
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        await promisify(
          mApi().guider.student.contactLog.update(
            studentUserEntityId,
            contactLogEntryId,
            payload
          ),
          "callback"
        )().then((contactLog: IContactLogEvent) => {
          // Make a deep copy of the current state of contactLogs
          const contactLogs = JSON.parse(
            JSON.stringify(getState().guider.currentStudent.contactLogs)
          ) as IContactLogs;

          // Find the index of the edited contactLog
          const contactLogIndex = contactLogs.results.findIndex(
            (log) => log.id === contactLog.id
          );

          // Replace the edited contactLog with the new one
          contactLogs.results.splice(contactLogIndex, 1, contactLog);

          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: contactLogs,
            },
          });
        });
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.successMessage.contactLogs.contactLog.onEdit"
            ),
            "success"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        onSuccess && onSuccess();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.successMessage.contactLogs.contactLog.onEdit"
            ),
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
        onFail && onFail();
      }
    };
  };

/**
 * createContactLogEventComment thunk action creator
 * @param studentUserEntityId id for the user in subject
 * @param contactLogEntryId id for the parent entry
 * @param payload event data payload
 * @param onSuccess callback
 * @param onFail callback
 * @returns a thunk function for creating a contact log event comment
 */
const createContactLogEventComment: CreateContactLogEventCommentTriggerType =
  function createContactLogEventComment(
    studentUserEntityId,
    contactLogEntryId,
    payload,
    onSuccess,
    onFail
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        await promisify(
          mApi().guider.student.contactLog.comments.create(
            studentUserEntityId,
            contactLogEntryId,
            payload
          ),
          "callback"
        )().then((comment: IContactLogEventComment) => {
          // Make a deep copy of the current state contactLogs

          const contactLogs = JSON.parse(
            JSON.stringify(getState().guider.currentStudent.contactLogs)
          ) as IContactLogs;

          const contactLogResults = contactLogs.results;

          // Add the new comment to the current contactEvent
          const contactEvent = contactLogResults.find(
            (log) => log.id === comment.entry
          );
          contactEvent.comments.push(comment);

          // Find the index of the updated contactevent
          const contactEventIndex = contactLogResults.findIndex(
            (log) => log.id === contactEvent.id
          );

          // Replace the existing contactEvent at the correct index
          contactLogResults.splice(contactEventIndex, 1, contactEvent);

          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: contactLogs,
            },
          });
        });
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.successMessage.contactLogs.contactLogComment.onCreate"
            ),
            "success"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        onSuccess && onSuccess();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errorMessage.contactLogs.contactLogComment.onCreate"
            ),
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
        onFail && onFail();
      }
    };
  };

/**
 * deleteContactLogEventComment thunk action creator
 * @param studentUserEntityId id for the user in subject
 * @param contactLogEntryId id of the parent entry
 * @param commentId id for the comment
 * @param onSuccess callback
 * @param onFail callback
 * @returns a thunk function for deleting a contact log event comment
 */
const deleteContactLogEventComment: DeleteContactLogEventCommentTriggerType =
  function deleteContactLogEventComment(
    studentUserEntityId,
    contactLogEntryId,
    commentId,
    onSuccess,
    onFail
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
            getState().i18n.text.get(
              "plugin.guider.successMessage.contactLogs.contactLogComment.onDelete"
            ),
            "success"
          )
        );
        onSuccess && onSuccess();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.guider.errorMessage.contactLogs.contactLogComment.onDelete"
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_GUIDER_ALL_PROPS",
          payload: {
            currentState: <GuiderCurrentStudentStateType>"ERROR",
          },
        });
        onFail && onFail();
      }
    };
  };

/**
 * editContactLogEventComment thunk action creator
 * @param studentUserEntityId id for the user in subject
 * @param contactLogEntryId id for the parent entry
 * @param commentId id for the comment to be edited
 * @param payload event data payload
 * @param onSuccess callback
 * @param onFail callback
 * @returns a thunk function for editing a contact log event
 */
const editContactLogEventComment: EditContactLogEventCommentTriggerType =
  function editContactLogEventComment(
    studentUserEntityId,
    contactLogEntryId,
    commentId,
    payload,
    onSuccess,
    onFail
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        await promisify(
          mApi().guider.student.contactLog.comments.update(
            studentUserEntityId,
            contactLogEntryId,
            commentId,
            payload
          ),
          "callback"
        )().then((comment: IContactLogEventComment) => {
          // Make a deep copy of the current state contactLogs

          const contactLogs = JSON.parse(
            JSON.stringify(getState().guider.currentStudent.contactLogs)
          ) as IContactLogs;

          const contactLogsResults = [
            ...getState().guider.currentStudent.contactLogs.results,
          ];

          // find the current contactEvent
          const contactEvent = contactLogsResults.find(
            (log) => log.id === comment.entry
          );

          // get the index number of the comment inside the contactEvent
          const commmentIndex = contactEvent.comments.findIndex(
            (c) => c.id === comment.id
          );

          // replace the comment with the updated comment
          contactEvent.comments.splice(commmentIndex, 1, comment);

          // find the index of the current contactEvent
          const contactEventIndex = contactLogsResults.findIndex(
            (log) => log.id === contactEvent.id
          );

          // Replace the existing contactEvent at the correct index
          contactLogsResults.splice(contactEventIndex, 1, contactEvent);

          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: {
              property: "contactLogs",
              value: contactLogs,
            },
          });

          dispatch(
            notificationActions.displayNotification(
              getState().i18n.text.get(
                "plugin.guider.successMessage.contactLogs.contactLogComment.onEdit"
              ),
              "success"
            )
          );
          onSuccess && onSuccess();
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
            getState().i18n.text.get(
              "plugin.guider.errormessage.contactLogs.contactLogComment.onEdit"
            ),
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
        onFail && onFail();
      }
    };
  };

/**
 *
 * Updates and return hops phase for current student
 *
 * @param data data
 */
const updateCurrentStudentHopsPhase: UpdateCurrentStudentHopsPhaseTriggerType =
  function updateCurrentStudentHopsPhase(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const properties: any = await promisify(
          mApi().user.property.create({
            key: "hopsPhase",
            value: data.value,
            userEntityId: getState().guider.currentStudent.basic.userEntityId,
          }),
          "callback"
        )();

        dispatch({
          type: "UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE",
          payload: {
            property: "hopsPhase",
            value: properties.value,
          },
        });

        dispatch(
          notificationActions.displayNotification(
            "HOPS-vaiheen päivittäminen onnistui.",
            "success"
          )
        );
      } catch (err) {
        dispatch(notificationActions.displayNotification(err.message, "error"));
      }
    };
  };

/**
 * removeLabelFromUserUtil utility function
 * @param student student
 * @param flags student flags
 * @param label flags to be remover
 * @param dispatch action dispatch function
 * @param getState getstate method
 */
async function removeLabelFromUserUtil(
  student: GuiderStudentType,
  flags: Array<GuiderStudentUserProfileLabelType>,
  label: GuiderUserLabelType,
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  try {
    const relationLabel: GuiderStudentUserProfileLabelType = flags.find(
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

/**
 * addLabelToUserUtil util function
 * @param student student
 * @param flags student flags
 * @param label flags to be remover
 * @param dispatch action dispatch function
 * @param getState getstate method
 */
async function addLabelToUserUtil(
  student: GuiderStudentType,
  flags: Array<GuiderStudentUserProfileLabelType>,
  label: GuiderUserLabelType,
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  try {
    const relationLabel: GuiderStudentUserProfileLabelType = flags.find(
      (flag) => flag.flagId === label.id
    );
    if (!relationLabel) {
      const createdLabelRelation: GuiderStudentUserProfileLabelType = <
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

/**
 * addGuiderLabelToCurrentUser thunk action creator
 * @param label to be added
 * @returns a thunk function for adding labels to a user
 */
const addGuiderLabelToCurrentUser: AddGuiderLabelToCurrentUserTriggerType =
  function addGuiderLabelToCurrentUser(label) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const guider: GuiderType = getState().guider;
      const student = guider.currentStudent;
      addLabelToUserUtil(
        student.basic,
        student.labels,
        label,
        dispatch,
        getState
      );
    };
  };

/**
 * removeGuiderLabelFromCurrentUser thunk action creator
 * @param label label to be removed
 * @returns a thunk function for removing the label
 */
const removeGuiderLabelFromCurrentUser: RemoveGuiderLabelFromCurrentUserTriggerType =
  function removeGuiderLabelFromCurrentUser(label) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const guider: GuiderType = getState().guider;
      const student = guider.currentStudent;
      removeLabelFromUserUtil(
        student.basic,
        student.labels,
        label,
        dispatch,
        getState
      );
    };
  };

/**
 * addGuiderLabelToSelectedUsers thunk action creator
 * @param label label to be added
 * @returns a thunk function for adding a label
 */
const addGuiderLabelToSelectedUsers: AddGuiderLabelToSelectedUsersTriggerType =
  function addGuiderLabelToSelectedUsers(label) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const guider: GuiderType = getState().guider;
      guider.selectedStudents.forEach((student: GuiderStudentType) => {
        addLabelToUserUtil(student, student.flags, label, dispatch, getState);
      });
    };
  };
/**
 * removeGuiderLabelFromSelectedUsers thunk action creator
 * @param label to be added
 * @returns a thunk function for deleting a label
 */
const removeGuiderLabelFromSelectedUsers: RemoveGuiderLabelFromSelectedUsersTriggerType =
  function removeGuiderLabelFromSelectedUsers(label) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const guider: GuiderType = getState().guider;
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

/**
 *updateLabelFilters thunk action creator
 * @returns a thunk function for updating the label filters
 */
const updateLabelFilters: UpdateLabelFiltersTriggerType =
  function updateLabelFilters() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const currentUser = getState().status.userSchoolDataIdentifier;
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

/**
 * updateWorkspaceFilters thunk action creator
 * @returns a thunk function for updating the workspace filters
 */
const updateWorkspaceFilters: UpdateWorkspaceFiltersTriggerType =
  function updateWorkspaceFilters() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const currentUser = getState().status.userSchoolDataIdentifier;
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

/**
 * updateUserGroupFilters thunk action creator
 * @returns a thunk function for updating the usergroup filters
 */
const updateUserGroupFilters: UpdateWorkspaceFiltersTriggerType =
  function updateUserGroupFilters() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const currentUser = getState().status.userSchoolDataIdentifier;
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

/**
 * createGuiderFilterLabel thunk action creator
 * @param name label name
 * @returns thunk function for the flag creation
 */
const createGuiderFilterLabel: CreateGuiderFilterLabelTriggerType =
  function createGuiderFilterLabel(name) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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

      const currentUserSchoolDataIdentifier =
        getState().status.userSchoolDataIdentifier;

      const color: number = Math.round(Math.random() * 16777215);
      const label = {
        name,
        color: colorIntToHex(color),
        description: "",
        ownerIdentifier: currentUserSchoolDataIdentifier,
      };

      try {
        const newLabel: GuiderUserLabelType = <GuiderUserLabelType>(
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

/**
 * updateGuiderFilterLabel thunk action creator
 * @param data data object
 * @returns a thunk function for the label updating
 */
const updateGuiderFilterLabel: UpdateGuiderFilterLabelTriggerType =
  function updateGuiderFilterLabel(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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

      const newLabel: GuiderUserLabelType = Object.assign({}, data.label, {
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

/**
 * removeGuiderFilterLabel thunk action creator
 * @param data data object
 * @returns a thunk function to remove the label
 */
const removeGuiderFilterLabel: RemoveGuiderFilterLabelTriggerType =
  function removeGuiderFilterLabel(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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

/**
 * updateAvailablePurchaseProducts thunk action creator
 * @returns a thunk function to load the products
 */
const updateAvailablePurchaseProducts: UpdateAvailablePurchaseProductsTriggerType =
  function updateAvailablePurchaseProducts() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const value: PurchaseProductType[] = (await promisify(
          mApi().ceepos.products.read(),
          "callback"
        )()) as PurchaseProductType[];
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
/**
 * doOrderForCurrentStudent thunk action creator
 * @param order the ordered product
 * @returns a thunk function for creating the order
 */
const doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType =
  function doOrderForCurrentStudent(order: PurchaseProductType) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
        )()) as PurchaseType;
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

/**
 * deleteOrderFromCurrentStudent thunk action creator
 * @param order order to be deleted
 * @returns a thunk function for order deletion
 */
const deleteOrderFromCurrentStudent: DeleteOrderFromCurrentStudentTriggerType =
  function deleteOrderFromCurrentStudent(order: PurchaseType) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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

/**
 * completeOrderFromCurrentStudent action creator
 * @param order order to be completed
 * @returns a thunk function for order completion
 */
const completeOrderFromCurrentStudent: CompleteOrderFromCurrentStudentTriggerType =
  function completeOrderFromCurrentStudent(order: PurchaseType) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const value: PurchaseType = (await promisify(
          mApi().ceepos.manualCompletion.create(order.id),
          "callback"
        )()) as PurchaseType;

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
  loadStudentContactLogs,
  createContactLogEvent,
  deleteContactLogEvent,
  editContactLogEvent,
  createContactLogEventComment,
  deleteContactLogEventComment,
  editContactLogEventComment,
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
  updateCurrentStudentHopsPhase,
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
