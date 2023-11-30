import notificationActions from "~/actions/base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  AnnouncementsStateType,
  AnnouncementsStatePatch,
  AnnouncementsState,
} from "~/reducers/announcements";
import { loadAnnouncementsHelper } from "./helpers";
import { StateType } from "~/reducers";
import { loadUserGroupIndex } from "~/actions/user-index";
import i18n from "~/locales/i18n";
import {
  Announcement,
  CreateAnnouncementRequest,
  GetAnnouncementsRequest,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch } from "react-redux";
import * as moment from "moment";

export type UPDATE_ANNOUNCEMENTS_STATE = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS_STATE",
  AnnouncementsStateType
>;
export type UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
  AnnouncementsStatePatch
>;
export type UPDATE_SELECTED_ANNOUNCEMENTS = SpecificActionType<
  "UPDATE_SELECTED_ANNOUNCEMENTS",
  Announcement[]
>;
export type ADD_TO_ANNOUNCEMENTS_SELECTED = SpecificActionType<
  "ADD_TO_ANNOUNCEMENTS_SELECTED",
  Announcement
>;
export type REMOVE_FROM_ANNOUNCEMENTS_SELECTED = SpecificActionType<
  "REMOVE_FROM_ANNOUNCEMENTS_SELECTED",
  Announcement
>;
export type SET_CURRENT_ANNOUNCEMENT = SpecificActionType<
  "SET_CURRENT_ANNOUNCEMENT",
  Announcement
>;
export type UPDATE_ONE_ANNOUNCEMENT = SpecificActionType<
  "UPDATE_ONE_ANNOUNCEMENT",
  {
    update: Partial<Announcement>;
    announcement: Announcement;
  }
>;
export type DELETE_ANNOUNCEMENT = SpecificActionType<
  "DELETE_ANNOUNCEMENT",
  Announcement
>;
export type UPDATE_ANNOUNCEMENTS = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS",
  Announcement[]
>;

/**
 * LoadAnnouncementsAsAClientTriggerType
 */
export interface LoadAnnouncementsAsAClientTriggerType {
  (
    fetchParams: GetAnnouncementsRequest,
    options?: any,
    callback?: (announcements: Announcement[]) => any
  ): AnyActionType;
}

//TODO notOverrideCurrent should go once the missing data in the current announcement is fixed
/**
 * LoadAnnouncementsTriggerType
 */
export interface LoadAnnouncementsTriggerType {
  (
    location: string,
    workspaceId?: number,
    notOverrideCurrent?: boolean,
    force?: boolean
  ): AnyActionType;
}

/**
 * LoadAnnouncementTriggerType
 */
export interface LoadAnnouncementTriggerType {
  (
    location: string,
    announcementId: number,
    workspaceId?: number
  ): AnyActionType;
}

/**
 * AddToAnnouncementsSelectedTriggerType
 */
export interface AddToAnnouncementsSelectedTriggerType {
  (announcement: Announcement): AnyActionType;
}

/**
 * RemoveFromAnnouncementsSelectedTriggerType
 */
export interface RemoveFromAnnouncementsSelectedTriggerType {
  (announcement: Announcement): AnyActionType;
}

/**
 * UpdateAnnouncementTriggerType
 */
export interface UpdateAnnouncementTriggerType {
  (data: {
    announcement: Announcement;
    update: Partial<Announcement>;
    success?: () => any;
    fail?: () => any;
    cancelRedirect?: boolean;
  }): AnyActionType;
}

/**
 * DeleteAnnouncementTriggerType
 */
