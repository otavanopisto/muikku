import { AnyActionType, SpecificActionType } from "~/actions";
import {
  GuiderActiveFiltersType,
  GuiderStatePatch,
  GuiderStudentsStateType,
  GuiderStudentUserProfileType,
  GuiderCurrentStudentStateType,
  GuiderState,
} from "~/reducers/main-function/guider";
import { loadStudentsHelper } from "./helpers";
import { UserFileType } from "reducers/user-index";
import notificationActions from "~/actions/base/notifications";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import { colorIntToHex } from "~/util/modifiers";
import { Dispatch, Action } from "redux";
import { LoadingState } from "~/@types/shared";
import {
  CeeposOrder,
  CeeposPurchaseProduct,
  ContactLog,
  ContactType,
  UserStudentFlag,
  UserFlag,
  UserGroup,
  FlaggedStudent,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";
import {
  RecordWorkspaceActivitiesWithLineCategory,
  RecordWorkspaceActivityByLine,
} from "~/components/general/records-history/types";

export type UPDATE_GUIDER_ACTIVE_FILTERS = SpecificActionType<
  "UPDATE_GUIDER_ACTIVE_FILTERS",
  GuiderActiveFiltersType
>;
export type UPDATE_GUIDER_ALL_PROPS = SpecificActionType<
  "UPDATE_GUIDER_ALL_PROPS",
  GuiderStatePatch
>;
export type UPDATE_GUIDER_STATE = SpecificActionType<
  "UPDATE_GUIDER_STATE",
  GuiderStudentsStateType
>;
export type ADD_TO_GUIDER_SELECTED_STUDENTS = SpecificActionType<
  "ADD_TO_GUIDER_SELECTED_STUDENTS",
  FlaggedStudent
>;
export type REMOVE_FROM_GUIDER_SELECTED_STUDENTS = SpecificActionType<
  "REMOVE_FROM_GUIDER_SELECTED_STUDENTS",
  FlaggedStudent
>;
export type SET_CURRENT_GUIDER_STUDENT = SpecificActionType<
  "SET_CURRENT_GUIDER_STUDENT",
  GuiderStudentUserProfileType
>;

export type SET_CURRENT_GUIDER_STUDENT_PROP = SpecificActionType<
  "SET_CURRENT_GUIDER_STUDENT_PROP",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { property: keyof GuiderStudentUserProfileType; value: any }
>;

export type UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE = SpecificActionType<
  "UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE",
  { property: "hopsPhase"; value: string }
>;

export type UPDATE_CURRENT_GUIDER_STUDENT_STATE = SpecificActionType<
  "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
  GuiderCurrentStudentStateType
>;
export type UPDATE_GUIDER_INSERT_PURCHASE_ORDER = SpecificActionType<
  "UPDATE_GUIDER_INSERT_PURCHASE_ORDER",
  CeeposOrder
>;
export type DELETE_GUIDER_PURCHASE_ORDER = SpecificActionType<
  "DELETE_GUIDER_PURCHASE_ORDER",
  CeeposOrder
>;
export type UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER = SpecificActionType<
  "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER",
  CeeposOrder
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
  CeeposPurchaseProduct[]
>;

export type ADD_GUIDER_LABEL_TO_USER = SpecificActionType<
  "ADD_GUIDER_LABEL_TO_USER",
  {
    studentId: string;
    label: UserStudentFlag;
  }
>;
export type REMOVE_GUIDER_LABEL_FROM_USER = SpecificActionType<
  "REMOVE_GUIDER_LABEL_FROM_USER",
  {
    studentId: string;
    label: UserStudentFlag;
  }
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS",
  UserFlag[]
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES",
  WorkspaceDataType[]
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS",
  UserGroup[]
>;
export type UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL = SpecificActionType<
  "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL",
  UserFlag
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
 * LoadStudentAccessTriggerType action creator type
 */
export interface LoadStudentAccessTriggerType {
  (id: number, forceLoad?: boolean): AnyActionType;
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
      type: ContactType;
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
      type: ContactType;
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
  (student: FlaggedStudent): AnyActionType;
}

/**
 * RemoveFromGuiderSelectedStudentsTriggerType action creator type
 */
export interface RemoveFromGuiderSelectedStudentsTriggerType {
  (student: FlaggedStudent): AnyActionType;
}

/**
 * AddGuiderLabelToCurrentUserTriggerType action creator type
 */
export interface AddGuiderLabelToCurrentUserTriggerType {
  (label: UserFlag): AnyActionType;
}

/**
 * RemoveGuiderLabelFromCurrentUserTriggerType action creator type
 */
export interface RemoveGuiderLabelFromCurrentUserTriggerType {
  (label: UserFlag): AnyActionType;
}
/**
 * AddGuiderLabelToSelectedUsersTriggerType action creator type
 */
export interface AddGuiderLabelToSelectedUsersTriggerType {
  (label: UserFlag): AnyActionType;
}

/**
 * RemoveGuiderLabelFromSelectedUsersTriggerType action creator type
 */
export interface RemoveGuiderLabelFromSelectedUsersTriggerType {
  (label: UserFlag): AnyActionType;
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
    label: UserFlag;
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
    label: UserFlag;
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
  (order: CeeposPurchaseProduct): AnyActionType;
}

/**
 * DeleteOrderFromCurrentStudentTriggerType action creator type
 */
export interface DeleteOrderFromCurrentStudentTriggerType {
  (order: CeeposOrder): AnyActionType;
}

/**
 * CompleteOrderFromCurrentStudentTriggerType action creator type
 */
export interface CompleteOrderFromCurrentStudentTriggerType {
  (order: CeeposOrder): AnyActionType;
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        await guiderApi.deleteGuiderFile({
          fileId: file.id,
        });

        dispatch({
          type: "REMOVE_FILE_FROM_CURRENT_STUDENT",
          payload: file,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", { ns: "files" }),
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
 * loadStudentPedagogyFormAccess thunk action creator
 * @param userEntityId student muikku id
 * @param forceLoad should the load be forced
 * @returns a thunk functions to load student pedagogy form access
 */
const loadStudentPedagogyFormAccess: LoadStudentAccessTriggerType =
  function loadStudentPedagogyFormAccess(userEntityId, forceLoad) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      // if the access is loaded, do not load again
      if (
        getState().guider.currentStudent.pedagogyFormState === "READY" &&
        !forceLoad
      ) {
        return;
      }

      dispatch({
        type: "SET_CURRENT_GUIDER_STUDENT_PROP",
        payload: {
          property: "pedagogyFormState",
          value: <LoadingState>"LOADING",
        },
      });

      const pedagogyApi = MApi.getPedagogyApi();
      try {
        pedagogyApi
          .getPedagogyFormAccess({
            userEntityId,
          })
          .then((pedagogyFormAvaibility) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: {
                property: "pedagogyFormAvailable",
                value: pedagogyFormAvaibility,
              },
            });
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: {
                property: "pedagogyFormState",
                value: <LoadingState>"READY",
              },
            });
          });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "guider",
              context: "pedagogyFormAccess",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadStudent thunk action creator
 * @param id student id
 * @returns a thunk function for loading the student data
 */
