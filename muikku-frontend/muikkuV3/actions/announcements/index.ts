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
  AnnouncementCategory,
  CreateAnnouncementRequest,
  GetAnnouncementsRequest,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import moment from "moment";
import { Action, Dispatch } from "redux";
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
export type UPDATE_ANNOUNCEMENTS_UNREAD_COUNT = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS_UNREAD_COUNT",
  number
>;

export type ADD_ANNOUNCEMENT_CATEGORY = SpecificActionType<
  "ADD_ANNOUNCEMENT_CATEGORY",
  AnnouncementCategory
>;
export type DELETE_ANNOUNCEMENT_CATEGORY = SpecificActionType<
  "DELETE_ANNOUNCEMENT_CATEGORY",
  number
>;
export type UPDATE_ANNOUNCEMENT_CATEGORY = SpecificActionType<
  "UPDATE_ANNOUNCEMENT_CATEGORY",
  AnnouncementCategory
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
 * LoadMoreAnnouncementsTriggerType
 */
export interface LoadMoreAnnouncementsTriggerType {
  (): AnyActionType;
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
 * UpdateAnnouncementTriggerType
 */
export interface UpdateSelectedAnnouncementCategoryTriggerType {
  (
    category: AnnouncementCategory,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
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
 * DeleteAnnouncementCategoryTriggerType
 */
export interface DeleteAnnouncementCategoryTriggerType {
  (id: number, success?: () => void, fail?: () => void): AnyActionType;
}
/**
 * DeleteAnnouncementCategoryTriggerType
 */
export interface UpdateAnnouncementCategoryTriggerType {
  (data: {
    id: number;
    category: string;
    color: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * CreateAnnouncementTriggerType
 */
export interface CreateAnnouncementCategoryTriggerType {
  (data: {
    category: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

const announcerApi = MApi.getAnnouncerApi();

/**
 * validateAnnouncement
 * @param dispatch dispatch
 * @param getState getState
 * @param announcement announcement
 */
function validateAnnouncement(
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
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
      force,
      true // initial = true
    );
  };

/**
 * markAllAsRead
 * @param location location
 * @param workspaceId workspaceId
 */
const markAllAsRead: LoadAnnouncementsTriggerType = function markAllAsRead(
  location,
  workspaceId
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    try {
      await announcerApi.markAllAnnouncementsAsRead();
      dispatch(loadAnnouncements(location, workspaceId, false, true));
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.setAllUnreadError", {
            ns: "messaging",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * loadMoreAnnouncements
 */
const loadMoreAnnouncements: LoadMoreAnnouncementsTriggerType =
  function loadMoreAnnouncements() {
    return loadAnnouncementsHelper.bind(this, null, null, false, false, false);
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
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    let announcement: Announcement = state.announcements.announcements.find(
      (a: Announcement) => a.id === announcementId
    );
    try {
      if (!announcement) {
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

      // Mark as read if unread
      if (announcement.unread) {
        const unreadCount = state.announcements.unreadCount - 1;

        announcerApi.markAnnouncementAsRead({ announcementId });

        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_UNREAD_COUNT",
          payload: unreadCount,
        });
        dispatch({
          type: "UPDATE_ONE_ANNOUNCEMENT",
          payload: {
            update: { unread: false },
            announcement,
          },
        });
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      if (!validateAnnouncement(dispatch, getState, data.announcement)) {
        return data.fail && data.fail();
      }

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
 * updateAnnouncement
 * @param category category
 * @param success success
 * @param fail fail
 */
const updateSelectedAnnouncementCategories: UpdateSelectedAnnouncementCategoryTriggerType =
  function updateSelectedAnnouncementCategorie(category, success?, fail?) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;
      const categoryExistInAll = announcements.selected.every((announcement) =>
        announcement.categories.find((c) => c.id === category.id)
      );

      // Process announcements sequentially, Promise.all gave errors from backend
      for (let i = 0; i < announcements.selected.length; i++) {
        const announcement = announcements.selected[i];
        try {
          const announcementUpdate = { ...announcement };
          const categories: AnnouncementCategory[] = [
            ...announcement.categories,
          ];
          const categoryIndex = categories.findIndex(
            (c) => c.id === category.id
          );

          if (categoryIndex !== -1) {
            if (categoryExistInAll) {
              //remove category
              categories.splice(categoryIndex, 1);
            }
          } else {
            categories.push(category);
          }

          announcementUpdate.categories = categories;

          const updatedAnnouncement = await announcerApi.updateAnnouncement({
            announcementId: announcement.id,
            updateAnnouncementRequest: announcementUpdate,
          });

          dispatch({
            type: "UPDATE_ONE_ANNOUNCEMENT",
            payload: {
              update: updatedAnnouncement,
              announcement: announcement,
            },
          });

          success && success();
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
          fail && fail();
        }
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      if (!validateAnnouncement(dispatch, getState, data.announcement)) {
        return data.fail && data.fail();
      }

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
 * Create a new announcement category
 * @param data data
 * @returns a thunk action creator
 */
const createAnnouncementCategory: CreateAnnouncementCategoryTriggerType =
  function createAnnouncementCategory(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const color = Math.round(Math.random() * 16777215);
      const payload = {
        category: data.category,
        color,
      };

      try {
        const category = await announcerApi.createAnnouncementCategory({
          createAnnouncementCategoryRequest: payload,
        });

        dispatch({
          type: "ADD_ANNOUNCEMENT_CATEGORY",
          payload: category,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              ns: "messaging",
              context: "announcement category",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * Create a new announcement category
 * @param data data
 * @returns a thunk action creator
 */
const updateAnnouncementCategory: UpdateAnnouncementCategoryTriggerType =
  function updateAnnouncementCategory(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const payload = {
        category: data.category,
        color: data.color,
      };

      try {
        const category = await announcerApi.updateAnnouncementCategory({
          categoryId: data.id,
          createAnnouncementCategoryRequest: payload,
        });

        dispatch({
          type: "UPDATE_ANNOUNCEMENT_CATEGORY",
          payload: category,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              ns: "messaging",
              context: "announcement category",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * Create a new announcement category
 * @param id category id
 * @param success success callback
 * @param fail fail callback
 * @returns a thunk action creator
 */
const deleteAnnouncementCategory: DeleteAnnouncementCategoryTriggerType =
  function deleteAnnouncementCategory(id, success, fail) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        await announcerApi.deleteAnnouncementCategory({
          categoryId: id,
        });

        dispatch({
          type: "DELETE_ANNOUNCEMENT_CATEGORY",
          payload: id,
        });

        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              ns: "messaging",
              context: "announcement category",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * addLabelToAnnouncements
 * @param label label
 */

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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_STATE",
          payload: <AnnouncementsStateType>"LOADING",
        });

        const loadUserGroups = options.loadUserGroups;
        delete options.loadUserGroups;

        const announcements = await announcerApi.getAnnouncements(fetchParams);

        if (loadUserGroups) {
          announcements.announcements.forEach((a) =>
            a.userGroupEntityIds.forEach((id) =>
              dispatch(loadUserGroupIndex(id))
            )
          );
        }

        const payload: AnnouncementsStatePatch = {
          state: "READY",
          announcements: announcements.announcements,
          unreadCount: announcements.unreadCount,
          location: null,
          selected: [],
          selectedIds: [],
        };

        //And there it goes
        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
          payload,
        });

        callback && callback(announcements.announcements);
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
  markAllAsRead,
  loadAnnouncements,
  loadMoreAnnouncements,
  addToAnnouncementsSelected,
  removeFromAnnouncementsSelected,
  updateAnnouncement,
  updateSelectedAnnouncementCategories,
  loadAnnouncement,
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  createAnnouncementCategory,
  updateAnnouncementCategory,
  deleteAnnouncementCategory,
  loadAnnouncementsAsAClient,
};
export default {
  loadAnnouncements,
  loadMoreAnnouncements,
  addToAnnouncementsSelected,
  removeFromAnnouncementsSelected,
  updateAnnouncement,
  loadAnnouncement,
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  createAnnouncementCategory,
  loadAnnouncementsAsAClient,
};