export interface DeleteAnnouncementTriggerType {
  (data: {
    announcement: Announcement;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * DeleteSelectedAnnouncementsTriggerType
 */
export interface DeleteSelectedAnnouncementsTriggerType {
  (): AnyActionType;
}

/**
 * CreateAnnouncementTriggerType
 */
export interface CreateAnnouncementTriggerType {
  (data: {
    announcement: CreateAnnouncementRequest;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * validateAnnouncement
 * @param dispatch dispatch
 * @param getState getState
 * @param announcement announcement
 */
function validateAnnouncement(
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType,
  announcement: CreateAnnouncementRequest
) {
  if (!announcement.caption) {
    dispatch(
      notificationActions.displayNotification(
        i18n.t("validation.caption", {
          ns: "messaging",
          context: "announcements",
        }),
        "error"
      )
    );
    return false;
  } else if (!announcement.content) {
    dispatch(
      notificationActions.displayNotification(
        i18n.t("validation.content", {
          ns: "messaging",
          context: "announcements",
        }),
        "error"
      )
    );
    return false;
  } else if (!announcement.endDate) {
    dispatch(
      notificationActions.displayNotification(
        i18n.t("validation.endDate", {
          ns: "messaging",
          context: "announcements",
        }),
        "error"
      )
    );
    return false;
  } else if (!announcement.startDate) {
    dispatch(
      notificationActions.displayNotification(
        i18n.t("validation.beginDate", {
          ns: "messaging",
          context: "announcements",
        }),
        "error"
      )
    );
    return false;
  }

  return true;
}

/**
 * loadAnnouncements
 * @param location location
 * @param workspaceId workspaceId
 * @param notOverrideCurrent notOverrideCurrent
 * @param force force
 */
const loadAnnouncements: LoadAnnouncementsTriggerType =
  function loadAnnouncements(location, workspaceId, notOverrideCurrent, force) {
    return loadAnnouncementsHelper.bind(
      this,
      location,
      workspaceId,
      notOverrideCurrent,
      force
    );
  };

/**
 * loadAnnouncement
 * @param location location
 * @param announcementId announcementId
 * @param workspaceId workspaceId
 */
const loadAnnouncement: LoadAnnouncementTriggerType = function loadAnnouncement(
  location,
  announcementId,
  workspaceId
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const state = getState();

    let announcement: Announcement = state.announcements.announcements.find(
      (a: Announcement) => a.id === announcementId
    );
    try {
      if (!announcement) {
        const announcerApi = MApi.getAnnouncerApi();

        // There is chance that user will try url with id that is not (anymore) available, then this try catch will take
        // care of it if that happens
        try {
          announcement = await announcerApi.getAnnouncement({
            announcementId,
          });

          announcement.userGroupEntityIds.forEach((id) =>
            dispatch(loadUserGroupIndex(id))
          );
          //TODO we should be able to get the information of wheter there is an announcement later or not, trace all this
          //and remove the unnecessary code

          //this is where notOverrideCurrent plays a role when loading all the other announcements after itself
          dispatch(loadAnnouncements(location, workspaceId, true, false));
        } catch (err) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.availableError", { ns: "messaging" }),
              "error"
            )
          );
        }
      } else {
        // load the user group entities if not loaded for that announcement
        // this doe not reload if it's found
        announcement.userGroupEntityIds.forEach((id) =>
          dispatch(loadUserGroupIndex(id))
        );
      }

      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
        payload: {
          location,
          current: announcement,
        },
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "messaging",
            context: "announcements",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * addToAnnouncementsSelected
 * @param announcement announcement
 */
const addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType =
  function addToAnnouncementsSelected(announcement) {
    return {
      type: "ADD_TO_ANNOUNCEMENTS_SELECTED",
      payload: announcement,
    };
  };

/**
 * removeFromAnnouncementsSelected
 * @param announcement announcement
 */
const removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType =
  function removeFromAnnouncementsSelected(announcement) {
    return {
      type: "REMOVE_FROM_ANNOUNCEMENTS_SELECTED",
      payload: announcement,
    };
  };

/**
 * updateAnnouncement
 * @param data data
 */
const updateAnnouncement: UpdateAnnouncementTriggerType =
  function updateAnnouncement(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      if (!validateAnnouncement(dispatch, getState, data.announcement)) {
        return data.fail && data.fail();
      }

      const announcerApi = MApi.getAnnouncerApi();

      try {
        const nAnnouncement: Announcement = Object.assign(
          {},
          data.announcement,
          data.update
        );

        await announcerApi.updateAnnouncement({
          announcementId: data.announcement.id,
          updateAnnouncementRequest: nAnnouncement,
        });

        const diff = moment(nAnnouncement.endDate).diff(moment(), "days");
        if (announcements.location !== "active" && diff >= 0) {
          if (data.cancelRedirect) {
            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              payload: data.announcement,
            });
            return;
          }
          location.hash = "#active";
        } else if (announcements.location !== "expired" && diff < 0) {
          if (data.cancelRedirect) {
            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              payload: data.announcement,
            });
            return;
          }
          location.hash = "#expired";
        } else {
          dispatch({
            type: "UPDATE_ONE_ANNOUNCEMENT",
            payload: {
              update: await announcerApi.getAnnouncement({
                announcementId: data.announcement.id,
              }),
              announcement: data.announcement,
            },
          });
        }
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "messaging",
              context: "announcement",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * deleteAnnouncement
 * @param data data
 */
const deleteAnnouncement: DeleteAnnouncementTriggerType =
  function deleteAnnouncement(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const announcerApi = MApi.getAnnouncerApi();

        await announcerApi.deleteAnnouncement({
          announcementId: data.announcement.id,
        });

        dispatch({
          type: "DELETE_ANNOUNCEMENT",
          payload: data.announcement,
        });
        data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail();
      }
    };
  };

/**
 * deleteSelectedAnnouncements
 */
const deleteSelectedAnnouncements: DeleteSelectedAnnouncementsTriggerType =
  function deleteSelectedAnnouncements() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;
      const announcerApi = MApi.getAnnouncerApi();