const loadStudent: LoadStudentTriggerType = function loadStudent(id) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const hopsApi = MApi.getHopsApi();
    const hopsUppersecondaryApi = MApi.getHopsUpperSecondaryApi();
    const guiderApi = MApi.getGuiderApi();
    const userApi = MApi.getUserApi();
    const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();
    const ceeposApi = MApi.getCeeposApi();
    const pedagogyApi = MApi.getPedagogyApi();
    const usergroupApi = MApi.getUsergroupApi();
    const activitylogsApi = MApi.getActivitylogsApi();

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
        guiderApi
          .getGuiderStudent({
            studentId: id,
          })
          .then((student) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "basic", value: student },
            });

            // If user has LIST_USER_ORDERS permission AND student has ceeposLine set then dispatchin is possible
            if (
              getState().status.permissions.LIST_USER_ORDERS &&
              getState().guider.currentStudent.basic.ceeposLine !== null
            ) {
              dispatch(updateAvailablePurchaseProducts());
            }

            // After basic data is loaded, check if current user of guider has permissions
            // to see/use current student hops
            hopsApi
              .isHopsAvailable({
                studentIdentifier: id,
              })
              .then(async (hopsAvailable) => {
                dispatch({
                  type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                  payload: {
                    property: "hopsAvailable",
                    value: hopsAvailable,
                  },
                });

                // after basic data is loaded and hops availability checked, then check if hopsPhase property
                // is used and what values it contains
                const hopsPhase = await userApi.getUserProperties({
                  userEntityId: student.userEntityId,
                  properties: "hopsPhase",
                });

                dispatch({
                  type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                  payload: {
                    property: "hopsPhase",
                    value: hopsPhase[0].value,
                  },
                });
              });

            pedagogyApi
              .getPedagogyFormAccess({
                userEntityId: student.userEntityId,
              })
              .then((pedagogyFormAvaibility) => {
                dispatch({
                  type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                  payload: {
                    property: "pedagogyFormAvailable",
                    value: pedagogyFormAvaibility,
                  },
                });
              });
          }),

        usergroupApi
          .getUsergroups({ userIdentifier: id })
          .then((usergroups) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "usergroups", value: usergroups },
            });
          }),

        userApi
          .getStudentFlags({
            studentId: id,
            ownerIdentifier: currentUserSchoolDataIdentifier,
          })
          .then((labels) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "labels", value: labels },
            });
          }),

        userApi
          .getStudentPhoneNumbers({ studentId: id })
          .then((phoneNumbers) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "phoneNumbers", value: phoneNumbers },
            });
          }),

        userApi.getStudentEmails({ studentId: id }).then((emails) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "emails", value: emails },
          });
        }),

        userApi.getStudentAddresses({ studentId: id }).then((addresses) => {
          dispatch({
            type: "SET_CURRENT_GUIDER_STUDENT_PROP",
            payload: { property: "addresses", value: addresses },
          });
        }),

        guiderApi
          .getGuiderUserFiles({
            identifier: id,
          })
          .then((files) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "files", value: files },
            });
          }),

        hopsUppersecondaryApi
          .getHopsByUser({
            userIdentifier: id,
          })
          .then((hops) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "hops", value: hops },
            });
          }),

        guiderApi
          .getGuiderUserLatestNotification({
            identifier: id,
          })
          .then((notifications) => {
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: { property: "notifications", value: notifications },
            });
          }),

        guiderApi
          .getStudentWorkspaces({
            studentId: id,
            active: true,
          })
          .then(async (workspaces) => {
            // Note that this is a workaround for the fact that the API returns different type that current
            // frontend uses. This should be fixed in the future. Api returns type that is as close as possible
            // what returned data is.
            const workspacesWithAddons = workspaces as WorkspaceDataType[];

            if (workspacesWithAddons && workspacesWithAddons.length) {
              await Promise.all([
                Promise.all(
                  workspacesWithAddons.map(async (workspace, index) => {
                    const statistics =
                      await workspaceDiscussionApi.getWorkspaceDiscussionStatistics(
                        {
                          workspaceEntityId: workspace.id,
                          userIdentifier: id,
                        }
                      );
                    workspacesWithAddons[index].forumStatistics = statistics;
                  })
                ),
                Promise.all(
                  workspacesWithAddons.map(async (workspace, index) => {
                    const activityLogs =
                      await activitylogsApi.getWorkspaceActivityLogs({
                        userIdentifier: id,
                        workspaceEntityId: workspace.id,
                        from: new Date(new Date().getFullYear() - 2, 0),
                        to: new Date(),
                      });
                    workspacesWithAddons[index].activityLogs = activityLogs;
                  })
                ),
              ]);
            }
            dispatch({
              type: "SET_CURRENT_GUIDER_STUDENT_PROP",
              payload: {
                property: "currentWorkspaces",
                value: workspacesWithAddons,
              },
            });
          }),

        guiderApi
          .getGuiderUserWorkspaceActivity({
            identifier: id,
            includeTransferCredits: true,
            includeAssignmentStatistics: true,
          })
          .then(
            ({
              showCredits,
              completedCourseCredits,
              mandatoryCourseCredits,
            }) => {
              dispatch({
                type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                payload: {
                  property: "courseCredits",
                  value: {
                    completedCourseCredits,
                    mandatoryCourseCredits,
                    showCredits,
                  },
                },
              });
            }
          ),

        canListUserOrders &&
          ceeposApi
            .getCeeposUserOrders({ userIdentifier: id })
            .then((orders) => {
              dispatch({
                type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                payload: { property: "purchases", value: orders },
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
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "student",
          }),
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

const activitylogsApi = MApi.getActivitylogsApi();
const guiderApi = MApi.getGuiderApi();
const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

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
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    try {
      const pastHistoryLoaded =
        !!getState().guider.currentStudent.pastWorkspaces;
      const pastStudiesLoaded = !!getState().guider.currentStudent.pastStudies;

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
        activitylogsApi
          .getWorkspaceActivityLogs({
            userIdentifier: id,
            from: new Date(new Date().getFullYear() - 2, 0),
            to: new Date(),
          })
          .then((activityLogs) => {
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

      if (!pastHistoryLoaded || forceLoad) {
        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "pastWorkspacesState",
            value: <LoadingState>"LOADING",
          },
        });

        promises.push(
          guiderApi
            .getStudentWorkspaces({
              studentId: id,
              active: false,
            })
            .then(async (workspaces) => {
              // Note that this is a workaround for the fact that the API returns different type that current
              // frontend uses. This should be fixed in the future. Api returns type that is as close as possible
              // what returned data is.
              const workspacesWithAddons = workspaces as WorkspaceDataType[];

              if (workspacesWithAddons && workspacesWithAddons.length) {
                await Promise.all([
                  Promise.all(
                    workspacesWithAddons.map(async (workspace, index) => {
                      const statistics =
                        await workspaceDiscussionApi.getWorkspaceDiscussionStatistics(
                          {
                            workspaceEntityId: workspace.id,
                            userIdentifier: id,
                          }
                        );
                      workspacesWithAddons[index].forumStatistics = statistics;
                    })
                  ),
                  Promise.all(
                    workspacesWithAddons.map(async (workspace, index) => {
                      const activityLogs =
                        await activitylogsApi.getWorkspaceActivityLogs({
                          userIdentifier: id,
                          workspaceEntityId: workspace.id,
                          from: new Date(new Date().getFullYear() - 2, 0),
                          to: new Date(),
                        });

                      workspacesWithAddons[index].activityLogs = activityLogs;
                    })
                  ),
                ]);
              }

              dispatch({
                type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                payload: {
                  property: "pastWorkspaces",
                  value: workspacesWithAddons,
                },
              });
            })
        );
      }

      if (!pastStudiesLoaded || forceLoad) {
        dispatch({
          type: "SET_CURRENT_GUIDER_STUDENT_PROP",
          payload: {
            property: "pastStudiesState",
            value: <LoadingState>"LOADING",
          },
        });

        promises.push(
          guiderApi
            .getGuiderStudents({
              userIdentifier: id,
              includeInactiveStudents: true,
            })
            .then(async (users) => {
              //Then we sort them, alphabetically, using the id, these ids are like PYRAMUS-1 PYRAMUS-42 we want
              //The bigger number to be first
              users = users.sort((a, b) => {
                const aId = a.id.split("-")[2];
                const bId = b.id.split("-")[2];

                return parseInt(bId) - parseInt(aId);
              });

              // Get workspaces aka activities with line and category
              const workspaceWithActivity = await Promise.all(
                users.map(async (user) => {
                  const workspacesWithActivity =
                    guiderApi.getGuiderUserWorkspaceActivity({
                      identifier: id,
                      includeTransferCredits: true,
                      includeAssignmentStatistics: true,
                    });

                  return workspacesWithActivity;
                })
              );

              // Get active category index
              const activeCategoryIndex = workspaceWithActivity.findIndex(
                (a) => a.defaultLine
              );

              // Filter out default line and sort by line category (alphabetically)
              let sortedWorkspaceActivityData = workspaceWithActivity
                .filter((a) => !a.defaultLine)
                .sort((a, b) => {
                  if (a.lineCategory > b.lineCategory) {
                    return 1;
                  }
                  if (a.lineCategory < a.lineCategory) {
                    return -1;
                  }
                  return 0;
                });

              // Add default line to the beginning of the array
              // and then sorted array of non default lines
              sortedWorkspaceActivityData = [
                workspaceWithActivity[activeCategoryIndex],
                ...sortedWorkspaceActivityData,
              ];

              // Helper object to hold category specific data
              const helperObject: {
                [category: string]: {
                  credits: RecordWorkspaceActivityByLine[];
                  transferedCredits: RecordWorkspaceActivityByLine[];
                  completedCourseCredits: number;
                  mandatoryCourseCredits: number;
                  showCredits: boolean;
                };
              } = {};

              // Loop through workspaces and add them to helper object
              // by category
              sortedWorkspaceActivityData.forEach((workspaceActivity) => {
                const allCredits: RecordWorkspaceActivityByLine[] =
                  workspaceActivity.activities.map((a) => ({
                    lineName: workspaceActivity.lineName,
                    activity: a,
                  }));

                const credits = allCredits.filter(
                  (a) => a.activity.assessmentStates[0].state !== "transferred"
                );

                const transferedCredits = allCredits.filter(
                  (a) => a.activity.assessmentStates[0].state === "transferred"
                );

                // If category exists in helper object, add credits to it
                if (helperObject[workspaceActivity.lineCategory]) {
                  helperObject[workspaceActivity.lineCategory].credits =
                    helperObject[workspaceActivity.lineCategory].credits.concat(
                      credits
                    );

                  helperObject[
                    workspaceActivity.lineCategory
                  ].transferedCredits =
                    helperObject[
                      workspaceActivity.lineCategory
                    ].transferedCredits.concat(transferedCredits);
                } else {
                  // If category does not exist in helper object, create it and initialize it
                  helperObject[workspaceActivity.lineCategory] = {
                    credits: credits || [],
                    transferedCredits: transferedCredits || [],
                    completedCourseCredits:
                      workspaceActivity.completedCourseCredits,
                    mandatoryCourseCredits:
                      workspaceActivity.mandatoryCourseCredits,
                    showCredits: workspaceActivity.showCredits,
                  };
                }
              });

              const pastStudies: RecordWorkspaceActivitiesWithLineCategory[] =
                Object.entries(helperObject).map((a) => ({
                  lineCategory: a[0],
                  credits: a[1].credits,
                  transferCredits: a[1].transferedCredits,
                  showCredits: a[1].showCredits,
                  completedCourseCredits: a[1].completedCourseCredits,
                  mandatoryCourseCredits: a[1].mandatoryCourseCredits,
                }));

              dispatch({
                type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                payload: {
                  property: "pastStudies",
                  value: pastStudies,
                },
              });
              dispatch({
                type: "SET_CURRENT_GUIDER_STUDENT_PROP",
                payload: {
                  property: "pastStudiesState",
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
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "student",
          }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

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

        await guiderApi
          .getGuiderUserContactLog({
            userId: id,
            resultsPerPage,
            page,
          })
          .then((contactLogs) => {
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
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "student",
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
        const contactLogs = JSON.parse(
          JSON.stringify(getState().guider.currentStudent.contactLogs)
        ) as ContactLog;

        await guiderApi
          .createContactLogEvents({
            studentId: studentUserEntityId,
            createContactLogEventsRequest: payload,
          })
          .then((contactLogEvent) => {
            contactLogs.results = [contactLogEvent, ...contactLogs.results];
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
            i18n.t("notifications.createSuccess", {
              ns: "messaging",
              context: "contactLog",
            }),
            "success"
          )
        );
        onSuccess && onSuccess();
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              ns: "messaging",
              context: "contactLog",
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        await guiderApi.deleteContactLogEvent({
          studentId: studentUserEntityId,
          entryId: contactLogEntryId,
        });

        dispatch({
          type: "DELETE_CONTACT_EVENT",
          payload: contactLogEntryId,
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeSuccess", {
              ns: "messaging",
              context: "contactLog",
            }),
            "success"
          )
        );
        onSuccess && onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "messaging",
              context: "contactLog",
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        await guiderApi
          .updateContactLogEvent({
            studentId: studentUserEntityId,
            entryId: contactLogEntryId,
            updateContactLogEventRequest: payload,
          })
          .then((contactLogEvent) => {
            // Make a deep copy of the current state of contactLogs
            const contactLogs = JSON.parse(
              JSON.stringify(getState().guider.currentStudent.contactLogs)
            ) as ContactLog;

            // Find the index of the edited contactLog
            const contactLogIndex = contactLogs.results.findIndex(
              (log) => log.id === contactLogEvent.id
            );

            // Replace the edited contactLog with the new one
            contactLogs.results.splice(contactLogIndex, 1, contactLogEvent);

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
            i18n.t("notifications.updateSuccess", {
              ns: "messaging",
              context: "contactLog",
            }),
            "success"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        onSuccess && onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "messaging",
              context: "contactLog",
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        await guiderApi
          .createContactLogEventComment({
            studentId: studentUserEntityId,
            entryId: contactLogEntryId,
            createContactLogEventCommentRequest: payload,
          })
          .then((comment) => {
            // Make a deep copy of the current state contactLogs

            const contactLogs = JSON.parse(
              JSON.stringify(getState().guider.currentStudent.contactLogs)
            ) as ContactLog;

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
            i18n.t("notifications.createSuccess", { context: "comment" }),
            "success"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        onSuccess && onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              context: "comment",
              error: err.message,
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        await guiderApi.deleteContactLogEventComment({
          studentId: studentUserEntityId,
          entryId: contactLogEntryId,
          commentId,
        });

        dispatch({
          type: "DELETE_CONTACT_EVENT_COMMENT",
          payload: { contactLogEntryId, commentId },
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeSuccess", { context: "comment" }),
            "success"
          )
        );
        onSuccess && onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", { context: "comment" }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      try {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });

        await guiderApi
          .updateContactLogEventComment({
            studentId: studentUserEntityId,
            entryId: contactLogEntryId,
            commentId,
            updateContactLogEventCommentRequest: payload,
          })
          .then((comment) => {
            // Make a deep copy of the current state contactLogs

            const contactLogs = JSON.parse(
              JSON.stringify(getState().guider.currentStudent.contactLogs)
            ) as ContactLog;

            const contactLogsResults = [...contactLogs.results];

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
                i18n.t("notifications.updateSuccess", { context: "comment" }),
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
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              context: "comment",
              error: err.message,
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();

      try {
        const properties = await userApi.setUserProperty({
          setUserPropertyRequest: {
            key: "hopsPhase",
            value: data.value,
            userEntityId: getState().guider.currentStudent.basic.userEntityId,
          },
        });

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
        if (!isMApiError(err)) {
          throw err;
        }
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
  student: FlaggedStudent,
  flags: UserStudentFlag[],
  label: UserFlag,
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
  getState: () => StateType
) {
  const userApi = MApi.getUserApi();

  try {
    const relationLabel: UserStudentFlag = flags.find(
      (flag) => flag.flagId === label.id
    );
    if (relationLabel) {
      await userApi.deleteStudentFlag({
        studentId: student.id,
        flagId: relationLabel.id,
      });

      dispatch({
        type: "REMOVE_GUIDER_LABEL_FROM_USER",
        payload: {
          studentId: student.id,
          label: relationLabel,
        },
      });
    }
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }
    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.removeError", { ns: "flags" }),
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
  student: FlaggedStudent,
  flags: UserStudentFlag[],
  label: UserFlag,
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
  getState: () => StateType
) {
  const userApi = MApi.getUserApi();

  try {
    const relationLabel: UserStudentFlag = flags.find(
      (flag) => flag.flagId === label.id
    );
    if (!relationLabel) {
      const createdLabelRelation = await userApi.createStudentFlag({
        studentId: student.id,
        createStudentFlagRequest: {
          flagId: label.id,
          studentIdentifier: student.id,
        },
      });

      dispatch({
        type: "ADD_GUIDER_LABEL_TO_USER",
        payload: {
          studentId: student.id,
          label: createdLabelRelation,
        },
      });
    }
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }
    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.addError", { ns: "flags" }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guider: GuiderState = getState().guider;
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guider: GuiderState = getState().guider;
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guider: GuiderState = getState().guider;
      guider.selectedStudents.forEach((student) => {
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guider: GuiderState = getState().guider;
      guider.selectedStudents.forEach((student) => {
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const currentUser = getState().status.userSchoolDataIdentifier;
      const userApi = MApi.getUserApi();

      try {
        const flags = await userApi.getFlags({
          ownerIdentifier: currentUser,
        });

        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS",
          payload: flags || [],
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", { ns: "flags" }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();
      const currentUser = getState().status.userSchoolDataIdentifier;
      try {
        const workspaces = (await workspaceApi.getWorkspaces({
          userIdentifier: currentUser,
          includeInactiveWorkspaces: true,
          maxResults: 500,
          orderBy: ["alphabet"],
        })) as WorkspaceDataType[];

        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES",
          payload: workspaces || [],
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "workspaces",
            }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const usergroupApi = MApi.getUsergroupApi();

      const currentUser = getState().status.userSchoolDataIdentifier;
      try {
        const usergroups = await usergroupApi.getUsergroups({
          userIdentifier: currentUser,
          maxResults: 500,
        });

        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS",
          payload: usergroups || [],
        });
      } catch (err) {
        if (!isMApiError(err)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();

      if (!name) {
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.caption", { ns: "flags" }),
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
        const newLabel = await userApi.createFlag({
          createFlagRequest: {
            name: label.name,
            color: label.color,
            description: label.description,
            ownerIdentifier: label.ownerIdentifier,
          },
        });

        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL",
          payload: newLabel,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", { ns: "flags" }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();

      if (!data.name) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.caption", { ns: "flags" }),
            "error"
          )
        );
      }

      const newLabel: UserFlag = Object.assign({}, data.label, {
        name: data.name,
        description: data.description,
        color: data.color,
      });

      try {
        await userApi.updateFlag({
          flagId: data.label.id,
          updateFlagRequest: newLabel,
        });

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
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", { ns: "flags" }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();

      try {
        await userApi.deleteFlag({
          flagId: data.label.id,
        });

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
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", { ns: "flags" }),
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const ceeposApi = MApi.getCeeposApi();

      try {
        const state = getState();

        const products = await ceeposApi.getCeeposProducts({
          line: state.guider.currentStudent.basic.ceeposLine,
        });

        dispatch({
          type: "UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS",
          payload: products,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", { ns: "orders" }),
            "error"
          )
        );
      }
    };
  };
/**
 * doOrderForCurrentStudent thunk action creator
 * @param orderProduct the ordered product
 * @returns a thunk function for creating the order
 */
const doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType =
  function doOrderForCurrentStudent(orderProduct) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const ceeposApi = MApi.getCeeposApi();

      try {
        const state = getState();

        const newOrder = await ceeposApi.createCeeposOrder({
          createCeeposOrderRequest: {
            studentIdentifier: state.guider.currentStudent.basic.id,
            product: orderProduct,
          },
        });

        dispatch({
          type: "UPDATE_GUIDER_INSERT_PURCHASE_ORDER",
          payload: newOrder,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", { ns: "orders" }),
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
  function deleteOrderFromCurrentStudent(order: CeeposOrder) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const ceeposApi = MApi.getCeeposApi();

      try {
        await ceeposApi.deleteCeeposOrder({
          orderId: order.id,
        });

        dispatch({
          type: "DELETE_GUIDER_PURCHASE_ORDER",
          payload: order,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", { ns: "orders" }),
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
  function completeOrderFromCurrentStudent(order: CeeposOrder) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const ceeposApi = MApi.getCeeposApi();

      try {
        const completedOrder = await ceeposApi.createCeeposManualCompletion({
          orderId: order.id,
        });

        dispatch({
          type: "UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER",
          payload: completedOrder,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.completionError", { ns: "orders" }),
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
  loadStudentPedagogyFormAccess,
  // loadStudentGuiderRelations,
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