      await Promise.all(
        announcements.selected.map(async (announcement) => {
          try {
            await announcerApi.deleteAnnouncement({
              announcementId: announcement.id,
            });

            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              payload: announcement,
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }
            dispatch(
              notificationActions.displayNotification(
                i18n.t("notifications.removeError", {
                  ns: "messaging",
                  context: "announcement",
                }),
                "error"
              )
            );
          }
        })
      );
    };
  };

/**
 * createAnnouncement
 * @param data data
 */
const createAnnouncement: CreateAnnouncementTriggerType =
  function createAnnouncement(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      if (!validateAnnouncement(dispatch, getState, data.announcement)) {
        return data.fail && data.fail();
      }

      const announcerApi = MApi.getAnnouncerApi();

      try {
        await announcerApi.createAnnouncement({
          createAnnouncementRequest: data.announcement,
        });

        const diff = moment(data.announcement.endDate).diff(moment(), "days");
        if (announcements.location !== "active" && diff >= 0) {
          location.hash = "#active";
        } else if (announcements.location !== "expired" && diff < 0) {
          location.hash = "#expired";
        } else {
          //TODO why in the world the request to create the announcement does not return the created object?
          //I am forced to reload all the announcements due to being unable to know what was created
          dispatch(
            loadAnnouncements(
              announcements.location,
              announcements.workspaceId,
              true,
              true
            )
          );
        }
        data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              ns: "messaging",
              context: "announcement",
            }),
            "error"
          )
        );
        data.fail();
      }
    };
  };

/**
 * loadAnnouncementsAsAClient
 * @param fetchParams fetchParams
 * @param options options
 * @param callback callback
 */
const loadAnnouncementsAsAClient: LoadAnnouncementsAsAClientTriggerType =
  function loadAnnouncementsFromServer(
    fetchParams,
    options = { loadUserGroups: true },
    callback
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_STATE",
          payload: <AnnouncementsStateType>"LOADING",
        });

        const loadUserGroups = options.loadUserGroups;
        delete options.loadUserGroups;

        const announcerApi = MApi.getAnnouncerApi();
        const announcements = await announcerApi.getAnnouncements(fetchParams);

        if (loadUserGroups) {
          announcements.forEach((a) =>
            a.userGroupEntityIds.forEach((id) =>
              dispatch(loadUserGroupIndex(id))
            )
          );
        }

        const payload: AnnouncementsStatePatch = {
          state: "READY",
          announcements,
          location: null,
          selected: [],
          selectedIds: [],
        };

        //And there it goes
        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
          payload,
        });

        callback && callback(announcements);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "messaging",
              context: "announcements",
            }),
            "error"
          )
        );
      }
    };
  };

export {
  loadAnnouncements,
  addToAnnouncementsSelected,
  removeFromAnnouncementsSelected,
  updateAnnouncement,
  loadAnnouncement,
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  loadAnnouncementsAsAClient,
};
export default {
  loadAnnouncements,
  addToAnnouncementsSelected,
  removeFromAnnouncementsSelected,
  updateAnnouncement,
  loadAnnouncement,
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  loadAnnouncementsAsAClient,
};
